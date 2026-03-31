import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import BannerPreview from './components/BannerPreview'
import EditorPanel from './components/EditorPanel'
import {
  BUILT_IN_TEMPLATE_OPTIONS,
  DEFAULT_TEMPLATE_ID,
  getBannerTemplate,
  getTemplateCardColors,
} from './config/bannerTemplates'
import {
  EMPTY_CSV_MAPPING,
  analyzeCsvData,
  buildFilePattern,
  buildHeaderSignature,
  createCsvSampleContent,
  createCsvTemplateContent,
  detectColumnMapping,
  detectMonthFromFileContext,
  getCurrentMonthName,
  parseCsvText,
} from './utils/csvBanner'

const TEMPLATE_WIDTH = 800
const TEMPLATE_HEIGHT = 400
const HISTORY_LIMIT = 80
const SAVED_LAYOUT_STORAGE_KEY = 'stock-banner-generator-saved-layout-v5'
const CSV_MAPPING_STORAGE_KEY = 'stock-banner-generator-csv-mappings-v1'
const TEMPLATE_LOCK_STORAGE_KEY = 'stock-banner-generator-template-lock-v1'
const SELECTED_TEMPLATES_STORAGE_KEY = 'stock-banner-generator-selected-templates-v2'
const DEFAULT_CSV_STATE = {
  fileName: '',
  columns: [],
  rows: [],
  mapping: EMPTY_CSV_MAPPING,
  detectedMapping: EMPTY_CSV_MAPPING,
  fallbackCategory: 'Equity',
  detectedMonth: '',
  mappingSource: 'auto-detected',
  headerSignature: '',
  filePattern: '',
  error: '',
}

function getActiveCardLayoutKey(reportType) {
  return reportType === 'weekly' ? 'weeklyRows' : 'monthlyCards'
}

function getSelectedTemplateIdFromState(state) {
  return (
    state?.selectedTemplateIds?.[state?.data?.reportType || 'monthly'] ||
    state?.selectedTemplateIds?.monthly ||
    state?.selectedTemplateId ||
    DEFAULT_TEMPLATE_ID
  )
}

function parseSelectedLayerId(layerId) {
  if (!layerId) {
    return null
  }

  if (layerId === 'logo') {
    return { kind: 'logo' }
  }

  if (layerId === 'heading' || layerId === 'extra' || layerId === 'disclaimer') {
    return { kind: 'bannerText', layer: layerId }
  }

  const cardFrameMatch = layerId.match(/^card-frame-(\d)$/)
  if (cardFrameMatch) {
    return { kind: 'cardFrame', cardIndex: Number(cardFrameMatch[1]) }
  }

  const cardTextMatch = layerId.match(/^card-(\d)-(category|value|duration|stock)$/)
  if (cardTextMatch) {
    return {
      kind: 'cardText',
      cardIndex: Number(cardTextMatch[1]),
      layer: cardTextMatch[2],
    }
  }

  return null
}

function createDefaultData() {
  return {
    reportType: 'monthly',
    month: getCurrentMonthName(),
    totalProfits: '120',
    extraCount: '116',
    cards: [
      { category: 'Equity', value: '7.6%', valueSuffix: '', duration: '9 Days', stockName: 'NETWEB' },
      { category: 'Futures', value: '\u20b930,905', valueSuffix: '/lot', duration: '3 Days', stockName: 'APLAPOLLO' },
      { category: 'Options', value: '35.78%', valueSuffix: '', duration: 'Same Day', stockName: 'NIFTY 50' },
      { category: 'Commodity', value: '9.04%', valueSuffix: '', duration: '2.1 Hours', stockName: 'CRUDEOIL' },
    ],
    disclaimer:
      'Investment in securities market are subject to market risks. Read all the related documents carefully before investing. The securities quoted are for illustration only and are not recommendatory. The information provided is intended for educational purposes only, for further disclosures, visit https://univest.in / Univest App.',
  }
}

function loadSelectedTemplateIds() {
  if (typeof window === 'undefined') {
    return {
      monthly: DEFAULT_TEMPLATE_ID,
      weekly: DEFAULT_TEMPLATE_ID,
    }
  }

  try {
    const raw = window.localStorage.getItem(SELECTED_TEMPLATES_STORAGE_KEY)
    if (!raw) {
      return {
        monthly: DEFAULT_TEMPLATE_ID,
        weekly: DEFAULT_TEMPLATE_ID,
      }
    }
    const parsed = JSON.parse(raw)
    return {
      monthly: parsed?.monthly || DEFAULT_TEMPLATE_ID,
      weekly: parsed?.weekly || parsed?.monthly || DEFAULT_TEMPLATE_ID,
    }
  } catch (error) {
    console.error('Failed to load selected templates', error)
  }

  return {
    monthly: DEFAULT_TEMPLATE_ID,
    weekly: DEFAULT_TEMPLATE_ID,
  }
}

function persistSelectedTemplateIds(templateIds) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(SELECTED_TEMPLATES_STORAGE_KEY, JSON.stringify(templateIds))
  } catch (error) {
    console.error('Failed to persist selected templates', error)
  }
}

function createCardTextStyle(templateId = DEFAULT_TEMPLATE_ID, reportType = 'monthly') {
  const template = getBannerTemplate(templateId)

  if (reportType === 'weekly') {
    return {
      category: { x: 0, y: 0, fontSize: 12.5, fontWeight: 900, letterSpacing: -0.01, fontStyle: 'normal', textTransform: 'uppercase', fontFamily: template.typography.cardFont, color: '' },
      value: { x: 0, y: 0, fontSize: 14.5, fontWeight: 900, letterSpacing: -0.03, fontStyle: 'normal', textTransform: 'none', fontFamily: template.typography.cardFont, color: '' },
      duration: { x: 0, y: 0, fontSize: 8.7, fontWeight: 700, letterSpacing: -0.015, fontStyle: 'normal', textTransform: 'none', fontFamily: template.typography.bodyFont, color: '' },
      stock: { x: 0, y: 0, fontSize: 11.5, fontWeight: 800, letterSpacing: -0.02, fontStyle: 'normal', textTransform: 'uppercase', fontFamily: template.typography.cardFont, color: '' },
    }
  }

  return {
    category: { x: 0, y: 0, fontSize: 14, fontWeight: 900, letterSpacing: 0, fontStyle: 'normal', textTransform: 'none', fontFamily: template.typography.cardFont, color: '' },
    value: { x: 0, y: 0, fontSize: 30, fontWeight: 900, letterSpacing: -0.05, fontStyle: 'normal', textTransform: 'none', fontFamily: template.typography.cardFont, color: '' },
    duration: { x: 0, y: -17, fontSize: 11.5, fontWeight: 700, letterSpacing: -0.025, fontStyle: 'normal', textTransform: 'none', fontFamily: template.typography.bodyFont, color: '' },
    stock: { x: 0, y: 0, fontSize: 13, fontWeight: 800, letterSpacing: -0.02, fontStyle: 'normal', textTransform: 'uppercase', fontFamily: template.typography.cardFont, color: '' },
  }
}

