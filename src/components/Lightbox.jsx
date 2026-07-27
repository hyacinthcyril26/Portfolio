import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'
import { FiChevronLeft, FiChevronRight, FiX, FiMaximize2, FiMinimize2, FiGrid } from 'react-icons/fi'
import './Lightbox.css'

const isVideo = f => f.toLowerCase().endsWith('.mp4')

/* ── Portrait scroll preview ─────────────────────────────────── */
function PortraitScroll({ src, alt, onClick }) {
  const containerRef = useRef(null)
  const imgRef = useRef(null)
  const tlRef = useRef(null)

  useEffect(() => {
    return () => { if (tlRef.current) tlRef.current.kill() }
  }, [])

  const handleLoad = () => {
    const img = imgRef.current
    const container = containerRef.current
    if (!img || !container) return

    const scrollDist = img.offsetHeight - container.offsetHeight
    if (scrollDist <= 0) return

    if (tlRef.current) tlRef.current.kill()

    const speed = 55
    const dur = Math.max(3, Math.min(scrollDist / speed, 14))

    const tl = gsap.timeline({ repeat: -1 })
    tl.to(img, { y: -scrollDist, duration: dur, ease: 'none', delay: 1.5 })
    tl.to(img, { y: 0, duration: dur, ease: 'none', delay: 1.5 })

    tlRef.current = tl
  }

  return (
    <div ref={containerRef} className="lb-portrait-viewport" onClick={onClick}>
      <img
        ref={imgRef}
        src={src}
        alt={alt || ''}
        className="lb-portrait-img"
        onLoad={handleLoad}
        draggable={false}
      />
      <div className="lb-portrait-overlay">
        <span className="lb-portrait-tag">Click to view full design</span>
      </div>
    </div>
  )
}

