import { forwardRef, useEffect, useRef } from 'react'

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
      <div className="grid gap-3 sm:grid-cols-2">
        <OverlayInput label="Total profits" value={data.totalProfits} onChange={(value) => onFieldChange('totalProfits', value)} onClose={onClose} autoFocus />
        <OverlayInput label="Month" value={data.month} onChange={(value) => onFieldChange('month', value)} onClose={onClose} />
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

const BannerPreview = forwardRef(function BannerPreview(
  { data, textStyles, layoutStyles, cardColorStyles, template, selectedLayerId, selectedLayerIds, editingLayerId, onSelectLayer, onAddLayerToSelection, onClearSelection, onStartEditingLayer, onStopEditingLayer, onFieldChange, onCardDataChange, onUpdateBannerTextStyle, onUpdateCardTextStyle, onUpdateLogoLayout, onUpdateCardLayout, isTemplateLocked },
  ref
) {
  const rightSelectRef = useRef({ active: false, pointerId: null, additive: false })
  const headingColor = textStyles.heading.color || template.typography.headingColor
  const headingAccentColor = textStyles.heading.color ? textStyles.heading.color : template.typography.headingAccentColor
  const extraColor = textStyles.extra.color || template.typography.extraColor
  const disclaimerColor = textStyles.disclaimer.color || template.typography.disclaimerColor

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
          src="/logo.png"
          alt="Univest"
          crossOrigin="anonymous"
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

      <div style={{ position: 'absolute', left: 0, right: 0, top: 66, zIndex: 2, display: 'flex', justifyContent: 'center' }}>
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
              {data.totalProfits} Profits Booked Already in <span style={{ color: headingAccentColor, transition: 'color 260ms ease' }}>{data.month}</span>
            </h1>
          </InteractiveLayer>
        </div>
      </div>

      {data.cards.slice(0, 4).map((card, index) => {
        const cardLayout = layoutStyles.cards[index]
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
      })}

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 58, zIndex: 8, display: 'flex', justifyContent: 'center' }}>
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
          <div style={{ ...textStyle(textStyles.extra), color: extraColor, textShadow: '0 2px 14px rgba(0, 0, 0, 0.26)', transition: 'color 260ms ease' }}>+{data.extraCount} More</div>
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