function createDefaultTextStyles(templateId = DEFAULT_TEMPLATE_ID, reportType = 'monthly') {
  const template = getBannerTemplate(templateId)

  if (reportType === 'weekly') {
    return {
      heading: { x: 0, y: 0, fontSize: 28, fontWeight: 800, letterSpacing: -0.02, fontStyle: 'normal', textTransform: 'none', fontFamily: template.typography.headingFont, color: '' },
      extra: { x: 0, y: 0, fontSize: 12.5, fontWeight: 700, letterSpacing: 0, fontStyle: 'normal', textTransform: 'uppercase', fontFamily: template.typography.headingFont, color: '' },
      disclaimer: { x: 0, y: 0, fontSize: 5.8, fontWeight: 400, letterSpacing: -0.005, fontStyle: 'normal', textTransform: 'none', fontFamily: template.typography.bodyFont, color: '' },
      cards: Array.from({ length: 4 }, () => createCardTextStyle(templateId, reportType)),
    }
  }

  return {
    heading: { x: 0, y: 4, fontSize: 35, fontWeight: 800, letterSpacing: 0, fontStyle: 'normal', textTransform: 'none', fontFamily: template.typography.headingFont, color: '' },
    extra: { x: 0, y: 0, fontSize: 18, fontWeight: 600, letterSpacing: 0, fontStyle: 'normal', textTransform: 'none', fontFamily: template.typography.headingFont, color: '' },
    disclaimer: { x: 0, y: 0, fontSize: 7.4, fontWeight: 400, letterSpacing: -0.01, fontStyle: 'normal', textTransform: 'none', fontFamily: template.typography.bodyFont, color: '' },
    cards: Array.from({ length: 4 }, () => createCardTextStyle(templateId, reportType)),
  }
}

function createDefaultLayoutStyles() {
  return {
    logo: { x: 342, y: -4, scale: 1 },
    monthlyCards: [
      { x: 60, y: 132, scale: 0.9 },
      { x: 233, y: 132, scale: 0.9 },
      { x: 406, y: 132, scale: 0.9 },
      { x: 579, y: 132, scale: 0.9 },
    ],
    weeklyRows: [
      { x: 58, y: 124, scale: 1 },
      { x: 58, y: 167, scale: 1 },
      { x: 58, y: 210, scale: 1 },
      { x: 58, y: 253, scale: 1 },
    ],
  }
}

function createDefaultCardColorStyles(templateId = DEFAULT_TEMPLATE_ID, cards = createDefaultData().cards) {
  return cards.map((card) => getTemplateCardColors(templateId, card.category))
}

function createTemplateTextStyles(templateId, reportType = 'monthly') {
  return createDefaultTextStyles(templateId, reportType)
}

function normalizeDesignState(maybeDesignState) {
  const selectedTemplateIds = maybeDesignState?.selectedTemplateIds || loadSelectedTemplateIds()
  const templateId =
    selectedTemplateIds?.[maybeDesignState?.data?.reportType || 'monthly'] ||
    maybeDesignState?.selectedTemplateId ||
    DEFAULT_TEMPLATE_ID
  const reportType = maybeDesignState?.data?.reportType || 'monthly'
  const defaults = createDefaultDesignState(templateId, reportType)
  const source = maybeDesignState ?? {}
  const legacyCards = source.layoutStyles?.cards ?? []

  return {
    data: {
      ...defaults.data,
      ...source.data,
      cards: defaults.data.cards.map((card, index) => ({
        ...card,
        ...(source.data?.cards?.[index] ?? {}),
      })),
    },
    textStyles: {
      ...defaults.textStyles,
      ...source.textStyles,
      cards: defaults.textStyles.cards.map((card, index) => ({
        ...card,
        ...(source.textStyles?.cards?.[index] ?? {}),
        category: {
          ...card.category,
          ...(source.textStyles?.cards?.[index]?.category ?? {}),
        },
        value: {
          ...card.value,
          ...(source.textStyles?.cards?.[index]?.value ?? {}),
        },
        duration: {
          ...card.duration,
          ...(source.textStyles?.cards?.[index]?.duration ?? {}),
        },
        stock: {
          ...card.stock,
          ...(source.textStyles?.cards?.[index]?.stock ?? {}),
        },
      })),
    },
    layoutStyles: {
      ...defaults.layoutStyles,
      ...source.layoutStyles,
      logo: {
        ...defaults.layoutStyles.logo,
        ...(source.layoutStyles?.logo ?? {}),
      },
      monthlyCards: defaults.layoutStyles.monthlyCards.map((card, index) => ({
        ...card,
        ...(source.layoutStyles?.monthlyCards?.[index] ?? legacyCards[index] ?? {}),
      })),
      weeklyRows: defaults.layoutStyles.weeklyRows.map((card, index) => ({
        ...card,
        ...(source.layoutStyles?.weeklyRows?.[index] ?? {}),
      })),
    },
    cardColorStyles: defaults.cardColorStyles.map((cardColors, index) => ({
      ...cardColors,
      ...(source.cardColorStyles?.[index] ?? {}),
    })),
    selectedTemplateIds: {
      ...defaults.selectedTemplateIds,
      ...(source.selectedTemplateIds ?? {}),
      weekly:
        source.selectedTemplateIds?.weekly ||
        source.selectedTemplateIds?.monthly ||
        source.selectedTemplateId ||
        defaults.selectedTemplateIds.weekly,
      monthly:
        source.selectedTemplateIds?.monthly ||
        source.selectedTemplateId ||
        defaults.selectedTemplateIds.monthly,
    },
    selectedTemplateId:
      source.selectedTemplateIds?.[reportType] ||
      source.selectedTemplateId ||
      templateId,
  }
}

