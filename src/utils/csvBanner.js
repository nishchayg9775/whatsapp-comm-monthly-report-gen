export const CATEGORY_ORDER = ['Equity', 'Futures', 'Options', 'Commodity']

export const EMPTY_CSV_MAPPING = {
  stockName: '',
  profit: '',
  category: '',
  aging: '',
}

const COLUMN_ALIASES = {
  stockName: ['symbol', 'stock', 'stockname', 'name', 'ticker', 'tradingsymbol', 'instrument'],
  profit: ['pnl', 'profit', 'return', 'gain', 'roi', 'mtm', 'netpnl', 'pl'],
  category: ['segment', 'type', 'category', 'product', 'instrumenttype'],
  aging: ['aging', 'duration', 'holding', 'days', 'hours', 'age'],
}

const CATEGORY_ALIASES = {
  Equity: ['equity', 'cash', 'delivery', 'eq'],
  Futures: ['futures', 'future', 'fut', 'fofuture', 'futstk', 'futidx'],
  Options: ['options', 'option', 'opt', 'fooption', 'optstk', 'optidx', 'fo'],
  Commodity: ['commodity', 'commodities', 'mcx', 'comdty'],
}

const MONTH_LOOKUP = {
  jan: 'January',
  january: 'January',
  feb: 'February',
  february: 'February',
  mar: 'March',
  march: 'March',
  apr: 'April',
  april: 'April',
  may: 'May',
  jun: 'June',
  june: 'June',
  jul: 'July',
  july: 'July',
  aug: 'August',
  august: 'August',
  sep: 'September',
  sept: 'September',
  september: 'September',
  oct: 'October',
  october: 'October',
  nov: 'November',
  november: 'November',
  dec: 'December',
  december: 'December',
}

function normalizeToken(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
}

export function buildHeaderSignature(columns) {
  return columns.map((column) => normalizeToken(column.label)).join('|')
}

export function buildFilePattern(fileName) {
  return normalizeToken(String(fileName ?? '').replace(/\.[^.]+$/, ''))
}

function scoreColumnMatch(column, aliases) {
  let bestScore = 0
  const columnKey = column.normalizedLabel

  aliases.forEach((alias) => {
    const normalizedAlias = normalizeToken(alias)
    if (!normalizedAlias) {
      return
    }

    if (columnKey === normalizedAlias) {
      bestScore = Math.max(bestScore, 100)
    } else if (columnKey.startsWith(normalizedAlias) || normalizedAlias.startsWith(columnKey)) {
      bestScore = Math.max(bestScore, 80)
    } else if (columnKey.includes(normalizedAlias) || normalizedAlias.includes(columnKey)) {
      bestScore = Math.max(bestScore, 60)
    }
  })

  return bestScore
}

function formatIndianNumber(value) {
  const [wholePart, decimalPart] = String(value).split('.')
  const sign = wholePart.startsWith('-') ? '-' : ''
  const digits = sign ? wholePart.slice(1) : wholePart

  if (digits.length <= 3) {
    return `${sign}${digits}${decimalPart ? `.${decimalPart}` : ''}`
  }

  const lastThree = digits.slice(-3)
  const remaining = digits.slice(0, -3)
  const grouped = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',')
  return `${sign}${grouped},${lastThree}${decimalPart ? `.${decimalPart}` : ''}`
}

function trimTrailingZeroes(value) {
  return value.replace(/(\.\d*?[1-9])0+$|\.0+$/, '$1')
}

function formatNumber(value, decimals = 2) {
  return trimTrailingZeroes(Number(value).toFixed(decimals))
}

export function getCurrentMonthName() {
  return new Date().toLocaleString('en-US', { month: 'long' })
}

export function createCsvTemplateContent() {
  return ['symbol,pnl,segment,aging', ',,,', ',,,'].join('\n')
}

export function createCsvSampleContent() {
  return [
    'symbol,pnl,segment,aging',
    'NETWEB,7.6,Equity,9',
    'APLAPOLLO,30905,Futures,3',
    'NIFTY 50,35.78,Options,0',
    'CRUDEOIL,9.04,Commodity,2.1',
    'TCS,5.15,Equity,4',
  ].join('\n')
}

