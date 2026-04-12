import { forwardRef, useEffect, useRef } from 'react'
import logoSrc from '../assets/logo.png'

const FONT_FAMILIES = {
  Outfit: "'Outfit', 'Inter', sans-serif",
  Inter: "'Inter', sans-serif",
  Georgia: "Georgia, 'Times New Roman', serif",
  Trebuchet: "'Trebuchet MS', sans-serif",
}

function resolveFontFamily(fontFamily) {
  return FONT_FAMILIES[fontFamily] || FONT_FAMILIES.Outfit
}

function hexToRgb(color) {
  const safeColor = color?.replace('#', '')
  if (!safeColor || (safeColor.length !== 6 && safeColor.length !== 3)) {
    return null
  }

  const normalized =
    safeColor.length === 3
      ? safeColor
          .split('')
          .map((character) => `${character}${character}`)
          .join('')
      : safeColor

  const parsed = Number.parseInt(normalized, 16)
  if (Number.isNaN(parsed)) {
    return null
  }

  return {
    r: (parsed >> 16) & 255,
    g: (parsed >> 8) & 255,
    b: parsed & 255,
  }
}

function withAlpha(color, alpha) {
  const rgb = hexToRgb(color)
  if (!rgb) {
    return color
  }

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
}

function getRelativeLuminance(color) {
  const rgb = hexToRgb(color)
  if (!rgb) {
    return 1
  }

  const normalize = (channel) => {
    const value = channel / 255
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  }

  const r = normalize(rgb.r)
  const g = normalize(rgb.g)
  const b = normalize(rgb.b)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function getReadableTextColor(startColor, endColor, light = '#ffffff', dark = '#182233') {
  const luminance = (getRelativeLuminance(startColor) + getRelativeLuminance(endColor || startColor)) / 2
  return luminance > 0.42 ? dark : light
}

function getSafeAccentColor(color, fallback = '#18303f') {
  if (!color) {
    return fallback
  }

  return getRelativeLuminance(color) > 0.62 ? fallback : color
}

function getWeeklyHeaderColor(template) {
  const lightVariants = new Set(['minimal', 'softFrame', 'ribbonStack', 'sidebandClean'])
  return lightVariants.has(template.cards.variant) ? 'rgba(29,39,49,0.88)' : 'rgba(255,255,255,0.88)'
}

function buildCardAppearance(cardColors) {
  return {
    tab: `linear-gradient(180deg, ${cardColors.tabStart} 0%, ${cardColors.tabEnd} 100%)`,
    tabShadow: withAlpha(cardColors.tabEnd, 0.45),
    tint: cardColors.sideEnd,
    side: cardColors.sideStart,
    sideShadow: withAlpha(cardColors.sideEnd, 0.28),
    lower: `linear-gradient(180deg, ${withAlpha(cardColors.lower, 0)} 0%, ${withAlpha(cardColors.lower, 0.84)} 100%)`,
    pill: `linear-gradient(180deg, ${cardColors.pillStart} 0%, ${cardColors.pillEnd} 100%)`,
    pillShadow: withAlpha(cardColors.pillEnd, 0.42),
    text: cardColors.text,
  }
}

function getVariantMetrics(variant) {
  const metricsByVariant = {
    classic: { tabWidth: 118, tabHeight: 31, tabTop: 0, valueTop: 44, durationTop: 86, stockBottom: 12, bodyTop: 10 },
    minimal: { tabWidth: 114, tabHeight: 28, tabTop: 2, valueTop: 44, durationTop: 86, stockBottom: 12, bodyTop: 10 },
    glass: { tabWidth: 116, tabHeight: 30, tabTop: 0, valueTop: 44, durationTop: 86, stockBottom: 12, bodyTop: 10 },
    bold: { tabWidth: 122, tabHeight: 30, tabTop: 0, valueTop: 44, durationTop: 86, stockBottom: 12, bodyTop: 10 },
    outlineNeon: { tabWidth: 110, tabHeight: 24, tabTop: 4, valueTop: 42, durationTop: 86, stockBottom: 12, bodyTop: 10 },
    royalGlow: { tabWidth: 120, tabHeight: 28, tabTop: 0, valueTop: 44, durationTop: 88, stockBottom: 12, bodyTop: 10 },
    softFrame: { tabWidth: 104, tabHeight: 24, tabTop: 4, valueTop: 46, durationTop: 87, stockBottom: 12, bodyTop: 10 },
    ribbonStack: { tabWidth: 126, tabHeight: 30, tabTop: -2, valueTop: 42, durationTop: 86, stockBottom: 12, bodyTop: 12 },
    sidebandClean: { tabWidth: 100, tabHeight: 24, tabTop: 6, valueTop: 44, durationTop: 86, stockBottom: 12, bodyTop: 10 },
  }

  return metricsByVariant[variant] || metricsByVariant.classic
}

function renderCardDecorations(variant, styles, cardTheme) {
  if (variant === 'outlineNeon') {
    return (
      <>
        <div style={{ position: 'absolute', inset: '10px 0 0', borderRadius: cardTheme.cardRadius, boxShadow: `0 0 0 1px ${cardTheme.cardBorder}, 0 0 24px ${styles.tabShadow}`, opacity: 0.9 }} />
        <div style={{ position: 'absolute', left: 16, right: 16, top: 22, height: 50, borderRadius: 18, background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 72%)' }} />
        <div style={{ position: 'absolute', inset: 'auto 12px 12px 12px', height: 42, borderRadius: 18, background: `linear-gradient(180deg, ${withAlpha(styles.tint, 0.2)} 0%, ${withAlpha(styles.tint, 0.34)} 100%)`, filter: 'blur(8px)', opacity: 0.8 }} />
      </>
    )
  }

  if (variant === 'royalGlow') {
    return (
      <>
        <div style={{ position: 'absolute', inset: '10px 0 0', borderRadius: cardTheme.cardRadius, boxShadow: `0 0 24px ${withAlpha(styles.tint, 0.32)}` }} />
        <div style={{ position: 'absolute', left: 10, right: 10, top: 10, height: 58, borderRadius: 24, background: 'radial-gradient(circle at 50% -8%, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0) 72%)' }} />
        <div style={{ position: 'absolute', left: -8, right: -8, top: 12, height: 14, borderTop: '3px solid rgba(255,255,255,0.45)', borderRadius: '50%', opacity: 0.9 }} />
      </>
    )
  }

  if (variant === 'softFrame') {
    return (
      <>
        <div style={{ position: 'absolute', inset: '4px', borderRadius: cardTheme.cardRadius + 6, border: '2px solid rgba(255,255,255,0.7)', opacity: 0.95 }} />
        <div style={{ position: 'absolute', left: 18, right: 18, top: 20, height: 10, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.75)', boxShadow: '0 0 12px rgba(255,255,255,0.55)' }} />
          <span style={{ width: 6, height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.75)', boxShadow: '0 0 12px rgba(255,255,255,0.55)' }} />
        </div>
      </>
    )
  }

  if (variant === 'ribbonStack') {
    return (
      <>
        <div style={{ position: 'absolute', left: -6, right: -6, top: 54, height: 20, background: `linear-gradient(90deg, ${styles.side} 0%, ${styles.tint} 100%)`, clipPath: 'polygon(0 0, 100% 0, 92% 100%, 8% 100%)', boxShadow: `0 12px 18px ${styles.sideShadow}`, opacity: 0.95 }} />
        <div style={{ position: 'absolute', left: 14, right: 14, top: 74, height: 2, background: withAlpha(styles.side, 0.2) }} />
      </>
    )
  }

  if (variant === 'sidebandClean') {
    return (
      <>
        <div style={{ position: 'absolute', left: -12, top: 34, width: 24, height: 120, borderRadius: 12, background: `linear-gradient(180deg, ${styles.side} 0%, ${styles.tint} 100%)`, boxShadow: `0 14px 24px ${styles.sideShadow}` }} />
        <div style={{ position: 'absolute', inset: '10px 0 0', borderRadius: cardTheme.cardRadius, boxShadow: '0 18px 30px rgba(0,0,0,0.08)' }} />
      </>
    )
  }

  return (
    <>
      <div style={{ position: 'absolute', left: -10, right: -10, top: 54, display: 'flex', justifyContent: 'space-between', pointerEvents: 'none' }}>
        <div style={{ width: 18, height: 116, borderRadius: 12, background: `linear-gradient(180deg, ${styles.side} 0%, ${styles.tint} 100%)`, boxShadow: `0 16px 24px ${styles.sideShadow}`, opacity: cardTheme.sideOpacity, transition: 'all 260ms ease' }} />
        <div style={{ width: 18, height: 116, borderRadius: 12, background: `linear-gradient(180deg, ${styles.side} 0%, ${styles.tint} 100%)`, boxShadow: `0 16px 24px ${styles.sideShadow}`, opacity: cardTheme.sideOpacity, transition: 'all 260ms ease' }} />
      </div>
    </>
  )
}

function textStyle(style) {
  return {
    fontFamily: resolveFontFamily(style.fontFamily),
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    fontStyle: style.fontStyle,
    letterSpacing: `${style.letterSpacing}em`,
    textTransform: style.textTransform,
  }
}

function fitTextSize(text, baseSize, { maxChars, minSize, step = 1 }) {
  const safeText = String(text ?? '')
  if (safeText.length <= maxChars) {
    return baseSize
  }

  const overflow = safeText.length - maxChars
  return Math.max(minSize, baseSize - overflow * step)
}

function InteractiveLayer({
  layerId,
  selectedLayerIds,
  onSelectLayer,
  onMove,
  position,
  scale = 1,
  onScale,
  minScale = 0.2,
  selectionMode = 'single',
  requireSelectedForDrag = false,
  className,
  style,
  selectionLabel,
  zIndex = 1,
  onDoubleClickAction,
  isLocked = false,
  children,
}) {
  const dragRef = useRef(null)
  const isSelected = selectedLayerIds.includes(layerId)

  useEffect(() => {
    return () => {
      dragRef.current = null
    }
  }, [])

  const startMove = (event) => {
    dragRef.current = {
      type: 'move',
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x || 0,
      originY: position.y || 0,
    }
  }

  const startScale = (event) => {
    dragRef.current = {
      type: 'scale',
      pointerId: event.pointerId,
      startX: event.clientX,
      originScale: scale,
    }
  }

  const attachMoveListeners = () => {
    const handlePointerMove = (moveEvent) => {
      if (!dragRef.current || moveEvent.pointerId !== dragRef.current.pointerId) {
        return
      }

      if (dragRef.current.type === 'move') {
        onMove({
          x: Number((dragRef.current.originX + moveEvent.clientX - dragRef.current.startX).toFixed(1)),
          y: Number((dragRef.current.originY + moveEvent.clientY - dragRef.current.startY).toFixed(1)),
        })
      } else if (dragRef.current.type === 'scale' && onScale) {
        const delta = (moveEvent.clientX - dragRef.current.startX) / 120
        onScale({
          scale: Number(Math.max(minScale, dragRef.current.originScale + delta).toFixed(2)),
        })
      }
    }

    const handlePointerUp = (upEvent) => {
      if (!dragRef.current || upEvent.pointerId !== dragRef.current.pointerId) {
        return
      }
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
      dragRef.current = null
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)
  }

  const handlePointerDown = (event) => {
    if (event.button !== 0) {
      return
    }

    if (isLocked) {
      event.preventDefault()
      event.stopPropagation()
      onSelectLayer(layerId)
      return
    }

    if (requireSelectedForDrag && !isSelected) {
      event.preventDefault()
      event.stopPropagation()
      onSelectLayer(layerId)
      return
    }

    event.preventDefault()
    event.stopPropagation()
    onSelectLayer(layerId)
    startMove(event)
    attachMoveListeners()
  }

  const handleClick = (event) => {
    if (selectionMode === 'single') {
      event.stopPropagation()
      onSelectLayer(layerId)
    }
  }

  const handleDoubleClick = (event) => {
    event.preventDefault()
    event.stopPropagation()
    onSelectLayer(layerId)
    if (onDoubleClickAction) {
      onDoubleClickAction(layerId)
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      data-layer-id={layerId}
      className={className}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelectLayer(layerId)
        }
      }}
      style={{
        transform: `translate(${position.x || 0}px, ${position.y || 0}px)`,
        cursor: isLocked ? 'default' : isSelected || !requireSelectedForDrag ? 'grab' : 'default',
        userSelect: 'none',
        touchAction: 'none',
        zIndex,
        ...style,
      }}
    >
      <div
        style={{
          position: 'relative',
          outline: isSelected ? '1px solid rgba(255,255,255,0.9)' : '1px solid transparent',
          outlineOffset: 4,
          borderRadius: 12,
        }}
      >
        {children}

        {isSelected ? (
          <>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: -24,
                borderRadius: 999,
                background: 'rgba(6, 17, 14, 0.88)',
                border: '1px solid rgba(255,255,255,0.15)',
                padding: '4px 10px',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'white',
                whiteSpace: 'nowrap',
              }}
            >
              {selectionLabel}
            </div>
            {onScale && !isLocked ? (
              <button
                type="button"
                onPointerDown={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  onSelectLayer(layerId)
                  startScale(event)
                  attachMoveListeners()
                }}
                style={{
                  position: 'absolute',
                  right: -12,
                  bottom: -12,
                  width: 18,
                  height: 18,
                  borderRadius: 999,
                  border: '2px solid #071310',
                  background: '#39eb95',
                  boxShadow: '0 10px 18px rgba(57,235,149,0.35)',
                  cursor: 'nwse-resize',
                }}
              />
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  )
}

function OverlayInput({ label, value, onChange, onClose, multiline = false, autoFocus = false }) {
  const Element = multiline ? 'textarea' : 'input'

  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">{label}</span>
      <Element
        autoFocus={autoFocus}
        value={value}
        rows={multiline ? 4 : undefined}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault()
            onClose()
          }
          if (!multiline && event.key === 'Enter') {
            event.preventDefault()
            onClose()
          }
          if (multiline && event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
            event.preventDefault()
            onClose()
          }
        }}
        className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-emerald-300/40"
      />
    </label>
  )
}