function createDefaultDesignState(templateId, reportType = 'monthly') {
  const data = createDefaultData()
  const selectedTemplateIds = loadSelectedTemplateIds()
  const resolvedTemplateId = templateId || selectedTemplateIds[reportType] || selectedTemplateIds.monthly || DEFAULT_TEMPLATE_ID
  return {
    data: {
      ...data,
      reportType,
    },
    textStyles: createDefaultTextStyles(resolvedTemplateId, reportType),
    layoutStyles: createDefaultLayoutStyles(),
    cardColorStyles: createDefaultCardColorStyles(resolvedTemplateId, data.cards),
    selectedTemplateIds,
    selectedTemplateId: resolvedTemplateId,
  }
}

function loadSavedLayoutState() {
  if (typeof window === 'undefined') {
    return createDefaultDesignState()
  }

  try {
    const storedLayout = window.localStorage.getItem(SAVED_LAYOUT_STORAGE_KEY)
    if (storedLayout) {
      const parsedLayout = JSON.parse(storedLayout)
      if (parsedLayout?.data && parsedLayout?.textStyles && parsedLayout?.layoutStyles) {
        return normalizeDesignState(parsedLayout)
      }
    }
  } catch (error) {
    console.error('Failed to load saved layout', error)
  }

  return normalizeDesignState()
}

function persistSavedLayoutState(designState) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(SAVED_LAYOUT_STORAGE_KEY, JSON.stringify(designState))
  } catch (error) {
    console.error('Failed to persist saved layout', error)
  }
}

function loadStoredMappings() {
  if (typeof window === 'undefined') {
    return { headers: {}, files: {} }
  }

  try {
    const raw = window.localStorage.getItem(CSV_MAPPING_STORAGE_KEY)
    if (!raw) {
      return { headers: {}, files: {} }
    }
    const parsed = JSON.parse(raw)
    return {
      headers: parsed?.headers ?? {},
      files: parsed?.files ?? {},
    }
  } catch (error) {
    console.error('Failed to load remembered mappings', error)
    return { headers: {}, files: {} }
  }
}

function saveStoredMappings(nextMappings) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(CSV_MAPPING_STORAGE_KEY, JSON.stringify(nextMappings))
  } catch (error) {
    console.error('Failed to save remembered mappings', error)
  }
}

function loadTemplateLockState() {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    return window.localStorage.getItem(TEMPLATE_LOCK_STORAGE_KEY) === 'true'
  } catch (error) {
    console.error('Failed to load template lock', error)
  }

  return false
}

function persistTemplateLockState(isLocked) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(TEMPLATE_LOCK_STORAGE_KEY, String(isLocked))
  } catch (error) {
    console.error('Failed to persist template lock', error)
  }
}

function downloadTextFile(filename, content) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function pushHistory(current, nextPresent) {
  return {
    past: [...current.past.slice(-(HISTORY_LIMIT - 1)), current.present],
    present: nextPresent,
    future: [],
  }
}