export function parseCsvText(text) {
  const safeText = String(text ?? '').replace(/^\uFEFF/, '')
  if (!safeText.trim()) {
    throw new Error('CSV file is empty.')
  }

  const rows = []
  let currentRow = []
  let currentField = ''
  let inQuotes = false

  for (let index = 0; index < safeText.length; index += 1) {
    const character = safeText[index]
    const nextCharacter = safeText[index + 1]

    if (inQuotes) {
      if (character === '"') {
        if (nextCharacter === '"') {
          currentField += '"'
          index += 1
        } else {
          inQuotes = false
        }
      } else {
        currentField += character
      }
      continue
    }

    if (character === '"') {
      inQuotes = true
    } else if (character === ',') {
      currentRow.push(currentField)
      currentField = ''
    } else if (character === '\n') {
      currentRow.push(currentField)
      rows.push(currentRow)
      currentRow = []
      currentField = ''
    } else if (character !== '\r') {
      currentField += character
    }
  }

  currentRow.push(currentField)
  rows.push(currentRow)

  const compactRows = rows.filter((row) => row.some((cell) => String(cell ?? '').trim() !== ''))
  if (compactRows.length < 2) {
    throw new Error('CSV must include headers and at least one data row.')
  }

  const rawHeaders = compactRows[0]
  const maxWidth = compactRows.reduce((largest, row) => Math.max(largest, row.length), rawHeaders.length)
  const columns = Array.from({ length: maxWidth }, (_, index) => {
    const label = String(rawHeaders[index] ?? '').trim() || `Column ${index + 1}`
    return {
      id: `col-${index}`,
      index,
      label,
      normalizedLabel: normalizeToken(label),
    }
  })

  const previewRows = compactRows.slice(1).map((row, rowIndex) => ({
    id: `row-${rowIndex}`,
    sourceRowIndex: rowIndex + 2,
    values: columns.map((column) => String(row[column.index] ?? '').trim()),
  }))

  return {
    columns,
    rows: previewRows,
  }
}

export function detectColumnMapping(columns) {
  const usedColumns = new Set()
  const mapping = { ...EMPTY_CSV_MAPPING }

  Object.entries(COLUMN_ALIASES).forEach(([field, aliases]) => {
    let bestColumn = null
    let bestScore = 0

    columns.forEach((column) => {
      if (usedColumns.has(column.id)) {
        return
      }
      const score = scoreColumnMatch(column, aliases)
      if (score > bestScore) {
        bestScore = score
        bestColumn = column
      }
    })

    if (bestColumn && bestScore >= 60) {
      mapping[field] = bestColumn.id
      usedColumns.add(bestColumn.id)
    }
  })

  return mapping
}

function parseNumericValue(value) {
  const cleaned = String(value ?? '')
    .trim()
    .replace(/[,%\s]/g, '')
    .replace(/[\u20B9$]/g, '')
    .replace(/,/g, '')

  if (!cleaned) {
    return null
  }

  const parsed = Number.parseFloat(cleaned)
  return Number.isFinite(parsed) ? parsed : null
}

function normalizeCategory(value) {
  const normalizedValue = normalizeToken(value)
  if (!normalizedValue) {
    return null
  }

  for (const category of CATEGORY_ORDER) {
    if (CATEGORY_ALIASES[category].some((alias) => normalizedValue.includes(normalizeToken(alias)))) {
      return category
    }
  }

  return null
}

function formatProfit(category, profitValue) {
  if (category === 'Futures') {
    const rounded = Number.isInteger(profitValue) ? String(Math.round(profitValue)) : formatNumber(profitValue)
    return {
      value: `\u20B9${formatIndianNumber(rounded)}`,
      valueSuffix: '',
    }
  }

  return {
    value: `${formatNumber(profitValue)}%`,
    valueSuffix: '',
  }
}

function formatDuration(category, agingValue) {
  if (agingValue === 0) {
    return 'Same Day'
  }

  if (category === 'Commodity') {
    return `${formatNumber(agingValue, 1)} Hours`
  }

  return `${Math.max(1, Math.round(agingValue))} Days`
}

function buildPlaceholderCard(category) {
  return {
    category,
    value: '--',
    valueSuffix: '',
    duration: 'No Data',
    stockName: 'N/A',
  }
}

function detectMonthFromTextBlock(text) {
  const source = String(text ?? '').toLowerCase()
  if (!source) {
    return null
  }

  const monthToken = source.match(
    /\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|sept|oct|nov|dec)\b/
  )
  if (monthToken) {
    return MONTH_LOOKUP[monthToken[1]]
  }

  const dateToken = source.match(/\b(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})\b|\b(\d{4})[/-](\d{1,2})[/-](\d{1,2})\b/)
  if (!dateToken) {
    return null
  }

  const monthNumber = dateToken[2] ? Number(dateToken[2]) : Number(dateToken[5])
  if (!monthNumber || monthNumber < 1 || monthNumber > 12) {
    return null
  }

  return new Date(2000, monthNumber - 1, 1).toLocaleString('en-US', { month: 'long' })
}