function TextEditorOverlay({ editingLayerId, data, onFieldChange, onCardDataChange, onClose }) {
  if (!editingLayerId) {
    return null
  }

  const cardTextMatch = editingLayerId.match(/^card-(\d)-(category|value|duration|stock)$/)

  let content = null

  if (editingLayerId === 'heading') {
    content = (
      <div className="space-y-3">
        <OverlayInput
          label="Heading Text"
          value={data.customHeading}
          onChange={(value) => onFieldChange('customHeading', value)}
          onClose={onClose}
          autoFocus
          multiline
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <OverlayInput label="Total profits" value={data.totalProfits} onChange={(value) => onFieldChange('totalProfits', value)} onClose={onClose} />
          {data.reportType === 'monthly' ? <OverlayInput label="Month" value={data.month} onChange={(value) => onFieldChange('month', value)} onClose={onClose} /> : null}
        </div>
      </div>
    )
  } else if (editingLayerId === 'extra') {
    content = <OverlayInput label="More count" value={data.extraCount} onChange={(value) => onFieldChange('extraCount', value)} onClose={onClose} autoFocus />
  } else if (editingLayerId === 'disclaimer') {
    content = <OverlayInput label="Disclaimer" value={data.disclaimer} onChange={(value) => onFieldChange('disclaimer', value)} onClose={onClose} multiline autoFocus />
  } else if (cardTextMatch) {
    const cardIndex = Number(cardTextMatch[1])
    const field = cardTextMatch[2]
    const card = data.cards[cardIndex]
    const fieldMap = {
      category: { label: `Card ${cardIndex + 1} category`, key: 'category', value: card.category },
      value: { label: `Card ${cardIndex + 1} value`, key: 'value', value: card.value },
      duration: { label: `Card ${cardIndex + 1} duration`, key: 'duration', value: card.duration },
      stock: { label: `Card ${cardIndex + 1} stock`, key: 'stockName', value: card.stockName },
    }
    const current = fieldMap[field]
    content = (
      <OverlayInput
        label={current.label}
        value={current.value}
        onChange={(value) => onCardDataChange(cardIndex, current.key, value)}
        onClose={onClose}
        autoFocus
      />
    )
  }

  if (!content) {
    return null
  }

  return (
    <div
      style={{
        position: 'absolute',
        right: 18,
        top: 18,
        width: 300,
        zIndex: 40,
        borderRadius: 18,
        border: '1px solid rgba(255,255,255,0.12)',
        background: 'rgba(6, 17, 14, 0.92)',
        boxShadow: '0 24px 50px rgba(0,0,0,0.32)',
        padding: 14,
        backdropFilter: 'blur(10px)',
      }}
    >
      <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.82)' }}>
            Quick Edit
          </div>
          <div style={{ marginTop: 3, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
            Double click se open hua editor
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.06)',
            color: 'white',
            borderRadius: 999,
            padding: '6px 10px',
            fontSize: 11,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Done
        </button>
      </div>
      {content}
    </div>
  )
}