function App() {
  const [history, setHistory] = useState(() => ({
    past: [],
    present: loadSavedLayoutState(),
    future: [],
  }))
  const [selectedLayerId, setSelectedLayerId] = useState(null)
  const [selectedLayerIds, setSelectedLayerIds] = useState([])
  const [editingLayerId, setEditingLayerId] = useState(null)
  const [isExporting, setIsExporting] = useState(false)
  const [previewScale, setPreviewScale] = useState(1)
  const [previewZoom, setPreviewZoom] = useState(1)
  const [showPreviewTools, setShowPreviewTools] = useState(false)
  const [mode, setMode] = useState('manual')
  const [csvState, setCsvState] = useState(DEFAULT_CSV_STATE)
  const [hasSavedLayout, setHasSavedLayout] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }
    try {
      return Boolean(window.localStorage.getItem(SAVED_LAYOUT_STORAGE_KEY))
    } catch {
      return false
    }
  })
  const [isTemplateLocked, setIsTemplateLocked] = useState(() => loadTemplateLockState())
  const [toastMessage, setToastMessage] = useState('')
  const previewStageRef = useRef(null)
  const bannerRef = useRef(null)

  const { data, textStyles, layoutStyles, cardColorStyles } = history.present
  const selectedTemplateId = getSelectedTemplateIdFromState(history.present)
  const selectedTemplateIds = history.present.selectedTemplateIds || loadSelectedTemplateIds()
  const selectedTemplate = useMemo(() => getBannerTemplate(selectedTemplateId), [selectedTemplateId])
  const activeCardLayoutKey = getActiveCardLayoutKey(data.reportType)
  const activeCardLayouts = layoutStyles[activeCardLayoutKey]
  const effectivePreviewScale = Math.min(1.4, Math.max(0.6, previewScale * previewZoom))
  const canUndo = history.past.length > 0
  const canRedo = history.future.length > 0
  const csvAnalysis = useMemo(
    () =>
      analyzeCsvData({
        columns: csvState.columns,
        rows: csvState.rows,
        mapping: csvState.mapping,
        fallbackCategory: csvState.fallbackCategory,
        month: csvState.detectedMonth || data.month,
        disclaimer: data.disclaimer,
      }),
    [csvState.columns, csvState.rows, csvState.mapping, csvState.fallbackCategory, csvState.detectedMonth, data.month, data.disclaimer]
  )

  useEffect(() => {
    if (!previewStageRef.current) {
      return undefined
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      setPreviewScale(Math.min(1, entry.contentRect.width / TEMPLATE_WIDTH))
    })

    resizeObserver.observe(previewStageRef.current)
    return () => resizeObserver.disconnect()
  }, [])

  const applyDesignUpdate = useCallback((updater) => {
    setHistory((current) => {
      const nextPresent = updater(current.present)
      if (JSON.stringify(nextPresent) === JSON.stringify(current.present)) {
        return current
      }
      return pushHistory(current, nextPresent)
    })
  }, [])

  const pushToast = useCallback((message) => {
    setToastMessage(message)
  }, [])

  useEffect(() => {
    persistTemplateLockState(isTemplateLocked)
  }, [isTemplateLocked])

  useEffect(() => {
    persistSelectedTemplateIds(selectedTemplateIds)
  }, [selectedTemplateIds])

  useEffect(() => {
    if (!toastMessage) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setToastMessage('')
    }, 2200)

    return () => window.clearTimeout(timeoutId)
  }, [toastMessage])

  useEffect(() => {
    if (!csvState.columns.length || (!csvState.headerSignature && !csvState.filePattern)) {
      return
    }

    const storedMappings = loadStoredMappings()
    const nextStoredMappings = {
      headers: { ...storedMappings.headers },
      files: { ...storedMappings.files },
    }
    const nextEntry = {
      mapping: csvState.mapping,
      fallbackCategory: csvState.fallbackCategory,
    }

    if (csvState.headerSignature) {
      nextStoredMappings.headers[csvState.headerSignature] = nextEntry
    }
    if (csvState.filePattern) {
      nextStoredMappings.files[csvState.filePattern] = nextEntry
    }

    saveStoredMappings(nextStoredMappings)
  }, [csvState.columns.length, csvState.fallbackCategory, csvState.filePattern, csvState.headerSignature, csvState.mapping])

  const handleUndo = useCallback(() => {
    setHistory((current) => {
      if (!current.past.length) {
        return current
      }
      const previous = current.past[current.past.length - 1]
      return {
        past: current.past.slice(0, -1),
        present: previous,
        future: [current.present, ...current.future].slice(0, HISTORY_LIMIT),
      }
    })
  }, [])

  const handleRedo = useCallback(() => {
    setHistory((current) => {
      if (!current.future.length) {
        return current
      }
      const [next, ...rest] = current.future
      return {
        past: [...current.past.slice(-(HISTORY_LIMIT - 1)), current.present],
        present: next,
        future: rest,
      }
    })
  }, [])

  const handleExport = async () => {
    if (!bannerRef.current) {
      return
    }

    setIsExporting(true)
    try {
      await document.fonts.ready
      const dataUrl = await toPng(bannerRef.current, {
        cacheBust: true,
        backgroundColor: '#0f2e28',
        canvasWidth: TEMPLATE_WIDTH * 2,
        canvasHeight: TEMPLATE_HEIGHT * 2,
        pixelRatio: 1,
      })
      const link = document.createElement('a')
      const reportSlug =
        data.reportType === 'weekly'
          ? 'weekly'
          : `monthly-${data.month.toLowerCase().replace(/\s+/g, '-')}`
      link.download = `stock-banner-${reportSlug}.png`
      link.href = dataUrl
      link.click()
      pushToast('PNG downloaded')
    } catch (error) {
      console.error('Failed to export banner', error)
      pushToast('PNG export failed')
    } finally {
      setIsExporting(false)
    }
  }

  const handleSaveLayout = useCallback(() => {
    persistSavedLayoutState(history.present)
    setHasSavedLayout(true)
    pushToast('Layout saved')
  }, [history.present, pushToast])

  const handleResetToSaved = useCallback(() => {
    setHistory({
      past: [],
      present: loadSavedLayoutState(),
      future: [],
    })
    setSelectedLayerId(null)
    setSelectedLayerIds([])
    setEditingLayerId(null)
    pushToast('Restored saved layout')
  }, [pushToast])

  const handleResetToFactory = useCallback(() => {
    setHistory({
      past: [],
      present: createDefaultDesignState(),
      future: [],
    })
    setSelectedLayerId(null)
    setSelectedLayerIds([])
    setEditingLayerId(null)
    pushToast('Reset to default design')
  }, [pushToast])

  const selectSingleLayer = useCallback((layerId) => {
    setSelectedLayerId(layerId)
    setSelectedLayerIds(layerId ? [layerId] : [])
  }, [])

  const addLayerToSelection = useCallback((layerId) => {
    if (!layerId) {
      return
    }
    setSelectedLayerId(layerId)
    setSelectedLayerIds((current) => (current.includes(layerId) ? current : [...current, layerId]))
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedLayerId(null)
    setSelectedLayerIds([])
    setEditingLayerId(null)
  }, [])

  const handleTemplateLockChange = useCallback((nextValue) => {
    setIsTemplateLocked(nextValue)
    pushToast(nextValue ? 'Template locked' : 'Template unlocked')
  }, [pushToast])

  const handleModeChange = useCallback((nextMode) => {
    setMode(nextMode)
    pushToast(nextMode === 'auto' ? 'Auto mode enabled' : 'Manual mode enabled')
  }, [pushToast])

  const handleReportTypeChange = useCallback((nextReportType) => {
    const nextTemplateId =
      history.present.selectedTemplateIds?.[nextReportType] ||
      history.present.selectedTemplateIds?.monthly ||
      selectedTemplateId
    const nextTextStyles = createDefaultTextStyles(nextTemplateId, nextReportType)
    applyDesignUpdate((current) => ({
      ...current,
      data: {
        ...current.data,
        reportType: nextReportType,
      },
      selectedTemplateId: nextTemplateId,
      textStyles: nextTextStyles,
      cardColorStyles: current.data.cards.map((card) => getTemplateCardColors(nextTemplateId, card.category)),
    }))
    setSelectedLayerId(null)
    setSelectedLayerIds([])
    setEditingLayerId(null)
    pushToast(nextReportType === 'weekly' ? 'Weekly report enabled' : 'Monthly report enabled')
  }, [applyDesignUpdate, pushToast, selectedTemplateId, history.present.selectedTemplateIds])

  const handleCsvUpload = useCallback(async (file) => {
    if (!file) {
      return
    }

    try {
      const text = await file.text()
      const parsed = parseCsvText(text)
      const headerSignature = buildHeaderSignature(parsed.columns)
      const filePattern = buildFilePattern(file.name)
      const rememberedMappings = loadStoredMappings()
      const rememberedHeaderMatch = rememberedMappings.headers[headerSignature]
      const rememberedFileMatch = rememberedMappings.files[filePattern]
      const rememberedMatch = rememberedHeaderMatch || rememberedFileMatch || null
      const detectedMapping = rememberedMatch?.mapping || detectColumnMapping(parsed.columns)
      const detectedMonth = detectMonthFromFileContext(file.name, parsed.rows)

      setCsvState({
        fileName: file.name,
        columns: parsed.columns,
        rows: parsed.rows,
        mapping: detectedMapping,
        detectedMapping,
        fallbackCategory: rememberedMatch?.fallbackCategory || 'Equity',
        detectedMonth: detectedMonth || '',
        mappingSource: rememberedHeaderMatch ? 'remembered-header' : rememberedFileMatch ? 'remembered-file' : 'auto-detected',
        headerSignature,
        filePattern,
        error: '',
      })
      setMode('auto')
      pushToast(`CSV loaded: ${file.name}`)
    } catch (error) {
      setCsvState({
        ...DEFAULT_CSV_STATE,
        error: error instanceof Error ? error.message : 'Unable to parse CSV file.',
      })
      pushToast('CSV parse failed')
    }
  }, [pushToast])

  const handleCsvMappingChange = useCallback((field, value) => {
    setCsvState((current) => ({
      ...current,
      mapping: {
        ...current.mapping,
        [field]: value,
      },
      mappingSource: 'manual',
    }))
  }, [])

  const handleFallbackCategoryChange = useCallback((value) => {
    setCsvState((current) => ({
      ...current,
      fallbackCategory: value,
      mappingSource: 'manual',
    }))
  }, [])

  const handleClearCsv = useCallback(() => {
    setCsvState(DEFAULT_CSV_STATE)
    setMode('manual')
    pushToast('CSV cleared')
  }, [pushToast])

  const handleApplyAutoFill = useCallback(() => {
    if (!csvAnalysis.bannerData) {
      return
    }

    applyDesignUpdate((current) => ({
      ...current,
      data: {
        ...current.data,
        month: csvState.detectedMonth || csvAnalysis.bannerData.month || current.data.month,
        totalProfits: csvAnalysis.bannerData.totalProfits,
        extraCount: csvAnalysis.bannerData.extraCount,
        cards: csvAnalysis.bannerData.cards,
      },
    }))
    setMode('auto')
    pushToast('Auto fill applied')
  }, [applyDesignUpdate, csvAnalysis.bannerData, csvState.detectedMonth, pushToast])

  const handleDownloadCsvTemplate = useCallback(() => {
    downloadTextFile('stock-banner-template.csv', createCsvTemplateContent())
  }, [])

  const handleDownloadCsvSample = useCallback(() => {
    downloadTextFile('stock-banner-sample.csv', createCsvSampleContent())
  }, [])

  const updateField = useCallback((field, value) => {
    applyDesignUpdate((current) => ({
      ...current,
      data: { ...current.data, [field]: value },
    }))
  }, [applyDesignUpdate])

  const updateCardData = useCallback((cardIndex, field, value) => {
    applyDesignUpdate((current) => ({
      ...current,
      data: {
        ...current.data,
        cards: current.data.cards.map((card, index) =>
          index === cardIndex ? { ...card, [field]: value } : card
        ),
      },
      cardColorStyles:
        field === 'category'
          ? current.cardColorStyles.map((cardColors, index) =>
              index === cardIndex
                ? getTemplateCardColors(getSelectedTemplateIdFromState(current), value)
                : cardColors
            )
          : current.cardColorStyles,
    }))
  }, [applyDesignUpdate])

  const updateBannerTextStyle = useCallback((layer, updates) => {
    applyDesignUpdate((current) => ({
      ...current,
      textStyles: {
        ...current.textStyles,
        [layer]: { ...current.textStyles[layer], ...updates },
      },
    }))
  }, [applyDesignUpdate])

  const updateCardTextStyle = useCallback((cardIndex, layer, updates) => {
    applyDesignUpdate((current) => ({
      ...current,
      textStyles: {
        ...current.textStyles,
        cards: current.textStyles.cards.map((card, index) =>
          index === cardIndex ? { ...card, [layer]: { ...card[layer], ...updates } } : card
        ),
      },
    }))
  }, [applyDesignUpdate])

  const updateLogoLayout = useCallback((updates) => {
    applyDesignUpdate((current) => ({
      ...current,
      layoutStyles: {
        ...current.layoutStyles,
        logo: { ...current.layoutStyles.logo, ...updates },
      },
    }))
  }, [applyDesignUpdate])

  const updateCardLayout = useCallback((cardIndex, updates) => {
    applyDesignUpdate((current) => ({
      ...current,
      layoutStyles: {
        ...current.layoutStyles,
        [getActiveCardLayoutKey(current.data.reportType)]: current.layoutStyles[
          getActiveCardLayoutKey(current.data.reportType)
        ].map((card, index) =>
          index === cardIndex ? { ...card, ...updates } : card
        ),
      },
    }))
  }, [applyDesignUpdate])

  const updateCardColorStyle = useCallback((cardIndex, updates) => {
    applyDesignUpdate((current) => ({
      ...current,
      cardColorStyles: current.cardColorStyles.map((cardColors, index) =>
        index === cardIndex ? { ...cardColors, ...updates } : cardColors
      ),
    }))
  }, [applyDesignUpdate])

  const resetCardColorStyle = useCallback((cardIndex, category) => {
    applyDesignUpdate((current) => ({
      ...current,
      cardColorStyles: current.cardColorStyles.map((cardColors, index) =>
        index === cardIndex ? getTemplateCardColors(getSelectedTemplateIdFromState(current), category) : cardColors
      ),
    }))
  }, [applyDesignUpdate])

  const resetAllCardColorStyles = useCallback(() => {
    applyDesignUpdate((current) => ({
      ...current,
      cardColorStyles: current.data.cards.map((card) =>
        getTemplateCardColors(getSelectedTemplateIdFromState(current), card.category)
      ),
    }))
  }, [applyDesignUpdate])

  const handleTemplateChange = useCallback((templateId) => {
    const templateTextStyles = createTemplateTextStyles(templateId, data.reportType)
    applyDesignUpdate((current) => ({
      ...current,
      selectedTemplateIds: {
        ...(current.selectedTemplateIds || loadSelectedTemplateIds()),
        [current.data.reportType]: templateId,
      },
      selectedTemplateId: templateId,
      textStyles: {
        ...current.textStyles,
        heading: {
          ...current.textStyles.heading,
          fontFamily: templateTextStyles.heading.fontFamily,
        },
        extra: {
          ...current.textStyles.extra,
          fontFamily: templateTextStyles.extra.fontFamily,
        },
        disclaimer: {
          ...current.textStyles.disclaimer,
          fontFamily: templateTextStyles.disclaimer.fontFamily,
        },
        cards: current.textStyles.cards.map((cardText, index) => ({
          category: {
            ...cardText.category,
            fontFamily: templateTextStyles.cards[index].category.fontFamily,
          },
          value: {
            ...cardText.value,
            fontFamily: templateTextStyles.cards[index].value.fontFamily,
          },
          duration: {
            ...cardText.duration,
            fontFamily: templateTextStyles.cards[index].duration.fontFamily,
          },
          stock: {
            ...cardText.stock,
            fontFamily: templateTextStyles.cards[index].stock.fontFamily,
          },
        })),
      },
      cardColorStyles: current.data.cards.map((card) => getTemplateCardColors(templateId, card.category)),
    }))
    pushToast(`Template: ${getBannerTemplate(templateId).shortName}`)
  }, [applyDesignUpdate, pushToast, data.reportType])

  const handleMatchTemplateTypography = useCallback(() => {
    applyDesignUpdate((current) => {
      const templateTextStyles = createTemplateTextStyles(getSelectedTemplateIdFromState(current), current.data.reportType)
      return {
        ...current,
        textStyles: {
          ...current.textStyles,
          heading: {
            ...current.textStyles.heading,
            fontFamily: templateTextStyles.heading.fontFamily,
            color: '',
          },
          extra: {
            ...current.textStyles.extra,
            fontFamily: templateTextStyles.extra.fontFamily,
            color: '',
          },
          disclaimer: {
            ...current.textStyles.disclaimer,
            fontFamily: templateTextStyles.disclaimer.fontFamily,
            color: '',
          },
          cards: current.textStyles.cards.map((cardText, index) => ({
            category: {
              ...cardText.category,
              fontFamily: templateTextStyles.cards[index].category.fontFamily,
              color: '',
            },
            value: {
              ...cardText.value,
              fontFamily: templateTextStyles.cards[index].value.fontFamily,
              color: '',
            },
            duration: {
              ...cardText.duration,
              fontFamily: templateTextStyles.cards[index].duration.fontFamily,
              color: '',
            },
            stock: {
              ...cardText.stock,
              fontFamily: templateTextStyles.cards[index].stock.fontFamily,
              color: '',
            },
          })),
        },
      }
    })
  }, [applyDesignUpdate])

  const handleAutoFitText = useCallback(() => {
    applyDesignUpdate((current) => {
      const templateTextStyles = createTemplateTextStyles(getSelectedTemplateIdFromState(current), current.data.reportType)
      return {
        ...current,
        textStyles: {
          ...current.textStyles,
          heading: {
            ...current.textStyles.heading,
            fontSize: Math.min(current.textStyles.heading.fontSize, templateTextStyles.heading.fontSize),
          },
          extra: {
            ...current.textStyles.extra,
            fontSize: Math.min(current.textStyles.extra.fontSize, templateTextStyles.extra.fontSize),
          },
          disclaimer: {
            ...current.textStyles.disclaimer,
            fontSize: templateTextStyles.disclaimer.fontSize,
          },
          cards: current.textStyles.cards.map((cardText, index) => ({
            category: {
              ...cardText.category,
              fontSize: templateTextStyles.cards[index].category.fontSize,
            },
            value: {
              ...cardText.value,
              fontSize: templateTextStyles.cards[index].value.fontSize,
            },
            duration: {
              ...cardText.duration,
              fontSize: templateTextStyles.cards[index].duration.fontSize,
            },
            stock: {
              ...cardText.stock,
              fontSize: templateTextStyles.cards[index].stock.fontSize,
            },
          })),
        },
      }
    })
  }, [applyDesignUpdate])

  const handleCenterCards = useCallback(() => {
    applyDesignUpdate((current) => {
      const layoutKey = getActiveCardLayoutKey(current.data.reportType)
      const currentLayouts = current.layoutStyles[layoutKey]

      if (current.data.reportType === 'weekly') {
        return {
          ...current,
          layoutStyles: {
            ...current.layoutStyles,
            [layoutKey]: currentLayouts.map((row) => ({
              ...row,
              x: Number(((TEMPLATE_WIDTH - 684 * row.scale) / 2).toFixed(1)),
            })),
          },
        }
      }

      const widths = currentLayouts.map((card) => 162 * card.scale)
      const totalWidth = widths.reduce((sum, width) => sum + width, 0)
      const gap = Math.max(8, (TEMPLATE_WIDTH - totalWidth) / 5)
      let runningX = gap

      return {
        ...current,
        layoutStyles: {
          ...current.layoutStyles,
          [layoutKey]: currentLayouts.map((card, index) => {
            const nextCard = {
              ...card,
              x: Number(runningX.toFixed(1)),
            }
            runningX += widths[index] + gap
            return nextCard
          }),
        },
      }
    })
  }, [applyDesignUpdate])

  const handleCenterLogo = useCallback(() => {
    applyDesignUpdate((current) => ({
      ...current,
      layoutStyles: {
        ...current.layoutStyles,
        logo: {
          ...current.layoutStyles.logo,
          x: Number(((TEMPLATE_WIDTH - 116 * current.layoutStyles.logo.scale) / 2).toFixed(1)),
        },
      },
    }))
  }, [applyDesignUpdate])

  const nudgeSelectedLayer = useCallback(
    (deltaX, deltaY) => {
      if (isTemplateLocked) {
        return
      }
      const layerIds = selectedLayerIds.length ? selectedLayerIds : selectedLayerId ? [selectedLayerId] : []
      if (!layerIds.length) {
        return
      }

      applyDesignUpdate((current) => {
        const layoutKey = getActiveCardLayoutKey(current.data.reportType)
        const next = {
          ...current,
          textStyles: {
            ...current.textStyles,
            cards: [...current.textStyles.cards],
          },
          layoutStyles: {
            ...current.layoutStyles,
            [layoutKey]: [...current.layoutStyles[layoutKey]],
          },
        }

        layerIds.forEach((layerId) => {
          const selected = parseSelectedLayerId(layerId)
          if (!selected) {
            return
          }

          if (selected.kind === 'logo') {
            next.layoutStyles.logo = {
              ...next.layoutStyles.logo,
              x: next.layoutStyles.logo.x + deltaX,
              y: next.layoutStyles.logo.y + deltaY,
            }
          } else if (selected.kind === 'cardFrame') {
            const currentCard = next.layoutStyles[layoutKey][selected.cardIndex]
            next.layoutStyles[layoutKey][selected.cardIndex] = {
              ...currentCard,
              x: currentCard.x + deltaX,
              y: currentCard.y + deltaY,
            }
          } else if (selected.kind === 'bannerText') {
            next.textStyles[selected.layer] = {
              ...next.textStyles[selected.layer],
              x: next.textStyles[selected.layer].x + deltaX,
              y: next.textStyles[selected.layer].y + deltaY,
            }
          } else if (selected.kind === 'cardText') {
            const currentCardText = next.textStyles.cards[selected.cardIndex]
            next.textStyles.cards[selected.cardIndex] = {
              ...currentCardText,
              [selected.layer]: {
                ...currentCardText[selected.layer],
                x: currentCardText[selected.layer].x + deltaX,
                y: currentCardText[selected.layer].y + deltaY,
              },
            }
          }
        })

        return next
      })
    },
    [applyDesignUpdate, isTemplateLocked, selectedLayerId, selectedLayerIds]
  )

  const resizeSelectedLayer = useCallback(
    (delta) => {
      if (isTemplateLocked) {
        return
      }
      const layerIds = selectedLayerIds.length ? selectedLayerIds : selectedLayerId ? [selectedLayerId] : []
      if (!layerIds.length) {
        return
      }

      applyDesignUpdate((current) => {
        const layoutKey = getActiveCardLayoutKey(current.data.reportType)
        const next = {
          ...current,
          textStyles: {
            ...current.textStyles,
            cards: [...current.textStyles.cards],
          },
          layoutStyles: {
            ...current.layoutStyles,
            [layoutKey]: [...current.layoutStyles[layoutKey]],
          },
        }

        layerIds.forEach((layerId) => {
          const selected = parseSelectedLayerId(layerId)
          if (!selected) {
            return
          }

          if (selected.kind === 'logo') {
            next.layoutStyles.logo = {
              ...next.layoutStyles.logo,
              scale: Number(Math.max(0.2, next.layoutStyles.logo.scale + delta).toFixed(2)),
            }
          } else if (selected.kind === 'cardFrame') {
            const currentCard = next.layoutStyles[layoutKey][selected.cardIndex]
            next.layoutStyles[layoutKey][selected.cardIndex] = {
              ...currentCard,
              scale: Number(Math.max(0.2, currentCard.scale + delta).toFixed(2)),
            }
          } else if (selected.kind === 'bannerText') {
            next.textStyles[selected.layer] = {
              ...next.textStyles[selected.layer],
              fontSize: Number(Math.max(4, next.textStyles[selected.layer].fontSize + delta).toFixed(2)),
            }
          } else if (selected.kind === 'cardText') {
            const currentCardText = next.textStyles.cards[selected.cardIndex]
            next.textStyles.cards[selected.cardIndex] = {
              ...currentCardText,
              [selected.layer]: {
                ...currentCardText[selected.layer],
                fontSize: Number(Math.max(4, currentCardText[selected.layer].fontSize + delta).toFixed(2)),
              },
            }
          }
        })

        return next
      })
    },
    [applyDesignUpdate, isTemplateLocked, selectedLayerId, selectedLayerIds]
  )

  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target
      const isEditable =
        target instanceof HTMLElement &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)

      if (isEditable) {
        return
      }

      const isModifierPressed = event.ctrlKey || event.metaKey
      const key = event.key.toLowerCase()
      if (key === 'z' && !event.shiftKey) {
        if (isModifierPressed) {
          event.preventDefault()
          handleUndo()
        }
      } else if (key === 'y' || (key === 'z' && event.shiftKey)) {
        if (isModifierPressed) {
          event.preventDefault()
          handleRedo()
        }
      } else if (!isModifierPressed && ['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        event.preventDefault()
        const step = event.shiftKey ? 10 : 1
        if (key === 'arrowup') nudgeSelectedLayer(0, -step)
        if (key === 'arrowdown') nudgeSelectedLayer(0, step)
        if (key === 'arrowleft') nudgeSelectedLayer(-step, 0)
        if (key === 'arrowright') nudgeSelectedLayer(step, 0)
      } else if (!isModifierPressed && ['+', '=', '-', '_'].includes(event.key)) {
        event.preventDefault()
        const step = event.shiftKey ? 4 : 1
        if (event.key === '+' || event.key === '=') {
          resizeSelectedLayer(step)
        } else {
          resizeSelectedLayer(-step)
        }
      } else if (key === 'escape') {
        event.preventDefault()
        clearSelection()
      }
    }

    document.addEventListener('keydown', handleKeyDown, true)
    return () => document.removeEventListener('keydown', handleKeyDown, true)
  }, [clearSelection, handleRedo, handleUndo, nudgeSelectedLayer, resizeSelectedLayer])

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(40,116,90,0.22),_transparent_36%),linear-gradient(180deg,#071310_0%,#0a1714_100%)] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[1500px] flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="mb-5 flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white/5 px-5 py-5 shadow-[0_20px_80px_rgba(0,0,0,0.3)] backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-lg font-black tracking-tight text-white sm:text-[1.4rem]">
              Monthly Report Banner Gen WP-Comm
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-white/70">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">{selectedTemplate.name}</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">{mode === 'auto' ? 'Auto Mode' : 'Manual Mode'}</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">{csvState.rows.length ? `${csvState.rows.length} CSV Rows` : 'No CSV Loaded'}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleUndo}
              disabled={!canUndo}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/10 disabled:opacity-40"
            >
              Undo
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={!canRedo}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/10 disabled:opacity-40"
            >
              Redo
            </button>
            <button
              type="button"
              onClick={handleSaveLayout}
              className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/10"
            >
              Save Layout
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="rounded-full bg-[linear-gradient(135deg,#3fe391_0%,#23b86d_100%)] px-5 py-3 text-sm font-bold text-[#082116] shadow-[0_18px_40px_rgba(39,196,116,0.3)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isExporting ? 'Rendering PNG...' : 'Download PNG'}
            </button>
          </div>
        </header>

        <main className="grid flex-1 gap-5 xl:grid-cols-[minmax(0,1fr)_450px]">
          <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.28)] sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.36em] text-white/45">Live Preview</p>
                <p className="mt-1 text-sm text-white/60">CSV auto-fill ke baad bhi preview me content tune kiya ja sakta hai, aur lock mode accidental movement rokta hai.</p>
              </div>
              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold text-white/55">800 x 400</span>
            </div>

            <div ref={previewStageRef} className="overflow-hidden rounded-[24px] border border-white/8 bg-[#06110e] p-3">
              <div className="mb-3 rounded-[18px] border border-white/8 bg-black/20 px-3 py-2 text-xs text-white/70">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={handleAutoFitText} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-semibold text-white/80">Auto Fit Text</button>
                    <button type="button" onClick={handleCenterCards} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-semibold text-white/80">{data.reportType === 'weekly' ? 'Center Rows' : 'Center Cards'}</button>
                    <button type="button" onClick={clearSelection} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-semibold text-white/80">Clear Selection</button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPreviewTools((current) => !current)}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-semibold text-white/80"
                  >
                    {showPreviewTools ? 'Hide Tools' : 'More Tools'}
                  </button>
                </div>
                {showPreviewTools ? (
                  <div className="mt-2 flex flex-wrap gap-2 border-t border-white/8 pt-2">
                    <button type="button" onClick={() => setPreviewZoom((current) => Math.max(0.7, Number((current - 0.1).toFixed(2))))} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-semibold text-white/80">Zoom -</button>
                    <button type="button" onClick={() => setPreviewZoom(1)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-semibold text-white/80">{Math.round(previewZoom * 100)}%</button>
                    <button type="button" onClick={() => setPreviewZoom((current) => Math.min(1.35, Number((current + 0.1).toFixed(2))))} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-semibold text-white/80">Zoom +</button>
                    <button type="button" onClick={handleCenterLogo} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-semibold text-white/80">Center Logo</button>
                    <button type="button" onClick={handleMatchTemplateTypography} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-semibold text-white/80">Match Template Typography</button>
                    <button type="button" onClick={resetAllCardColorStyles} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-semibold text-white/80">Reset Card Colors</button>
                  </div>
                ) : null}
              </div>

              <div className="mx-auto origin-top transition-transform duration-200 ease-out" style={{ width: TEMPLATE_WIDTH, height: TEMPLATE_HEIGHT * effectivePreviewScale }}>
                <div style={{ transform: `scale(${effectivePreviewScale})`, transformOrigin: 'top center', width: TEMPLATE_WIDTH, height: TEMPLATE_HEIGHT }}>
                  <BannerPreview
                    ref={bannerRef}
                    data={data}
                    textStyles={textStyles}
                    layoutStyles={layoutStyles}
                    cardLayouts={activeCardLayouts}
                    cardColorStyles={cardColorStyles}
                    template={selectedTemplate}
                    selectedLayerId={selectedLayerId}
                    selectedLayerIds={selectedLayerIds}
                    editingLayerId={editingLayerId}
                    onSelectLayer={selectSingleLayer}
                    onAddLayerToSelection={addLayerToSelection}
                    onClearSelection={clearSelection}
                    onStartEditingLayer={setEditingLayerId}
                    onStopEditingLayer={() => setEditingLayerId(null)}
                    onFieldChange={updateField}
                    onCardDataChange={updateCardData}
                    onUpdateBannerTextStyle={updateBannerTextStyle}
                    onUpdateCardTextStyle={updateCardTextStyle}
                    onUpdateLogoLayout={updateLogoLayout}
                    onUpdateCardLayout={updateCardLayout}
                    onUpdateCardColorStyle={updateCardColorStyle}
                    isTemplateLocked={isTemplateLocked}
                  />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 rounded-[18px] border border-white/8 bg-black/20 px-3 py-2 text-xs text-white/65">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  Selected: {selectedLayerId || 'None'}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  Template: {selectedTemplate.shortName}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  Report: {data.reportType === 'weekly' ? 'Weekly' : 'Monthly'}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  Mode: {mode === 'auto' ? 'Auto' : 'Manual'}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  Export: 800x400 PNG
                </span>
              </div>
            </div>
          </section>

          <aside className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.28)] sm:p-5">
            <div className="mb-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.36em] text-white/45">Controls</p>
              <p className="mt-1 text-sm text-white/60">CSV upload, remembered mappings, auto-fill, reset presets, template lock aur layer styling sab yahin manage hoga.</p>
            </div>

            <EditorPanel
              data={data}
              textStyles={textStyles}
              layoutStyles={layoutStyles}
              cardLayouts={activeCardLayouts}
              cardColorStyles={cardColorStyles}
              selectedTemplateId={selectedTemplateId}
              builtInTemplateOptions={BUILT_IN_TEMPLATE_OPTIONS}
              templateOptions={BUILT_IN_TEMPLATE_OPTIONS}
              selectedLayerId={selectedLayerId}
              selectedLayerIds={selectedLayerIds}
              mode={mode}
              csvState={csvState}
              csvAnalysis={csvAnalysis}
              hasSavedLayout={hasSavedLayout}
              isTemplateLocked={isTemplateLocked}
              onModeChange={handleModeChange}
              onReportTypeChange={handleReportTypeChange}
              onCsvUpload={handleCsvUpload}
              onCsvMappingChange={handleCsvMappingChange}
              onFallbackCategoryChange={handleFallbackCategoryChange}
              onClearCsv={handleClearCsv}
              onApplyAutoFill={handleApplyAutoFill}
              onDownloadCsvTemplate={handleDownloadCsvTemplate}
              onDownloadCsvSample={handleDownloadCsvSample}
              onSaveLayout={handleSaveLayout}
              onResetToSaved={handleResetToSaved}
              onResetToFactory={handleResetToFactory}
              onTemplateLockChange={handleTemplateLockChange}
              onTemplateChange={handleTemplateChange}
              onCenterLogo={handleCenterLogo}
              onCenterCards={handleCenterCards}
              onAutoFitText={handleAutoFitText}
              onMatchTemplateTypography={handleMatchTemplateTypography}
              onResetAllCardColors={resetAllCardColorStyles}
              previewZoom={previewZoom}
              onPreviewZoomChange={setPreviewZoom}
              onSelectLayer={selectSingleLayer}
              onClearSelection={clearSelection}
              onFieldChange={updateField}
              onCardDataChange={updateCardData}
              onUpdateBannerTextStyle={updateBannerTextStyle}
              onUpdateCardTextStyle={updateCardTextStyle}
              onUpdateLogoLayout={updateLogoLayout}
              onUpdateCardLayout={updateCardLayout}
              onUpdateCardColorStyle={updateCardColorStyle}
              onResetCardColorStyle={resetCardColorStyle}
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={canUndo}
              canRedo={canRedo}
            />
          </aside>
        </main>
      </div>
      {toastMessage ? (
        <div className="pointer-events-none fixed bottom-5 right-5 z-50 rounded-full border border-[#56e7a1]/25 bg-[#0f1d18]/92 px-4 py-2 text-sm font-semibold text-[#d8ffea] shadow-[0_18px_40px_rgba(0,0,0,0.26)] backdrop-blur-xl">
          {toastMessage}
        </div>
      ) : null}
    </div>
  )
}

export default App