/* ── Lightbox ─────────────────────────────────────────────────── */
export default function Lightbox({ project, onClose }) {
  const [current,    setCurrent]    = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [gridMode,   setGridMode]   = useState(false)
  const [fullView,   setFullView]   = useState(null)
  const [portraitMap, setPortraitMap] = useState({})

  const overlayRef = useRef(null)
  const boxRef     = useRef(null)
  const mediaRef   = useRef(null)
  const thumbsRef  = useRef(null)

  const pages = project.files
  const total = pages.length
  const page  = pages[current]
  const isVid = isVideo(page)
  const isPortrait = !isVid && portraitMap[current]

  /* ── pre-detect portrait images ── */
  useEffect(() => {
    pages.forEach((file, i) => {
      if (isVideo(file)) return
      const img = new Image()
      img.onload = () => {
        if (img.naturalHeight > img.naturalWidth * 1.3) {
          setPortraitMap(prev => ({ ...prev, [i]: true }))
        }
      }
      img.src = file
    })
  }, [pages])

  /* ── open animation ── */
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    gsap.fromTo(overlayRef.current, { opacity: 0 },                      { opacity: 1,           duration: 0.28, ease: 'power2.out' })
    gsap.fromTo(boxRef.current,     { opacity: 0, scale: 0.96, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.38, ease: 'power3.out', delay: 0.06 })
    return () => { document.body.style.overflow = '' }
  }, [])

  /* ── close ── */
  const close = useCallback(() => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.22, ease: 'power2.in', onComplete: onClose })
    gsap.to(boxRef.current,     { opacity: 0, scale: 0.97, y: 12, duration: 0.2, ease: 'power2.in' })
  }, [onClose])

  /* ── navigate ── */
  const goTo = useCallback((next, skipAnim = false) => {
    if (next === current || next < 0 || next >= total) return
    const dir  = next > current ? 1 : -1
    const node = mediaRef.current

    const commit = () => {
      setCurrent(next)
      setTimeout(() => {
        const strip = thumbsRef.current
        if (!strip) return
        const thumb = strip.children[next]
        if (thumb) thumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
      }, 200)
    }

    if (skipAnim || !node) { commit(); return }

    gsap.to(node, {
      x: dir * -50, opacity: 0, duration: 0.18, ease: 'power2.in',
      onComplete: () => {
        commit()
        requestAnimationFrame(() => {
          if (!mediaRef.current) return
          gsap.fromTo(mediaRef.current, { x: dir * 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.24, ease: 'power2.out' })
        })
      },
    })
  }, [current, total])

  /* ── pick from grid ── */
  const pickFromGrid = (i) => {
    setCurrent(i)
    setGridMode(false)
  }

  /* ── keyboard ── */
  useEffect(() => {
    const fn = e => {
      if (fullView !== null) {
        if (e.key === 'Escape') setFullView(null)
        return
      }
      if (gridMode) {
        if (e.key === 'Escape') setGridMode(false)
        return
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(current + 1)
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goTo(current - 1)
      if (e.key === 'Escape') close()
      if (e.key === 'g' || e.key === 'G') setGridMode(v => !v)
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [close, current, goTo, gridMode, fullView])

  const boxClass = ['lb-box', fullscreen && 'lb-box--full', gridMode && 'lb-box--grid'].filter(Boolean).join(' ')

  /* Portalled to <body> so the overlay escapes the projects section's
     stacking context (otherwise the navbar paints over the modal). */
  return createPortal(
    <div
      ref={overlayRef}
      className="lb-overlay"
      style={{
        '--accent':      project.color,
        '--accent-soft': `${project.color}22`,
        '--accent-mid':  `${project.color}55`,
      }}
      onClick={e => e.target === overlayRef.current && close()}
    >
      <div ref={boxRef} className={boxClass}>

        {/* ── HEADER ── */}
        <div className="lb-header">
          <div className="lb-header-left">
            <span className="lb-eyebrow">Portfolio</span>
            <h3 className="lb-title">{project.title}</h3>
          </div>
          <div className="lb-header-right">
            <span className="lb-counter">{String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>

            <button
              className={`lb-icon-btn${gridMode ? ' lb-icon-btn--active' : ''}`}
              onClick={() => setGridMode(v => !v)}
              aria-label={gridMode ? 'Back to viewer' : 'Show all as grid'}
              title={gridMode ? 'Back to viewer (G)' : 'Grid overview (G)'}
            >
              <FiGrid />
            </button>

            <button
              className="lb-icon-btn"
              onClick={() => setFullscreen(v => !v)}
              aria-label="Toggle fullscreen"
              title="Toggle fullscreen (F)"
            >
              {fullscreen ? <FiMinimize2 /> : <FiMaximize2 />}
            </button>

            <button className="lb-icon-btn lb-close" onClick={close} aria-label="Close">
              <FiX />
            </button>
          </div>
        </div>

        {/* ── GRID MODE ── */}
        {gridMode ? (
          <div className="lb-grid-view">
            {pages.map((f, i) => (
              <button
                key={f}
                className={`lb-grid-item${i === current ? ' lb-grid-item--active' : ''}`}
                onClick={() => pickFromGrid(i)}
                aria-label={`View item ${i + 1}`}
              >
                {isVideo(f) ? (
                  <div className="lb-grid-video">
                    <FiChevronRight className="lb-grid-play" />
                    <span className="lb-grid-chip">Video</span>
                  </div>
                ) : (
                  <img src={f} alt="" className="lb-grid-img" loading="lazy" draggable={false} />
                )}
                <span className="lb-grid-num">{String(i + 1).padStart(2, '0')}</span>
                {i === current && <span className="lb-grid-badge">Current</span>}
              </button>
            ))}
          </div>
        ) : (
          <>
            {/* ── SINGLE VIEW STAGE ── */}
            <div className="lb-stage">
              {total > 1 && (
                <button
                  className={`lb-arrow lb-arrow--prev${current === 0 ? ' lb-arrow--off' : ''}`}
                  onClick={() => goTo(current - 1)}
                  aria-label="Previous"
                >
                  <FiChevronLeft />
                </button>
              )}

              <div className="lb-media-wrap">
                <div ref={mediaRef} key={page} className="lb-media-container">
                  {isVid ? (
                    <video
                      src={page}
                      className="lb-media"
                      controls
                      autoPlay
                      loop
                      playsInline
                    />
                  ) : isPortrait ? (
                    <PortraitScroll
                      src={page}
                      alt={`${project.title} ${current + 1}`}
                      onClick={() => setFullView(current)}
                    />
                  ) : (
                    <img
                      src={page}
                      alt={`${project.title} ${current + 1}`}
                      className="lb-media lb-media--clickable"
                      onClick={() => setFullView(current)}
                      title="Click to view full design"
                    />
                  )}
                </div>
              </div>

              {total > 1 && (
                <button
                  className={`lb-arrow lb-arrow--next${current === total - 1 ? ' lb-arrow--off' : ''}`}
                  onClick={() => goTo(current + 1)}
                  aria-label="Next"
                >
                  <FiChevronRight />
                </button>
              )}
            </div>

            {/* ── THUMBNAIL STRIP ── */}
            {total > 1 && (
              <div className="lb-thumbs" ref={thumbsRef}>
                {pages.map((f, i) => (
                  <button
                    key={f}
                    className={`lb-thumb${i === current ? ' lb-thumb--active' : ''}`}
                    onClick={() => goTo(i)}
                    aria-label={`Go to item ${i + 1}`}
                  >
                    {isVideo(f) ? (
                      <div className="lb-thumb-video">
                        <FiChevronRight className="lb-thumb-play-icon" />
                      </div>
                    ) : (
                      <img src={f} alt="" className="lb-thumb-img" loading="lazy" draggable={false} />
                    )}
                    <span className="lb-thumb-num">{String(i + 1).padStart(2, '0')}</span>
                  </button>
                ))}
              </div>
            )}

            {/* ── HINT ── */}
            <p className="lb-hint">Arrow keys to navigate &middot; G for grid &middot; Click image for full view &middot; Esc to close</p>
          </>
        )}
      </div>

      {/* ── FULL WEB VIEW OVERLAY ── */}
      {fullView !== null && !isVideo(pages[fullView]) && (
        <div className="lb-fullview" onClick={() => setFullView(null)}>
          <button className="lb-fullview-close" onClick={() => setFullView(null)} aria-label="Close full view">
            <FiX />
          </button>
          <div className="lb-fullview-body" onClick={e => e.stopPropagation()}>
            <img src={pages[fullView]} alt={`${project.title} full view`} className="lb-fullview-img" draggable={false} />
          </div>
        </div>
      )}
    </div>,
    document.body
  )
}