function BannerCardContent({ card, cardColors, template, cardStyle, selectedLayerIds, onSelectLayer, onStartEditingLayer, onUpdateCardTextStyle, isTemplateLocked }) {
  const styles = buildCardAppearance(cardColors)
  const cardTheme = template.cards
  const variant = cardTheme.variant || 'classic'
  const metrics = getVariantMetrics(variant)
  const categoryColor =
    cardStyle.category.color || getReadableTextColor(cardColors.tabStart, cardColors.tabEnd)
  const valueColor = cardStyle.value.color || styles.text
  const durationColor = cardStyle.duration.color || styles.text
  const stockColor =
    cardStyle.stock.color || getReadableTextColor(cardColors.pillStart, cardColors.pillEnd)
  const categoryFontSize = fitTextSize(card.category, cardStyle.category.fontSize, { maxChars: 11, minSize: 10, step: 0.7 })
  const valueFontSize = fitTextSize(`${card.value}${card.valueSuffix || ''}`, cardStyle.value.fontSize, { maxChars: 9, minSize: 22, step: 1.1 })
  const durationFontSize = fitTextSize(card.duration, cardStyle.duration.fontSize, { maxChars: 10, minSize: 8.6, step: 0.55 })
  const stockFontSize = fitTextSize(card.stockName, cardStyle.stock.fontSize, { maxChars: 11, minSize: 8.5, step: 0.65 })
  const stockButtonWidth = Math.min(144, Math.max(112, card.stockName.length * 7.2))
  const bodySurface =
    variant === 'outlineNeon'
      ? 'linear-gradient(180deg, rgba(5,18,31,0.94) 0%, rgba(4,13,22,0.98) 100%)'
      : variant === 'royalGlow'
        ? `linear-gradient(180deg, ${withAlpha(styles.side, 0.92)} 0%, ${withAlpha(styles.tint, 0.98)} 100%)`
        : cardTheme.cardSurface
  const bodyBorder =
    variant === 'royalGlow' ? withAlpha('#ffffff', 0.18) : cardTheme.cardBorder

  return (
    <div style={{ position: 'relative', width: 162, height: 176 }}>
      {renderCardDecorations(variant, styles, cardTheme)}

      <div style={{ position: 'absolute', top: metrics.tabTop, left: '50%', transform: variant === 'ribbonStack' ? 'translateX(-50%) perspective(240px) rotateX(8deg)' : 'translateX(-50%)', minWidth: metrics.tabWidth, height: metrics.tabHeight, padding: '0 18px', borderRadius: cardTheme.tabRadius, background: styles.tab, boxShadow: `0 10px 18px ${styles.tabShadow}`, color: cardTheme.labelTextColor, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3, transition: 'all 260ms ease', clipPath: variant === 'ribbonStack' ? 'polygon(0 0, 100% 0, 92% 100%, 8% 100%)' : 'none' }}>
        <InteractiveLayer
          layerId={cardStyle.category.layerId}
          selectedLayerIds={selectedLayerIds}
          onSelectLayer={onSelectLayer}
          onMove={(position) => onUpdateCardTextStyle('category', position)}
          position={cardStyle.category}
          scale={cardStyle.category.fontSize}
          onScale={(updates) => onUpdateCardTextStyle('category', { fontSize: updates.scale })}
          minScale={4}
          selectionMode="single"
          requireSelectedForDrag={false}
          selectionLabel="Category Text"
          zIndex={8}
          onDoubleClickAction={onStartEditingLayer}
          isLocked={isTemplateLocked}
        >
          <span style={{ ...textStyle(cardStyle.category), color: categoryColor, display: 'inline-block', whiteSpace: 'nowrap', fontSize: categoryFontSize, transition: 'color 260ms ease' }}>{card.category}</span>
        </InteractiveLayer>
      </div>

      <div style={{ position: 'absolute', inset: `${metrics.bodyTop}px 0 0`, borderRadius: cardTheme.cardRadius, background: bodySurface, overflow: 'hidden', boxShadow: cardTheme.cardShadow, border: `1px solid ${bodyBorder}`, transition: 'all 260ms ease' }}>
        <div style={{ position: 'absolute', inset: '0 0 auto 0', height: 74, background: cardTheme.topHighlight, transition: 'all 260ms ease' }} />
        <div style={{ position: 'absolute', inset: variant === 'sidebandClean' ? 'auto 0 0 0' : 'auto 0 0 0', height: variant === 'royalGlow' ? 92 : 78, background: styles.lower }} />
        {variant !== 'outlineNeon' ? (
          <>
            <div style={{ position: 'absolute', left: -14, right: -14, bottom: 52, height: 32, borderTop: `5px solid ${cardTheme.curveStrong}`, borderRadius: '50%', opacity: 0.92, transition: 'all 260ms ease' }} />
            <div style={{ position: 'absolute', left: -18, right: -18, bottom: 44, height: 36, borderTop: `2px solid ${cardTheme.curveSoft}`, borderRadius: '50%', opacity: 0.8, transition: 'all 260ms ease' }} />
          </>
        ) : null}

        <div style={{ position: 'absolute', inset: 0, zIndex: 2, color: styles.text, textAlign: 'center' }}>
          <div style={{ position: 'absolute', left: '50%', top: metrics.valueTop, transform: 'translateX(-50%)', width: 130, display: 'flex', justifyContent: 'center' }}>
            <InteractiveLayer
              layerId={cardStyle.value.layerId}
              selectedLayerIds={selectedLayerIds}
              onSelectLayer={onSelectLayer}
              onMove={(position) => onUpdateCardTextStyle('value', position)}
              position={cardStyle.value}
              scale={cardStyle.value.fontSize}
              onScale={(updates) => onUpdateCardTextStyle('value', { fontSize: updates.scale })}
              minScale={4}
              selectionMode="single"
              requireSelectedForDrag={false}
              selectionLabel="Value Text"
              zIndex={8}
              onDoubleClickAction={onStartEditingLayer}
              isLocked={isTemplateLocked}
            >
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 1, maxWidth: '100%', lineHeight: 0.96 }}>
                <span style={{ ...textStyle(cardStyle.value), color: valueColor, fontSize: valueFontSize, whiteSpace: 'nowrap' }}>{card.value}</span>
                {card.valueSuffix ? <span style={{ ...textStyle(cardStyle.value), color: valueColor, fontSize: Math.max(9, valueFontSize * 0.32), fontWeight: 700, marginBottom: 6, opacity: variant === 'outlineNeon' ? 0.9 : 0.75, whiteSpace: 'nowrap' }}>{card.valueSuffix}</span> : null}
              </div>
            </InteractiveLayer>
          </div>

          <div style={{ position: 'absolute', left: '50%', top: metrics.durationTop, transform: 'translateX(-50%)', width: 132, display: 'flex', justifyContent: 'center', zIndex: 4 }}>
            <InteractiveLayer
              layerId={cardStyle.duration.layerId}
              selectedLayerIds={selectedLayerIds}
              onSelectLayer={onSelectLayer}
              onMove={(position) => onUpdateCardTextStyle('duration', position)}
              position={cardStyle.duration}
              scale={cardStyle.duration.fontSize}
              onScale={(updates) => onUpdateCardTextStyle('duration', { fontSize: updates.scale })}
              minScale={4}
              selectionMode="single"
              requireSelectedForDrag={false}
              selectionLabel="Duration Text"
              zIndex={8}
              onDoubleClickAction={onStartEditingLayer}
              isLocked={isTemplateLocked}
            >
              <span style={{ ...textStyle(cardStyle.duration), color: durationColor, display: 'inline-block', whiteSpace: 'nowrap', lineHeight: 1.1, fontSize: durationFontSize }}>{card.duration}</span>
            </InteractiveLayer>
          </div>

          <div style={{ position: 'absolute', left: '50%', bottom: metrics.stockBottom, transform: variant === 'sidebandClean' ? 'translateX(-50%)' : 'translateX(-50%)', width: stockButtonWidth, borderRadius: cardTheme.pillRadius, padding: '10px 18px 11px', background: styles.pill, boxShadow: `0 14px 24px ${styles.pillShadow}, inset 0 1px 0 rgba(255, 255, 255, 0.35)`, zIndex: 3, transition: 'all 260ms ease' }}>
            <InteractiveLayer
              layerId={cardStyle.stock.layerId}
              selectedLayerIds={selectedLayerIds}
              onSelectLayer={onSelectLayer}
              onMove={(position) => onUpdateCardTextStyle('stock', position)}
              position={cardStyle.stock}
              scale={cardStyle.stock.fontSize}
              onScale={(updates) => onUpdateCardTextStyle('stock', { fontSize: updates.scale })}
              minScale={4}
              selectionMode="single"
              requireSelectedForDrag={false}
              selectionLabel="Stock Text"
              zIndex={8}
              onDoubleClickAction={onStartEditingLayer}
              isLocked={isTemplateLocked}
            >
              <span style={{ ...textStyle(cardStyle.stock), color: stockColor, display: 'inline-block', whiteSpace: 'nowrap', fontSize: stockFontSize, transition: 'color 260ms ease' }}>{card.stockName}</span>
            </InteractiveLayer>
          </div>
        </div>
      </div>
    </div>
  )
}

