import { useMemo, useState } from 'react'

const TABS = ['Data', 'Design', 'Export']
const CATEGORIES = ['Equity', 'Futures', 'Options', 'Commodity']

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function parseLayerId(layerId) {
  if (!layerId) return null
  if (layerId === 'logo') return { kind: 'logo' }
  if (layerId === 'heading' || layerId === 'extra' || layerId === 'disclaimer') return { kind: 'bannerText', layer: layerId }
  const frameMatch = layerId.match(/^card-frame-(\d)$/)
  if (frameMatch) return { kind: 'cardFrame', cardIndex: Number(frameMatch[1]) }
  const textMatch = layerId.match(/^card-(\d)-(category|value|duration|stock)$/)
  if (textMatch) return { kind: 'cardText', cardIndex: Number(textMatch[1]), layer: textMatch[2] }
  return null
}

function Section({ title, description, children, action }) {
  return (
    <section className="rounded-[18px] border border-white/10 bg-white/[0.03] p-3">
      <div className="mb-2 flex items-start justify-between gap-2.5">
        <div>
          <h3 className="text-[0.92rem] font-bold text-white">{title}</h3>
          {description ? <p className="mt-1 text-[11px] leading-[1.15rem] text-white/55">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">{label}</span>
      {children}
    </label>
  )
}

function Input(props) {
  return <input {...props} className={`w-full rounded-xl border border-white/10 bg-black/20 px-2.5 py-[0.4rem] text-[12px] text-white outline-none transition placeholder:text-white/25 focus:border-white/25 ${props.className ?? ''}`} />
}

function Select(props) {
  return <select {...props} className={`w-full rounded-xl border border-white/10 bg-black/20 px-2.5 py-[0.4rem] text-[12px] text-white outline-none transition focus:border-white/25 ${props.className ?? ''}`} />
}

function Button({ children, tone = 'default', className = '', ...props }) {
  const toneClass =
    tone === 'primary'
      ? 'border-[#56e7a1]/30 bg-[#56e7a1] text-[#082116]'
      : tone === 'danger'
        ? 'border-[#ff7a95]/30 bg-[#ff7a95]/10 text-[#ffd2db]'
        : 'border-white/10 bg-white/5 text-white hover:border-white/20 hover:bg-white/10'
  return <button {...props} type={props.type ?? 'button'} className={`rounded-xl border px-2.5 py-[0.4rem] text-[12px] font-semibold transition disabled:opacity-40 ${toneClass} ${className}`}>{children}</button>
}

function Pill({ children, tone = 'default' }) {
  const toneClass =
    tone === 'good'
      ? 'border-[#56e7a1]/25 bg-[#56e7a1]/10 text-[#c9ffe3]'
      : tone === 'warn'
        ? 'border-[#ffcf7a]/25 bg-[#ffcf7a]/10 text-[#ffeabf]'
        : tone === 'danger'
          ? 'border-[#ff7a95]/25 bg-[#ff7a95]/10 text-[#ffd2db]'
          : 'border-white/10 bg-white/5 text-white/72'
  return <span className={`rounded-full border px-2 py-0.75 text-[10px] font-semibold ${toneClass}`}>{children}</span>
}

export default function EditorPanel(props) {
  const {
    data,
    textStyles,
    layoutStyles,
    cardLayouts,
    cardColorStyles,
    selectedTemplateId,
    builtInTemplateOptions,
    selectedLayerId,
    selectedLayerIds,
    mode,
    csvState,
    csvAnalysis,
    hasSavedLayout,
    isTemplateLocked,
    onModeChange,
    onReportTypeChange,
    onCsvUpload,
    onCsvMappingChange,
    onFallbackCategoryChange,
    onClearCsv,
    onApplyAutoFill,
    onSaveLayout,
    onResetToSaved,
    onResetToFactory,
    onTemplateLockChange,
    onTemplateChange,
    onCenterLogo,
    onCenterCards,
    onAutoFitText,
    onMatchTemplateTypography,
    onResetAllCardColors,
    previewZoom,
    onPreviewZoomChange,
    onSelectLayer,
    onClearSelection,
    onFieldChange,
    onCardDataChange,
    onUpdateBannerTextStyle,
    onUpdateCardTextStyle,
    onUpdateLogoLayout,
    onUpdateCardLayout,
    onUpdateCardColorStyle,
    onResetCardColorStyle,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    onExportPng,
    onExportWpPn,
    onExportWpComm,
    isExporting,
  } = props

  const [activeTab, setActiveTab] = useState('Data')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showMappingDetails, setShowMappingDetails] = useState(false)
  const [showCardEditor, setShowCardEditor] = useState(false)
  const [showTemplateRail, setShowTemplateRail] = useState(false)
  const selectedLayer = useMemo(() => parseLayerId(selectedLayerId), [selectedLayerId])
  const templates = builtInTemplateOptions ?? []
  const activeTemplate = templates.find((template) => template.id === selectedTemplateId) ?? templates[0]
  const validation = csvAnalysis?.validationSummary ?? { missingAging: 0, invalidProfit: 0, unknownCategory: 0 }
  const selectedCardIndex = selectedLayer?.kind === 'cardFrame' || selectedLayer?.kind === 'cardText' ? selectedLayer.cardIndex : null
  const selectedCard = selectedCardIndex !== null ? data.cards[selectedCardIndex] : null
  const selectedCardColors = selectedCardIndex !== null ? cardColorStyles[selectedCardIndex] : null
  const activeCardLayouts = cardLayouts ?? layoutStyles.monthlyCards ?? []
  const selectedBannerStyle = selectedLayer?.kind === 'bannerText' ? textStyles[selectedLayer.layer] : null
  const selectedCardTextStyle = selectedLayer?.kind === 'cardText' ? textStyles.cards[selectedLayer.cardIndex][selectedLayer.layer] : null
  const selectionTitle = !selectedLayer ? 'Nothing selected' : selectedLayer.kind === 'logo' ? 'Logo' : selectedLayer.kind === 'bannerText' ? selectedLayer.layer : selectedLayer.kind === 'cardFrame' ? `Card ${selectedLayer.cardIndex + 1}` : `Card ${selectedLayer.cardIndex + 1} ${selectedLayer.layer}`

  return (
    <div className="flex max-h-[calc(100vh-210px)] flex-col gap-4 overflow-hidden">
      <div className="sticky top-0 z-20 rounded-[22px] border border-[#56e7a1]/20 bg-[#0f1d18]/95 p-3.5 shadow-[0_18px_40px_rgba(0,0,0,0.22)] backdrop-blur-xl">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#61e6ad]/70">Selected Layer</p>
            <p className="mt-1 text-sm font-bold text-white">{selectionTitle}</p>
            <p className="mt-1 text-[11px] text-white/55">{selectedLayerIds.length > 1 ? `${selectedLayerIds.length} layers selected` : selectedLayer ? 'Focused controls shown below' : 'Select a layer to reveal only the needed controls'}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => onSelectLayer?.('heading')}>Heading</Button>
            <Button onClick={() => onSelectLayer?.('logo')}>Logo</Button>
            <Button onClick={() => onSelectLayer?.('card-frame-0')}>Card 1</Button>
            <Button onClick={onClearSelection}>Clear</Button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition ${activeTab === tab ? 'bg-[#56e7a1] text-[#072116]' : 'border border-white/10 bg-white/5 text-white/70 hover:bg-white/10'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="rounded-[18px] border border-white/10 bg-white/[0.03] p-3">
        <div className="mb-2">
          <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/45">Report Type</p>
          <p className="mt-1 max-w-[30ch] text-[11px] leading-[1.15rem] text-white/55">Monthly aur weekly banner ko yahin se switch karo.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onReportTypeChange('monthly')}
            className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition ${data.reportType === 'monthly' ? 'bg-[#56e7a1] text-[#072116]' : 'border border-white/10 bg-white/5 text-white/70 hover:bg-white/10'}`}
          >
            Monthly Report
          </button>
          <button
            type="button"
            onClick={() => onReportTypeChange('weekly')}
            className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition ${data.reportType === 'weekly' ? 'bg-[#56e7a1] text-[#072116]' : 'border border-white/10 bg-white/5 text-white/70 hover:bg-white/10'}`}
          >
            Weekly Report
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-1">
        {activeTab === 'Data' ? (
          <>
            <Section title="Workspace Summary" description="Important state at a glance.">
              <div className="flex flex-wrap gap-1.5">
                <Pill>{data.reportType === 'weekly' ? 'Weekly Report' : 'Monthly Report'}</Pill>
                <Pill tone={mode === 'auto' ? 'good' : 'default'}>{mode === 'auto' ? 'Auto CSV' : 'Manual Mode'}</Pill>
                <Pill>{activeTemplate?.shortName || 'Default Template'}</Pill>
                <Pill tone={csvState.rows.length ? 'good' : 'default'}>{csvState.rows.length ? `${csvState.rows.length} CSV Rows` : 'No CSV File'}</Pill>
                <Pill>{selectedLayer ? selectionTitle : 'No Selection'}</Pill>
              </div>
            </Section>

            <Section title="Step 1: Data Source" description="Choose CSV automation or manual editing.">
              <div className="mb-2 flex gap-2">
                <button type="button" onClick={() => onModeChange('auto')} className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${mode === 'auto' ? 'bg-[#56e7a1] text-[#072116]' : 'border border-white/10 bg-white/5 text-white/70'}`}>Auto Mode</button>
                <button type="button" onClick={() => onModeChange('manual')} className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${mode === 'manual' ? 'bg-[#56e7a1] text-[#072116]' : 'border border-white/10 bg-white/5 text-white/70'}`}>Manual Mode</button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Upload CSV">
                  <Input type="file" accept=".csv,text/csv" onChange={(event) => onCsvUpload?.(event.target.files?.[0] ?? null)} />
                </Field>
                <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5">
                  <div className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/40">File Status</div>
                  <div className="mt-1.5 text-sm font-bold text-white">{csvState.fileName || 'No CSV loaded yet'}</div>
                  <div className="mt-1 text-[11px] leading-[1.15rem] text-white/55">{csvState.rows.length ? `${csvState.rows.length} rows parsed, source: ${csvState.mappingSource}` : 'Upload a report to enable auto mapping and top performer extraction.'}</div>
                </div>
              </div>
              {csvState.error ? <p className="mt-3 rounded-2xl border border-[#ff6a8b]/30 bg-[#ff6a8b]/10 px-3 py-2 text-sm text-[#ffc7d5]">{csvState.error}</p> : null}
              <div className="mt-3 flex flex-wrap gap-2">
                <Button onClick={onClearCsv} tone="danger">Clear CSV</Button>
              </div>
            </Section>

            <Section
              title="Step 2: Mapping and Validation"
              description="Mapping ko tabhi kholna padega jab auto-detection enough na ho."
              action={
                csvState.columns.length ? (
                  <Button onClick={() => setShowMappingDetails((current) => !current)}>
                    {showMappingDetails ? 'Hide Mapping' : 'Show Mapping'}
                  </Button>
                ) : null
              }
            >
              <div className="mt-3 flex flex-wrap gap-2">
                <Pill tone={csvState.rows.length ? 'good' : 'default'}>{csvState.rows.length ? 'CSV ready' : 'Waiting for CSV'}</Pill>
                <Pill tone={validation.missingAging ? 'warn' : 'default'}>Missing Aging: {validation.missingAging}</Pill>
                <Pill tone={validation.invalidProfit ? 'danger' : 'default'}>Invalid Profit: {validation.invalidProfit}</Pill>
                <Pill tone={validation.unknownCategory ? 'warn' : 'default'}>Unknown Category: {validation.unknownCategory}</Pill>
              </div>
              {showMappingDetails ? (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {[
                    ['stockName', 'Stock Name'],
                    ['profit', 'Profit'],
                    ['category', 'Category'],
                    ['aging', 'Aging'],
                  ].map(([key, label]) => (
                    <Field key={key} label={label}>
                      <Select value={csvState.mapping[key] ?? ''} onChange={(event) => onCsvMappingChange(key, event.target.value)}>
                        <option value="">Not mapped</option>
                        {(csvState.columns ?? []).map((column) => <option key={column.id} value={column.id}>{column.label}</option>)}
                      </Select>
                    </Field>
                  ))}
                  <Field label="Fallback Category">
                    <Select value={csvState.fallbackCategory} onChange={(event) => onFallbackCategoryChange(event.target.value)}>
                      {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
                    </Select>
                  </Field>
                </div>
              ) : null}
            </Section>

            <Section title="Step 3: Banner Content" description="High-frequency content edits stay simple here.">
              <div className={`grid gap-3 ${data.reportType === 'monthly' ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
                {data.reportType === 'monthly' ? (
                  <Field label="Month"><Input value={data.month} onChange={(event) => onFieldChange('month', event.target.value)} /></Field>
                ) : null}
                <Field label="Total Profits"><Input value={data.totalProfits} onChange={(event) => onFieldChange('totalProfits', event.target.value)} /></Field>
                <Field label="Extra Count"><Input value={data.extraCount} onChange={(event) => onFieldChange('extraCount', event.target.value)} /></Field>
              </div>
              <div className="mt-3">
                <Field label="Disclaimer">
                  <textarea value={data.disclaimer} onChange={(event) => onFieldChange('disclaimer', event.target.value)} className="min-h-[96px] w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none transition focus:border-white/25" />
                </Field>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button onClick={onApplyAutoFill} tone="primary" disabled={!csvAnalysis?.bannerData}>Apply Auto Fill</Button>
                <Pill tone={csvAnalysis?.bannerData ? 'good' : 'default'}>{csvAnalysis?.bannerData ? 'Auto-fill ready' : 'Upload valid CSV to unlock auto-fill'}</Pill>
              </div>
            </Section>

            <Section
              title={data.reportType === 'weekly' ? 'Rows' : 'Cards'}
              description="Ye full content editor ab collapse rehta hai taaki panel light feel ho."
              action={<Button onClick={() => setShowCardEditor((current) => !current)}>{showCardEditor ? 'Hide Editor' : 'Open Editor'}</Button>}
            >
              {showCardEditor ? (
                <div className="space-y-3">
                  {data.cards.map((card, index) => (
                    <div key={index} className="rounded-[20px] border border-white/10 bg-black/15 p-3">
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <div><div className="text-sm font-bold text-white">{data.reportType === 'weekly' ? `Row ${index + 1}` : `Card ${index + 1}`}</div><div className="text-xs text-white/50">{card.category}</div></div>
                        <Button onClick={() => onSelectLayer(`card-frame-${index}`)}>Select</Button>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field label="Category"><Select value={card.category} onChange={(event) => onCardDataChange(index, 'category', event.target.value)}>{CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}</Select></Field>
                        <Field label="Stock Name"><Input value={card.stockName} onChange={(event) => onCardDataChange(index, 'stockName', event.target.value)} /></Field>
                        <Field label="Value"><Input value={card.value} onChange={(event) => onCardDataChange(index, 'value', event.target.value)} /></Field>
                        <Field label="Duration"><Input value={card.duration} onChange={(event) => onCardDataChange(index, 'duration', event.target.value)} /></Field>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/12 bg-black/15 px-4 py-4 text-sm text-white/55">
                  {data.reportType === 'weekly' ? 'Rows auto-fill ya manual content edit karne ke liye editor kholo.' : 'Cards auto-fill ya manual content edit karne ke liye editor kholo.'}
                </div>
              )}
            </Section>
          </>
        ) : null}

        {activeTab === 'Design' ? (
          <>
            <Section
              title={`${data.reportType === 'weekly' ? 'Weekly' : 'Monthly'} Templates`}
              description="Template choice current report type ke liye alag save hoti hai."
              action={<Button className="whitespace-nowrap px-3.5" onClick={() => setShowTemplateRail((current) => !current)}>{showTemplateRail ? 'Hide' : 'Browse'}</Button>}
            >
              <div className="mb-3 space-y-3">
                <div className="max-w-[28ch]">
                  <div className="text-sm font-bold text-white">{activeTemplate?.name}</div>
                  <div className="mt-1 text-[11px] leading-[1.15rem] text-white/55">{activeTemplate?.description}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Pill>{templates.length} templates</Pill>
                  <Pill>{data.reportType === 'weekly' ? 'Weekly mode' : 'Monthly mode'}</Pill>
                </div>
              </div>
              {showTemplateRail ? (
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {templates.map((template) => (
                    <button key={template.id} type="button" onClick={() => onTemplateChange(template.id)} className={`min-w-[144px] rounded-[18px] border p-2.5 text-left transition ${template.id === selectedTemplateId ? 'border-[#56e7a1] bg-white/[0.08]' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'}`}>
                      <div className="mb-2.5 h-[4.5rem] overflow-hidden rounded-[14px] border border-white/10" style={{ background: template.preview.background }}>
                        <div className="flex h-full items-end justify-center gap-1.5 px-2.5 pb-2.5">
                          {CATEGORIES.map((category) => {
                            const palette = template.categoryPalettes[category]
                            return <div key={category} className="relative h-[2.75rem] w-[1.6rem] rounded-[9px] border border-white/25 bg-white/85"><div className="absolute left-0 right-0 top-0 h-2 rounded-t-[9px]" style={{ background: `linear-gradient(135deg, ${palette.tabStart}, ${palette.tabEnd})` }} /></div>
                          })}
                        </div>
                      </div>
                      <div className="text-sm font-bold text-white">{template.name}</div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-[18px] border border-white/10 bg-black/15 p-2.5">
                  <div className="mb-2.5 h-[5.5rem] overflow-hidden rounded-[16px] border border-white/10" style={{ background: activeTemplate?.preview.background }}>
                    <div className="flex h-full items-end justify-center gap-1.5 px-2.5 pb-2.5">
                      {CATEGORIES.map((category) => {
                        const palette = activeTemplate.categoryPalettes[category]
                        return <div key={category} className="relative h-[3rem] w-[1.75rem] rounded-[10px] border border-white/25 bg-white/85"><div className="absolute left-0 right-0 top-0 h-2.5 rounded-t-[10px]" style={{ background: `linear-gradient(135deg, ${palette.tabStart}, ${palette.tabEnd})` }} /></div>
                      })}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-white">Active: {activeTemplate?.name}</div>
                </div>
              )}
            </Section>

            <Section title="Canvas Controls" description="Global preview tools grouped together.">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Preview Zoom"><Input type="range" min="0.7" max="1.35" step="0.05" value={previewZoom} onChange={(event) => onPreviewZoomChange(toNumber(event.target.value, 1))} /></Field>
                <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5">
                  <div className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/40">Template Lock</div>
                  <button type="button" onClick={() => onTemplateLockChange(!isTemplateLocked)} className={`mt-2 rounded-full px-3 py-1 text-[11px] font-bold ${isTemplateLocked ? 'bg-[#56e7a1] text-[#072116]' : 'border border-white/10 bg-white/5 text-white/75'}`}>{isTemplateLocked ? 'Locked' : 'Unlocked'}</button>
                </div>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Button onClick={onCenterLogo}>Center Logo</Button>
                <Button onClick={onCenterCards}>{data.reportType === 'weekly' ? 'Center Rows' : 'Center Cards'}</Button>
                <Button onClick={onAutoFitText}>Auto Fit Text</Button>
                <Button onClick={onMatchTemplateTypography}>Match Typography</Button>
              </div>
            </Section>
          </>
        ) : null}

        {activeTab === 'Design' && selectedLayer?.kind === 'logo' ? (
          <Section title="Logo Controls" description="Only the selected logo controls are shown.">
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="X"><Input type="number" value={layoutStyles.logo.x} onChange={(event) => onUpdateLogoLayout({ x: toNumber(event.target.value) })} /></Field>
              <Field label="Y"><Input type="number" value={layoutStyles.logo.y} onChange={(event) => onUpdateLogoLayout({ y: toNumber(event.target.value) })} /></Field>
              <Field label="Scale"><Input type="number" step="0.05" value={layoutStyles.logo.scale} onChange={(event) => onUpdateLogoLayout({ scale: toNumber(event.target.value, 1) })} /></Field>
            </div>
          </Section>
        ) : null}

        {activeTab === 'Design' && selectedLayer?.kind === 'bannerText' && selectedBannerStyle ? (
          <Section title="Text Controls" description="Basic controls first, precise offsets hidden in advanced.">
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Font Size"><Input type="number" value={selectedBannerStyle.fontSize} onChange={(event) => onUpdateBannerTextStyle(selectedLayer.layer, { fontSize: toNumber(event.target.value) })} /></Field>
              <Field label="Weight"><Input type="number" value={selectedBannerStyle.fontWeight} onChange={(event) => onUpdateBannerTextStyle(selectedLayer.layer, { fontWeight: toNumber(event.target.value, 400) })} /></Field>
              <Field label="Text Color"><Input type="color" value={selectedBannerStyle.color || '#ffffff'} onChange={(event) => onUpdateBannerTextStyle(selectedLayer.layer, { color: event.target.value })} className="h-11 p-1" /></Field>
            </div>
            <button type="button" onClick={() => setShowAdvanced((current) => !current)} className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#61e6ad]/70">{showAdvanced ? 'Hide Advanced' : 'Show Advanced'}</button>
            {showAdvanced ? <div className="mt-3 grid gap-3 sm:grid-cols-2"><Field label="Offset X"><Input type="number" value={selectedBannerStyle.x} onChange={(event) => onUpdateBannerTextStyle(selectedLayer.layer, { x: toNumber(event.target.value) })} /></Field><Field label="Offset Y"><Input type="number" value={selectedBannerStyle.y} onChange={(event) => onUpdateBannerTextStyle(selectedLayer.layer, { y: toNumber(event.target.value) })} /></Field></div> : null}
          </Section>
        ) : null}

        {activeTab === 'Design' && selectedLayer?.kind === 'cardFrame' && selectedCard && selectedCardColors ? (
          <>
            <Section title={data.reportType === 'weekly' ? 'Row Layout' : 'Card Layout'} description="Placement and scale separated from colors for clarity.">
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="X"><Input type="number" value={activeCardLayouts[selectedCardIndex].x} onChange={(event) => onUpdateCardLayout(selectedCardIndex, { x: toNumber(event.target.value) })} /></Field>
                <Field label="Y"><Input type="number" value={activeCardLayouts[selectedCardIndex].y} onChange={(event) => onUpdateCardLayout(selectedCardIndex, { y: toNumber(event.target.value) })} /></Field>
                <Field label="Scale"><Input type="number" step="0.05" value={activeCardLayouts[selectedCardIndex].scale} onChange={(event) => onUpdateCardLayout(selectedCardIndex, { scale: toNumber(event.target.value, 1) })} /></Field>
              </div>
            </Section>
            <Section title="Card Colors" description="Most-used color controls first.">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Tab Start"><Input type="color" value={selectedCardColors.tabStart} onChange={(event) => onUpdateCardColorStyle(selectedCardIndex, { tabStart: event.target.value })} className="h-11 p-1" /></Field>
                <Field label="Tab End"><Input type="color" value={selectedCardColors.tabEnd} onChange={(event) => onUpdateCardColorStyle(selectedCardIndex, { tabEnd: event.target.value })} className="h-11 p-1" /></Field>
                <Field label="Pill Start"><Input type="color" value={selectedCardColors.pillStart} onChange={(event) => onUpdateCardColorStyle(selectedCardIndex, { pillStart: event.target.value })} className="h-11 p-1" /></Field>
                <Field label="Pill End"><Input type="color" value={selectedCardColors.pillEnd} onChange={(event) => onUpdateCardColorStyle(selectedCardIndex, { pillEnd: event.target.value })} className="h-11 p-1" /></Field>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button onClick={() => onResetCardColorStyle(selectedCardIndex, selectedCard.category)}>Reset Colors</Button>
                <Button onClick={() => setShowAdvanced((current) => !current)}>{showAdvanced ? 'Hide Advanced Palette' : 'Show Advanced Palette'}</Button>
              </div>
              {showAdvanced ? <div className="mt-3 grid gap-3 sm:grid-cols-2">{['sideStart', 'sideEnd', 'lower', 'text'].map((key) => <Field key={key} label={key}><Input type="color" value={selectedCardColors[key]} onChange={(event) => onUpdateCardColorStyle(selectedCardIndex, { [key]: event.target.value })} className="h-11 p-1" /></Field>)}</div> : null}
            </Section>
          </>
        ) : null}

        {activeTab === 'Design' && selectedLayer?.kind === 'cardText' && selectedCard && selectedCardTextStyle ? (
          <Section title="Selected Text Layer" description="Focused controls for the chosen text only.">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Text Content">
                <Input value={selectedCard[selectedLayer.layer === 'stock' ? 'stockName' : selectedLayer.layer]} onChange={(event) => {
                  const fieldMap = { category: 'category', value: 'value', duration: 'duration', stock: 'stockName' }
                  onCardDataChange(selectedCardIndex, fieldMap[selectedLayer.layer], event.target.value)
                }} />
              </Field>
              <Field label="Text Color"><Input type="color" value={selectedCardTextStyle.color || '#111111'} onChange={(event) => onUpdateCardTextStyle(selectedCardIndex, selectedLayer.layer, { color: event.target.value })} className="h-11 p-1" /></Field>
              <Field label="Font Size"><Input type="number" value={selectedCardTextStyle.fontSize} onChange={(event) => onUpdateCardTextStyle(selectedCardIndex, selectedLayer.layer, { fontSize: toNumber(event.target.value) })} /></Field>
              <Field label="Weight"><Input type="number" value={selectedCardTextStyle.fontWeight} onChange={(event) => onUpdateCardTextStyle(selectedCardIndex, selectedLayer.layer, { fontWeight: toNumber(event.target.value, 400) })} /></Field>
            </div>
            <button type="button" onClick={() => setShowAdvanced((current) => !current)} className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#61e6ad]/70">{showAdvanced ? 'Hide Advanced' : 'Show Advanced'}</button>
            {showAdvanced ? <div className="mt-3 grid gap-3 sm:grid-cols-2"><Field label="Offset X"><Input type="number" value={selectedCardTextStyle.x} onChange={(event) => onUpdateCardTextStyle(selectedCardIndex, selectedLayer.layer, { x: toNumber(event.target.value) })} /></Field><Field label="Offset Y"><Input type="number" value={selectedCardTextStyle.y} onChange={(event) => onUpdateCardTextStyle(selectedCardIndex, selectedLayer.layer, { y: toNumber(event.target.value) })} /></Field></div> : null}
          </Section>
        ) : null}

        {activeTab === 'Design' && !selectedLayer ? (
          <Section title="Focused Editing" description="The panel stays cleaner until you select something in the preview.">
            <div className="rounded-2xl border border-dashed border-white/12 bg-black/15 px-4 py-5 text-sm text-white/55">
              Preview me heading, logo, card ya card text select karo. Uske baad sirf usi layer ke controls yahan dikhenge.
            </div>
          </Section>
        ) : null}

        {activeTab === 'Export' ? (
          <>
            <Section title="Delivery Export" description="Ready presets for WhatsApp publishing limits.">
              <div className="grid gap-3 sm:grid-cols-2">
                <Button onClick={onExportPng} tone="primary" disabled={isExporting}>Download PNG</Button>
                <Button onClick={onExportWpComm} disabled={isExporting}>WP Comm &lt;500KB</Button>
                <Button onClick={onExportWpPn} disabled={isExporting}>WP PN &lt;30KB</Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Pill>PNG: full quality master</Pill>
                <Pill tone="good">WP Comm: optimized JPG</Pill>
                <Pill tone="good">WP PN: optimized JPG</Pill>
              </div>
            </Section>
            <Section title="Quick Actions" description="Most-used actions grouped together.">
              <div className="grid gap-3 sm:grid-cols-2">
                <Button onClick={onUndo} disabled={!canUndo}>Undo</Button>
                <Button onClick={onRedo} disabled={!canRedo}>Redo</Button>
                <Button onClick={onSaveLayout} tone="primary">Save Current Layout</Button>
                <Button onClick={onResetAllCardColors}>Reset All Card Colors</Button>
              </div>
            </Section>
            <Section title="Restore and Safety" description="Potentially disruptive actions isolated to reduce accidental clicks.">
              <div className="mb-3 flex flex-wrap gap-2">
                <Pill tone={hasSavedLayout ? 'good' : 'warn'}>{hasSavedLayout ? 'Saved layout available' : 'No saved layout yet'}</Pill>
                <Pill tone={isTemplateLocked ? 'good' : 'default'}>{isTemplateLocked ? 'Template locked' : 'Template unlocked'}</Pill>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button onClick={onResetToSaved} disabled={!hasSavedLayout}>Reset To Saved</Button>
                <Button onClick={onResetToFactory} tone="danger">Reset To Default Design</Button>
              </div>
            </Section>
            <Section title="Guidance" description="Quick orientation for easier first-time usage.">
              <div className="space-y-2 text-sm text-white/60">
                <p>`Data`: upload CSV or edit content manually.</p>
                <p>`Design`: switch templates and style only the selected layer.</p>
                <p>`Export`: save layout, recover presets, and use reset actions safely.</p>
              </div>
            </Section>
          </>
        ) : null}
      </div>
    </div>
  )
}