export function detectMonthFromFileContext(fileName, rows) {
  const fromFileName = detectMonthFromTextBlock(fileName)
  if (fromFileName) {
    return fromFileName
  }

  const previewText = rows
    .slice(0, 8)
    .flatMap((row) => row.values)
    .join(' ')

  return detectMonthFromTextBlock(previewText)
}

export function analyzeCsvData({ columns, rows, mapping, fallbackCategory, month, disclaimer }) {
  const missingRequiredMappings = ['stockName', 'profit', 'aging'].filter((field) => !mapping[field])
  const effectiveFallbackCategory = CATEGORY_ORDER.includes(fallbackCategory) ? fallbackCategory : 'Equity'
  const validationSummary = {
    missingAging: 0,
    invalidProfit: 0,
    unknownCategory: 0,
  }

  if (!columns.length || !rows.length) {
    return {
      missingRequiredMappings,
      validationSummary,
      cleanedRows: [],
      invalidRowCount: 0,
      topPerformers: [],
      topPerformerIds: new Set(),
      bannerData: null,
    }
  }

  if (missingRequiredMappings.length > 0) {
    return {
      missingRequiredMappings,
      validationSummary,
      cleanedRows: [],
      invalidRowCount: rows.length,
      topPerformers: [],
      topPerformerIds: new Set(),
      bannerData: null,
    }
  }

  const cleanedRows = []

  rows.forEach((row) => {
    const pickValue = (field) => {
      const columnId = mapping[field]
      if (!columnId) {
        return ''
      }
      const column = columns.find((entry) => entry.id === columnId)
      return column ? row.values[column.index] : ''
    }

    const stockName = pickValue('stockName')
    const rawProfit = pickValue('profit')
    const rawAging = pickValue('aging')
    const rawCategory = pickValue('category')

    const profitValue = parseNumericValue(rawProfit)
    const agingValue = parseNumericValue(rawAging)
    const normalizedCategory = normalizeCategory(rawCategory)
    const category =
      normalizedCategory ||
      (!mapping.category || !String(rawCategory ?? '').trim() ? effectiveFallbackCategory : null)

    if (profitValue === null) {
      validationSummary.invalidProfit += 1
    }
    if (agingValue === null) {
      validationSummary.missingAging += 1
    }
    if (mapping.category && String(rawCategory ?? '').trim() && !normalizedCategory) {
      validationSummary.unknownCategory += 1
    }

    if (!stockName || profitValue === null || agingValue === null || !category) {
      return
    }

    cleanedRows.push({
      id: row.id,
      sourceRowIndex: row.sourceRowIndex,
      stockName,
      profitValue,
      rawProfit,
      category,
      agingValue,
      rawAging,
      formattedProfit: formatProfit(category, profitValue),
      formattedDuration: formatDuration(category, agingValue),
    })
  })

  const topPerformers = CATEGORY_ORDER.map((category) => {
    const bestRow = cleanedRows
      .filter((row) => row.category === category)
      .reduce((best, current) => {
        if (!best || current.profitValue > best.profitValue) {
          return current
        }
        return best
      }, null)

    return bestRow
  }).filter(Boolean)

  const topPerformerIds = new Set(topPerformers.map((row) => row.id))

  const cards = CATEGORY_ORDER.map((category) => {
    const row = topPerformers.find((entry) => entry.category === category)
    if (!row) {
      return buildPlaceholderCard(category)
    }

    return {
      category,
      stockName: row.stockName,
      value: row.formattedProfit.value,
      valueSuffix: row.formattedProfit.valueSuffix,
      duration: row.formattedDuration,
    }
  })

  return {
    missingRequiredMappings,
    validationSummary,
    cleanedRows,
    invalidRowCount: Math.max(0, rows.length - cleanedRows.length),
    topPerformers,
    topPerformerIds,
    bannerData: cleanedRows.length
      ? {
          month: month || getCurrentMonthName(),
          totalProfits: String(cleanedRows.length),
          extraCount: String(Math.max(0, cleanedRows.length - CATEGORY_ORDER.length)),
          cards,
          disclaimer,
        }
      : null,
  }
}