function WeeklyReportRow({ card, cardColors, template, rowStyle, selectedLayerIds, onSelectLayer, onStartEditingLayer, onUpdateCardTextStyle, isTemplateLocked }) {
  const styles = buildCardAppearance(cardColors)
  const variant = template.cards.variant
  const neutralText = template.cards.labelTextColor || '#1d232b'
  const categoryFontSize = fitTextSize(card.category, Math.min(rowStyle.category.fontSize, 14), { maxChars: 10, minSize: 10, step: 0.45 })
  const stockFontSize = fitTextSize(card.stockName, Math.min(rowStyle.stock.fontSize, 14), { maxChars: 20, minSize: 9.5, step: 0.38 })
  const valueWithSuffix = `${card.value}${card.valueSuffix || ''}`
  const valueFontSize = fitTextSize(valueWithSuffix, Math.min(rowStyle.value.fontSize, 16), { maxChars: 14, minSize: 9.8, step: 0.52 })
  const durationFontSize = fitTextSize(card.duration, Math.min(rowStyle.duration.fontSize, 12), { maxChars: 14, minSize: 8.8, step: 0.34 })
  const durationLabel = `in ${card.duration}`
  const rowSurface =
    variant === 'outlineNeon'
      ? 'linear-gradient(180deg, rgba(247,252,255,0.98) 0%, rgba(239,246,251,0.98) 100%)'
      : variant === 'glass'
        ? 'linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(248,251,255,0.9) 100%)'
        : 'linear-gradient(180deg, rgba(255,255,255,0.99) 0%, rgba(247,247,247,0.99) 100%)'
  const stockSurface = 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(249,249,249,0.98) 100%)'
  const returnsSurface = `linear-gradient(180deg, ${withAlpha(cardColors.tabStart, 0.1)} 0%, ${withAlpha(cardColors.tabEnd, 0.14)} 100%)`
  const dividerColor = withAlpha(cardColors.tabEnd, 0.24)
  const rowBorder = withAlpha(cardColors.tabEnd, variant === 'outlineNeon' ? 0.82 : 0.72)
  const labelMap = {
    category: 'Category Text',
    stock: 'Stock Text',
    value: 'Value Text',
    duration: 'Duration Text',
  }

  const renderField = (field, content, wrapperStyle, options) => {
    const { color, fontSize, minScale = 4, spanStyle = {} } = options

    return (
      <div style={{ position: 'absolute', zIndex: wrapperStyle.zIndex || 5, ...wrapperStyle }}>
        <InteractiveLayer
          layerId={rowStyle[field].layerId}
          selectedLayerIds={selectedLayerIds}
          onSelectLayer={onSelectLayer}
          onMove={(position) => onUpdateCardTextStyle(field, position)}
          position={rowStyle[field]}
          scale={rowStyle[field].fontSize}
          onScale={(updates) => onUpdateCardTextStyle(field, { fontSize: updates.scale })}
          minScale={minScale}
          selectionLabel={labelMap[field]}
          zIndex={8}
          onDoubleClickAction={onStartEditingLayer}
          isLocked={isTemplateLocked}
        >
          <span style={{ ...textStyle(rowStyle[field]), color, fontSize, whiteSpace: 'nowrap', lineHeight: 1, display: 'block', ...spanStyle }}>{content}</span>
        </InteractiveLayer>
      </div>
    )
  }

  if (variant === 'outlineNeon') {
    const categoryColor = rowStyle.category.color || '#f5fbff'
    const stockColor = rowStyle.stock.color || '#ecf8ff'
    const valuePanelText = getReadableTextColor(cardColors.pillStart, cardColors.pillEnd, '#ffffff', '#10202e')
    const valueColor = rowStyle.value.color || valuePanelText
    const durationColor = rowStyle.duration.color || withAlpha(valuePanelText, 0.9)

    return (
      <div style={{ position: 'relative', width: 684, height: 38 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 14, background: 'linear-gradient(180deg, rgba(7,20,34,0.96) 0%, rgba(4,13,24,0.98) 100%)', border: `1.5px solid ${rowBorder}`, boxShadow: `0 0 0 1px ${withAlpha(cardColors.sideStart, 0.22)}, 0 16px 28px ${withAlpha(cardColors.sideEnd, 0.2)}`, overflow: 'hidden' }} />
        <div style={{ position: 'absolute', left: 0, top: 6, width: 8, height: 26, borderRadius: '0 8px 8px 0', background: `linear-gradient(180deg, ${cardColors.tabStart} 0%, ${cardColors.tabEnd} 100%)`, boxShadow: `0 0 16px ${withAlpha(cardColors.tabEnd, 0.5)}` }} />
        <div style={{ position: 'absolute', left: 14, top: 5, width: 112, height: 28, borderRadius: 12, background: 'linear-gradient(180deg, rgba(11,26,41,0.95) 0%, rgba(10,21,34,0.94) 100%)', border: `1px solid ${withAlpha(cardColors.tabEnd, 0.6)}`, boxShadow: `0 0 18px ${withAlpha(cardColors.tabEnd, 0.26)}` }} />
        <div style={{ position: 'absolute', left: 136, top: 5, width: 204, height: 28, borderRadius: 12, background: `linear-gradient(180deg, ${withAlpha(cardColors.sideStart, 0.12)} 0%, rgba(255,255,255,0.03) 100%)`, border: `1px solid ${withAlpha(cardColors.sideStart, 0.18)}` }} />
        <div style={{ position: 'absolute', left: 352, top: 4, right: 8, height: 30, borderRadius: 14, background: `linear-gradient(90deg, ${cardColors.pillStart} 0%, ${cardColors.pillEnd} 100%)`, boxShadow: `0 12px 24px ${withAlpha(cardColors.pillEnd, 0.35)}` }} />
        {renderField('category', card.category.toUpperCase(), { left: 24, top: 5, width: 94, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }, { color: categoryColor, fontSize: categoryFontSize })}
        {renderField('stock', card.stockName, { left: 136, top: 5, width: 204, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }, { color: stockColor, fontSize: stockFontSize })}
        <div style={{ position: 'absolute', left: 352, top: 4, right: 8, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, zIndex: 5 }}>
          {renderField('value', valueWithSuffix, { left: 42, top: 4, width: 124, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }, { color: valueColor, fontSize: valueFontSize })}
          {renderField('duration', durationLabel, { right: 18, top: 4, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }, { color: durationColor, fontSize: durationFontSize })}
        </div>
      </div>
    )
  }

  if (variant === 'royalGlow') {
    const categoryColor = rowStyle.category.color || '#ffffff'
    const stockColor = rowStyle.stock.color || '#182033'
    const valueColor = rowStyle.value.color || cardColors.tabEnd
    const durationColor = rowStyle.duration.color || '#1f2740'

    return (
      <div style={{ position: 'relative', width: 684, height: 38 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 16, background: 'linear-gradient(90deg, rgba(82,25,184,0.98) 0%, rgba(120,50,255,0.95) 54%, rgba(94,34,205,0.98) 100%)', boxShadow: `0 16px 30px ${withAlpha(cardColors.sideEnd, 0.26)}`, overflow: 'hidden' }} />
        <div style={{ position: 'absolute', left: 118, top: 5, width: 226, height: 28, borderRadius: 12, background: 'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,245,255,0.92) 100%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7)' }} />
        <div style={{ position: 'absolute', left: 356, top: 5, right: 8, height: 28, borderRadius: 12, background: 'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,244,255,0.92) 100%)' }} />
        <div style={{ position: 'absolute', left: 12, top: 4, width: 102, height: 30, borderRadius: 13, background: styles.tab, boxShadow: `0 12px 22px ${styles.tabShadow}` }} />
        {renderField('category', card.category.toUpperCase(), { left: 28, top: 4, width: 80, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }, { color: categoryColor, fontSize: categoryFontSize })}
        {renderField('stock', card.stockName, { left: 118, top: 5, width: 226, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }, { color: stockColor, fontSize: stockFontSize })}
        <div style={{ position: 'absolute', left: 370, top: 8, width: 120, height: 22, borderRadius: 999, background: `linear-gradient(90deg, ${withAlpha(cardColors.tabStart, 0.14)} 0%, ${withAlpha(cardColors.tabEnd, 0.2)} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 4 }}>
          {renderField('value', valueWithSuffix, { left: 0, top: 0, width: 120, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }, { color: valueColor, fontSize: valueFontSize })}
        </div>
        {renderField('duration', durationLabel, { left: 500, top: 5, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }, { color: durationColor, fontSize: durationFontSize })}
      </div>
    )
  }

  if (variant === 'softFrame') {
    const categoryColor = rowStyle.category.color || neutralText
    const stockColor = rowStyle.stock.color || '#1d2538'
    const valueColor = rowStyle.value.color || getSafeAccentColor(cardColors.tabEnd, '#334154')
    const durationColor = rowStyle.duration.color || '#354255'

    return (
      <div style={{ position: 'relative', width: 684, height: 38 }}>
        <div style={{ position: 'absolute', inset: 1, borderRadius: 16, background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(247,245,255,0.94) 100%)', border: '1px solid rgba(255,255,255,0.7)', boxShadow: `0 14px 28px ${withAlpha(cardColors.sideEnd, 0.12)}` }} />
        <div style={{ position: 'absolute', left: 10, top: 9, width: 102, height: 20, borderRadius: 999, background: `linear-gradient(180deg, ${withAlpha(cardColors.tabStart, 0.22)} 0%, ${withAlpha(cardColors.tabEnd, 0.28)} 100%)`, border: `1px solid ${withAlpha(cardColors.tabEnd, 0.3)}` }} />
        <div style={{ position: 'absolute', left: 124, top: 6, width: 282, height: 26, borderRadius: 12, background: 'rgba(255,255,255,0.92)', border: `1px solid ${withAlpha(cardColors.sideEnd, 0.12)}` }} />
        <div style={{ position: 'absolute', left: 420, top: 4, right: 10, height: 30, borderRadius: 14, background: `linear-gradient(180deg, ${withAlpha(cardColors.tabStart, 0.1)} 0%, ${withAlpha(cardColors.tabEnd, 0.16)} 100%)`, border: `1px solid ${withAlpha(cardColors.tabEnd, 0.2)}` }} />
        {renderField('category', card.category.toUpperCase(), { left: 24, top: 9, width: 84, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }, { color: categoryColor, fontSize: categoryFontSize, spanStyle: { letterSpacing: '0.04em' } })}
        {renderField('stock', card.stockName, { left: 124, top: 6, width: 282, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }, { color: stockColor, fontSize: stockFontSize })}
        {renderField('value', valueWithSuffix, { left: 420, top: 6, right: 10, height: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }, { color: valueColor, fontSize: valueFontSize })}
        {renderField('duration', durationLabel, { left: 420, top: 19, right: 10, height: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }, { color: durationColor, fontSize: Math.max(8.2, durationFontSize - 1) })}
      </div>
    )
  }

  if (variant === 'ribbonStack') {
    const categoryColor = rowStyle.category.color || getReadableTextColor(cardColors.tabStart, cardColors.tabEnd, '#ffffff', '#1b1f28')
    const stockColor = rowStyle.stock.color || '#162331'
    const returnsTextColor = getReadableTextColor(cardColors.pillStart, cardColors.pillEnd, '#ffffff', '#192538')
    const valueColor = rowStyle.value.color || returnsTextColor
    const durationColor = rowStyle.duration.color || withAlpha(returnsTextColor, 0.94)

    return (
      <div style={{ position: 'relative', width: 684, height: 38 }}>
        <div style={{ position: 'absolute', left: 0, top: 4, width: 126, height: 30, background: styles.tab, clipPath: 'polygon(6% 0, 100% 0, 92% 100%, 0 100%)', boxShadow: `0 12px 22px ${styles.tabShadow}` }} />
        <div style={{ position: 'absolute', left: 126, top: 4, width: 248, height: 30, borderRadius: 16, background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,248,248,0.98) 100%)', boxShadow: '0 12px 22px rgba(0,0,0,0.12)' }} />
        <div style={{ position: 'absolute', left: 384, top: 3, right: 0, height: 32, borderRadius: 16, background: `linear-gradient(90deg, ${cardColors.pillStart} 0%, ${cardColors.pillEnd} 100%)`, boxShadow: `0 14px 22px ${withAlpha(cardColors.pillEnd, 0.34)}` }} />
        {renderField('category', card.category.toUpperCase(), { left: 22, top: 4, width: 92, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }, { color: categoryColor, fontSize: categoryFontSize })}
        {renderField('stock', card.stockName, { left: 126, top: 4, width: 248, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }, { color: stockColor, fontSize: stockFontSize })}
        {renderField('value', valueWithSuffix, { left: 404, top: 3, width: 108, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }, { color: valueColor, fontSize: valueFontSize })}
        {renderField('duration', durationLabel, { right: 18, top: 3, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }, { color: durationColor, fontSize: durationFontSize })}
      </div>
    )
  }

  if (variant === 'sidebandClean') {
    const categoryColor = rowStyle.category.color || '#ffffff'
    const stockColor = rowStyle.stock.color || '#172433'
    const valueColor = rowStyle.value.color || getSafeAccentColor(cardColors.tabEnd, '#172433')
    const durationColor = rowStyle.duration.color || '#172433'

    return (
      <div style={{ position: 'relative', width: 684, height: 38 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 14, background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(251,251,251,0.98) 100%)', boxShadow: '0 12px 24px rgba(66,84,101,0.12)', overflow: 'hidden' }} />
        <div style={{ position: 'absolute', left: 0, top: 0, width: 18, height: 38, background: `linear-gradient(180deg, ${cardColors.tabStart} 0%, ${cardColors.tabEnd} 100%)` }} />
        <div style={{ position: 'absolute', left: 30, top: 7, width: 112, height: 24, borderRadius: 10, background: styles.tab, boxShadow: `0 10px 18px ${styles.tabShadow}` }} />
        <div style={{ position: 'absolute', left: 154, top: 7, width: 1, height: 24, background: 'rgba(15,31,42,0.08)' }} />
        <div style={{ position: 'absolute', left: 406, top: 7, width: 1, height: 24, background: 'rgba(15,31,42,0.08)' }} />
        {renderField('category', card.category.toUpperCase(), { left: 44, top: 7, width: 92, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }, { color: categoryColor, fontSize: categoryFontSize })}
        {renderField('stock', card.stockName, { left: 158, top: 0, width: 242, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center' }, { color: stockColor, fontSize: stockFontSize })}
        {renderField('value', valueWithSuffix, { left: 430, top: 0, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }, { color: valueColor, fontSize: valueFontSize })}
        {renderField('duration', durationLabel, { right: 18, top: 0, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }, { color: durationColor, fontSize: durationFontSize })}
      </div>
    )
  }

  if (variant === 'bold') {
    const categoryColor = rowStyle.category.color || '#ffffff'
    const stockColor = rowStyle.stock.color || '#18212f'
    const returnsTextColor = getReadableTextColor(cardColors.tabStart, cardColors.tabEnd, '#ffffff', '#18212f')
    const valueColor = rowStyle.value.color || returnsTextColor
    const durationColor = rowStyle.duration.color || withAlpha(returnsTextColor, 0.92)

    return (
      <div style={{ position: 'relative', width: 684, height: 38 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 14, background: 'linear-gradient(180deg, rgba(255,255,255,0.99) 0%, rgba(250,244,239,0.98) 100%)', boxShadow: '0 16px 26px rgba(0,0,0,0.16)', overflow: 'hidden' }} />
        <div style={{ position: 'absolute', left: 0, top: 0, width: 118, height: 38, background: styles.tab, clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0 100%)', boxShadow: `0 14px 22px ${styles.tabShadow}` }} />
        <div style={{ position: 'absolute', left: 410, top: 3, right: 4, height: 32, borderRadius: 12, background: styles.tab, boxShadow: `0 14px 22px ${styles.tabShadow}` }} />
        <div style={{ position: 'absolute', left: 126, top: 0, width: 270, height: 38, borderRight: `1px solid ${withAlpha(cardColors.tabEnd, 0.15)}` }} />
        {renderField('category', card.category.toUpperCase(), { left: 18, top: 0, width: 94, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }, { color: categoryColor, fontSize: categoryFontSize })}
        {renderField('stock', card.stockName, { left: 126, top: 0, width: 270, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center' }, { color: stockColor, fontSize: stockFontSize })}
        {renderField('value', valueWithSuffix, { left: 432, top: 3, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }, { color: valueColor, fontSize: valueFontSize })}
        {renderField('duration', durationLabel, { right: 18, top: 3, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }, { color: durationColor, fontSize: durationFontSize })}
      </div>
    )
  }

  const categoryColor = rowStyle.category.color || getReadableTextColor(cardColors.tabStart, cardColors.tabEnd, '#ffffff', neutralText)
  const stockColor = rowStyle.stock.color || '#162331'
  const accentValueColor = getSafeAccentColor(cardColors.tabEnd, neutralText)
  const valueColor = rowStyle.value.color || accentValueColor
  const durationColor = rowStyle.duration.color || '#162331'

  return (
    <div style={{ position: 'relative', width: 684, height: 38 }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 12,
          background: rowSurface,
          border: `2px solid ${rowBorder}`,
          boxShadow: `0 12px 24px ${withAlpha(cardColors.tabEnd, 0.16)}`,
          overflow: 'hidden',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 114,
          top: 1,
          width: 286,
          height: 36,
          background: stockSurface,
          borderRight: `1px solid ${dividerColor}`,
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 401,
          top: 1,
          right: 1,
          height: 36,
          background: returnsSurface,
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 112,
          height: 38,
          borderRadius: 10,
          background: styles.tab,
          boxShadow: `0 8px 18px ${styles.tabShadow}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingLeft: 16,
          zIndex: 2,
        }}
      >
        <InteractiveLayer
          layerId={rowStyle.category.layerId}
          selectedLayerIds={selectedLayerIds}
          onSelectLayer={onSelectLayer}
          onMove={(position) => onUpdateCardTextStyle('category', position)}
          position={rowStyle.category}
          scale={rowStyle.category.fontSize}
          onScale={(updates) => onUpdateCardTextStyle('category', { fontSize: updates.scale })}
          minScale={4}
          selectionLabel="Category Text"
          zIndex={8}
          onDoubleClickAction={onStartEditingLayer}
          isLocked={isTemplateLocked}
        >
          <span style={{ ...textStyle(rowStyle.category), color: categoryColor, fontSize: categoryFontSize, whiteSpace: 'nowrap' }}>{card.category.toUpperCase()}</span>
        </InteractiveLayer>
      </div>
      <div style={{ position: 'absolute', left: 114, top: 1, width: 286, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
        <InteractiveLayer
          layerId={rowStyle.stock.layerId}
          selectedLayerIds={selectedLayerIds}
          onSelectLayer={onSelectLayer}
          onMove={(position) => onUpdateCardTextStyle('stock', position)}
          position={rowStyle.stock}
          scale={rowStyle.stock.fontSize}
          onScale={(updates) => onUpdateCardTextStyle('stock', { fontSize: updates.scale })}
          minScale={4}
          selectionLabel="Stock Text"
          zIndex={8}
          onDoubleClickAction={onStartEditingLayer}
          isLocked={isTemplateLocked}
        >
          <span style={{ ...textStyle(rowStyle.stock), color: stockColor, fontSize: stockFontSize, whiteSpace: 'nowrap' }}>{card.stockName}</span>
        </InteractiveLayer>
      </div>
      <div style={{ position: 'absolute', left: 401, top: 1, right: 8, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, maxWidth: 258, justifyContent: 'center', flexWrap: 'nowrap' }}>
          <InteractiveLayer
            layerId={rowStyle.value.layerId}
            selectedLayerIds={selectedLayerIds}
            onSelectLayer={onSelectLayer}
            onMove={(position) => onUpdateCardTextStyle('value', position)}
            position={rowStyle.value}
            scale={rowStyle.value.fontSize}
            onScale={(updates) => onUpdateCardTextStyle('value', { fontSize: updates.scale })}
            minScale={4}
            selectionLabel="Value Text"
            zIndex={8}
            onDoubleClickAction={onStartEditingLayer}
            isLocked={isTemplateLocked}
          >
            <span style={{ ...textStyle(rowStyle.value), color: valueColor, fontSize: valueFontSize, whiteSpace: 'nowrap' }}>{valueWithSuffix}</span>
          </InteractiveLayer>
          <InteractiveLayer
            layerId={rowStyle.duration.layerId}
            selectedLayerIds={selectedLayerIds}
            onSelectLayer={onSelectLayer}
            onMove={(position) => onUpdateCardTextStyle('duration', position)}
            position={rowStyle.duration}
            scale={rowStyle.duration.fontSize}
            onScale={(updates) => onUpdateCardTextStyle('duration', { fontSize: updates.scale })}
            minScale={4}
            selectionLabel="Duration Text"
            zIndex={8}
            onDoubleClickAction={onStartEditingLayer}
            isLocked={isTemplateLocked}
          >
            <span style={{ ...textStyle(rowStyle.duration), color: durationColor, fontSize: durationFontSize, whiteSpace: 'nowrap' }}>{durationLabel}</span>
          </InteractiveLayer>
        </div>
      </div>
    </div>
  )
}

const BannerPreview = forwardRef(function BannerPreview(
  { data, textStyles, layoutStyles, cardLayouts, cardColorStyles, template, selectedLayerId, selectedLayerIds, editingLayerId, onSelectLayer, onAddLayerToSelection, onClearSelection, onStartEditingLayer, onStopEditingLayer, onFieldChange, onCardDataChange, onUpdateBannerTextStyle, onUpdateCardTextStyle, onUpdateLogoLayout, onUpdateCardLayout, isTemplateLocked },
  ref
) {
  const rightSelectRef = useRef({ active: false, pointerId: null, additive: false })
  const headingColor = textStyles.heading.color || template.typography.headingColor
  const headingAccentColor = textStyles.heading.color ? textStyles.heading.color : template.typography.headingAccentColor
  const extraColor = textStyles.extra.color || template.typography.extraColor
  const disclaimerColor = textStyles.disclaimer.color || template.typography.disclaimerColor
  const isWeeklyReport = data.reportType === 'weekly'
  const generatedHeading = isWeeklyReport ? `${data.totalProfits} Profits Booked This Week` : `${data.totalProfits} Profits Booked Already in ${data.month}`
  const headingText = data.customHeading?.trim() || generatedHeading
  const activeCardLayouts = cardLayouts || layoutStyles.monthlyCards || []
  const weeklyHeaderColor = getWeeklyHeaderColor(template)
  const weeklyHeaderShadow =
    new Set(['minimal', 'softFrame', 'ribbonStack', 'sidebandClean']).has(template.cards.variant)
      ? 'none'
      : '0 2px 10px rgba(0,0,0,0.15)'

  const selectLayerFromPoint = (clientX, clientY, additive = false) => {
    const elements = document.elementsFromPoint(clientX, clientY)
    for (const element of elements) {
      if (!(element instanceof HTMLElement)) {
        continue
      }
      const layerElement = element.closest('[data-layer-id]')
      if (layerElement instanceof HTMLElement) {
        const layerId = layerElement.dataset.layerId
        if (layerId) {
          if (additive) {
            onAddLayerToSelection(layerId)
          } else {
            onSelectLayer(layerId)
          }
          return
        }
      }
    }

    if (!additive && onClearSelection) {
      onClearSelection()
    }
  }

  return (
    <div
      ref={ref}
      onContextMenu={(event) => event.preventDefault()}
      onPointerDown={(event) => {
        if (event.button !== 2) {
          return
        }

        event.preventDefault()
        const additive = event.shiftKey
        rightSelectRef.current = { active: true, pointerId: event.pointerId, additive }
        selectLayerFromPoint(event.clientX, event.clientY, additive)
      }}
      onPointerMove={(event) => {
        if (!rightSelectRef.current.active || rightSelectRef.current.pointerId !== event.pointerId) {
          return
        }

        event.preventDefault()
        selectLayerFromPoint(event.clientX, event.clientY, rightSelectRef.current.additive)
      }}
      onPointerUp={(event) => {
        if (rightSelectRef.current.pointerId === event.pointerId) {
          rightSelectRef.current = { active: false, pointerId: null, additive: false }
        }
      }}
      onPointerCancel={(event) => {
        if (rightSelectRef.current.pointerId === event.pointerId) {
          rightSelectRef.current = { active: false, pointerId: null, additive: false }
        }
      }}
      onClick={() => {
        if (onClearSelection) {
          onClearSelection()
        }
      }}
      style={{
        position: 'relative',
        width: 800,
        height: 400,
        overflow: 'hidden',
        background: template.preview.background,
        fontFamily: "'Outfit', 'Inter', sans-serif",
        transition: 'background 320ms ease',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, background: template.preview.sheen, opacity: 0.6, transition: 'background 320ms ease' }} />

      <svg viewBox="0 0 800 400" width="800" height="400" style={{ position: 'absolute', inset: 0, opacity: 0.9 }}>
        <path d="M-80 72 C 70 214, 255 248, 401 236 C 574 221, 707 138, 875 34" stroke={template.preview.lineColor} strokeWidth="1.6" fill="none" />
        <path d="M-100 114 C 84 261, 260 314, 439 298 C 587 285, 744 218, 916 98" stroke={template.preview.lineColorSoft} strokeWidth="1.4" fill="none" />
        <path d="M-60 212 C 134 314, 268 357, 470 338 C 633 324, 757 271, 903 182" stroke={template.preview.lineColorFaint} strokeWidth="1.2" fill="none" />
        <path d="M-44 328 C 154 385, 335 397, 518 380 C 657 367, 760 332, 866 272" stroke={template.preview.lineColorTiny} strokeWidth="1.15" fill="none" />
      </svg>

      <InteractiveLayer
        layerId="logo"
        selectedLayerIds={selectedLayerIds}
        onSelectLayer={onSelectLayer}
        onMove={onUpdateLogoLayout}
        position={layoutStyles.logo}
        scale={layoutStyles.logo.scale}
        onScale={onUpdateLogoLayout}
        className="absolute left-0 top-0"
        selectionLabel="Logo"
        zIndex={10}
        isLocked={isTemplateLocked}
      >
        <img
          src={logoSrc}
          alt="Univest"
          style={{
            width: 116,
            height: 'auto',
            display: 'block',
            objectFit: 'contain',
            transform: `scale(${layoutStyles.logo.scale})`,
            transformOrigin: 'top left',
            transition: 'transform 260ms ease',
          }}
        />
      </InteractiveLayer>

      <div style={{ position: 'absolute', left: 0, right: 0, top: isWeeklyReport ? 50 : 66, zIndex: 2, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 748, display: 'flex', justifyContent: 'center' }}>
          <InteractiveLayer
            layerId="heading"
            selectedLayerIds={selectedLayerIds}
            onSelectLayer={onSelectLayer}
            onMove={(position) => onUpdateBannerTextStyle('heading', position)}
            position={textStyles.heading}
            scale={textStyles.heading.fontSize}
            onScale={(updates) => onUpdateBannerTextStyle('heading', { fontSize: updates.scale })}
            minScale={4}
            selectionLabel="Heading"
            zIndex={6}
            onDoubleClickAction={onStartEditingLayer}
            isLocked={isTemplateLocked}
          >
            <h1 style={{ ...textStyle(textStyles.heading), margin: 0, width: 748, color: headingColor, textAlign: 'center', lineHeight: 1.01, textShadow: '0 3px 18px rgba(0, 0, 0, 0.18)', transition: 'color 260ms ease' }}>
              {data.customHeading?.trim() ? headingText : (
                isWeeklyReport ? (
                  headingText
                ) : (
                  <>
                    {data.totalProfits} Profits Booked Already in <span style={{ color: headingAccentColor, transition: 'color 260ms ease' }}>{data.month}</span>
                  </>
                )
              )}
            </h1>
          </InteractiveLayer>
        </div>
      </div>

      {isWeeklyReport ? (
        <>
          <div style={{ position: 'absolute', left: 66, top: 106, width: 668, display: 'grid', gridTemplateColumns: '112px 286px 270px', columnGap: 0, zIndex: 3, color: weeklyHeaderColor, fontFamily: resolveFontFamily(template.typography.bodyFont), fontSize: 10.5, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', textShadow: weeklyHeaderShadow }}>
            <span>Segment</span>
            <span style={{ textAlign: 'center' }}>Stock Name</span>
            <span style={{ textAlign: 'center' }}>Returns</span>
          </div>

          {data.cards.slice(0, 4).map((card, index) => {
            const rowLayout = activeCardLayouts[index]
            const cardText = textStyles.cards[index]
            const cardColors = cardColorStyles[index]

            return (
              <InteractiveLayer
                key={`${card.category}-${card.stockName}-${index}`}
                layerId={`card-frame-${index}`}
                selectedLayerIds={selectedLayerIds}
                onSelectLayer={onSelectLayer}
                onMove={(position) => onUpdateCardLayout(index, position)}
                position={rowLayout}
                scale={rowLayout.scale}
                onScale={(updates) => onUpdateCardLayout(index, updates)}
                className="absolute left-0 top-0"
                selectionLabel={`Row ${index + 1}`}
                zIndex={7}
                isLocked={isTemplateLocked}
              >
                <div style={{ transform: `scale(${rowLayout.scale})`, transformOrigin: 'top left' }}>
                  <WeeklyReportRow
                    card={card}
                    cardColors={cardColors}
                    template={template}
                    selectedLayerIds={selectedLayerIds}
                    onSelectLayer={onSelectLayer}
                    onStartEditingLayer={onStartEditingLayer}
                    onUpdateCardTextStyle={(layer, updates) => onUpdateCardTextStyle(index, layer, updates)}
                    isTemplateLocked={isTemplateLocked}
                    rowStyle={{
                      category: { ...cardText.category, layerId: `card-${index}-category` },
                      value: { ...cardText.value, layerId: `card-${index}-value` },
                      duration: { ...cardText.duration, layerId: `card-${index}-duration` },
                      stock: { ...cardText.stock, layerId: `card-${index}-stock` },
                    }}
                  />
                </div>
              </InteractiveLayer>
            )
          })}
        </>
      ) : (
        data.cards.slice(0, 4).map((card, index) => {
          const cardLayout = activeCardLayouts[index]
          const cardText = textStyles.cards[index]
          const cardColors = cardColorStyles[index]

          return (
            <InteractiveLayer
              key={`${card.category}-${card.stockName}-${index}`}
              layerId={`card-frame-${index}`}
              selectedLayerIds={selectedLayerIds}
              onSelectLayer={onSelectLayer}
              onMove={(position) => onUpdateCardLayout(index, position)}
              position={cardLayout}
              scale={cardLayout.scale}
              onScale={(updates) => onUpdateCardLayout(index, updates)}
              className="absolute left-0 top-0"
              selectionLabel={`Card ${index + 1}`}
              zIndex={7}
              isLocked={isTemplateLocked}
            >
              <div style={{ transform: `scale(${cardLayout.scale})`, transformOrigin: 'top left' }}>
                <BannerCardContent
                  card={card}
                  cardColors={cardColors}
                  template={template}
                  selectedLayerId={selectedLayerId}
                  selectedLayerIds={selectedLayerIds}
                  onSelectLayer={onSelectLayer}
                  onStartEditingLayer={onStartEditingLayer}
                  onUpdateCardTextStyle={(layer, updates) => onUpdateCardTextStyle(index, layer, updates)}
                  isTemplateLocked={isTemplateLocked}
                  cardStyle={{
                    category: { ...cardText.category, layerId: `card-${index}-category` },
                    value: { ...cardText.value, layerId: `card-${index}-value` },
                    duration: { ...cardText.duration, layerId: `card-${index}-duration` },
                    stock: { ...cardText.stock, layerId: `card-${index}-stock` },
                  }}
                />
              </div>
            </InteractiveLayer>
          )
        })
      )}

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: isWeeklyReport ? 44 : 58, zIndex: 8, display: 'flex', justifyContent: 'center' }}>
        <InteractiveLayer
          layerId="extra"
          selectedLayerIds={selectedLayerIds}
          onSelectLayer={onSelectLayer}
          onMove={(position) => onUpdateBannerTextStyle('extra', position)}
          position={textStyles.extra}
          scale={textStyles.extra.fontSize}
          onScale={(updates) => onUpdateBannerTextStyle('extra', { fontSize: updates.scale })}
          minScale={4}
          selectionLabel="More Count"
          zIndex={8}
          onDoubleClickAction={onStartEditingLayer}
          isLocked={isTemplateLocked}
        >
          <div style={{ ...textStyle(textStyles.extra), color: extraColor, textShadow: '0 2px 14px rgba(0, 0, 0, 0.26)', transition: 'color 260ms ease' }}>
            {isWeeklyReport ? `& ${data.extraCount} MORE >` : `+${data.extraCount} More`}
          </div>
        </InteractiveLayer>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '11px 28px 13px', background: template.preview.footerGradient, borderTop: `1px solid ${template.preview.footerBorder}`, zIndex: 2, display: 'flex', justifyContent: 'center', transition: 'all 260ms ease' }}>
        <InteractiveLayer
          layerId="disclaimer"
          selectedLayerIds={selectedLayerIds}
          onSelectLayer={onSelectLayer}
          onMove={(position) => onUpdateBannerTextStyle('disclaimer', position)}
          position={textStyles.disclaimer}
          scale={textStyles.disclaimer.fontSize}
          onScale={(updates) => onUpdateBannerTextStyle('disclaimer', { fontSize: updates.scale })}
          minScale={4}
          selectionLabel="Disclaimer"
          zIndex={6}
          onDoubleClickAction={onStartEditingLayer}
          isLocked={isTemplateLocked}
        >
          <p style={{ ...textStyle(textStyles.disclaimer), margin: 0, width: 730, color: disclaimerColor, textAlign: 'center', lineHeight: 1.38, transition: 'color 260ms ease' }}>
            {data.disclaimer}
          </p>
        </InteractiveLayer>
      </div>
      <TextEditorOverlay
        editingLayerId={editingLayerId}
        data={data}
        onFieldChange={onFieldChange}
        onCardDataChange={onCardDataChange}
        onClose={onStopEditingLayer}
      />
    </div>
  )
})

export default BannerPreview
