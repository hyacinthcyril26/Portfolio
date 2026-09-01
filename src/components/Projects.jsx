import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lightbox from './Lightbox'
import VideoPoster from './VideoPoster'
import './Projects.css'

gsap.registerPlugin(ScrollTrigger)

const BASE = `${import.meta.env.BASE_URL}projects`
const enc = file => encodeURIComponent(file)
const isVideoFile = file => file.toLowerCase().endsWith('.mp4')

const getPreviewWindow = (files, startIndex, count = 3) => (
  Array.from({ length: Math.min(count, files.length) }, (_, offset) => files[(startIndex + offset) % files.length])
)

/* Design-only pieces: shown as concepts, not delivered client work. */
const CONCEPT = true

/* Development folders: each file is a distinct project, so `items` carries the
   per-screenshot title and stack that the lightbox renders as a caption. */
const devItems = (folder, entries) => entries.map(([file, title, tech, concept]) => ({
  file: `${BASE}/${folder}/${enc(file)}`,
  title,
  tech,
  concept: Boolean(concept),
}))

const rawCategories = [
  {
    id: 'web-projects',
    title: 'Web Projects',
    desc: 'Management systems, portals, and booking platforms built end to end for real operations.',
    color: '#3b82f6',
    type: 'image',
    kicker: 'Development vault',
    unit: 'projects',
    items: devItems('web', [
      ['hakot.png', 'HAKOT: Waste Collection Management', 'Laravel · Flutter · MySQL · OpenLayers · Firebase'],
      ['quarry.png', 'Quarry Management System', 'Laravel · React · MySQL'],
      ['printing-press.png', 'Printing Press Management System', 'Laravel · React · MySQL'],
      ['um-research-portal.png', 'UM Research Portal', 'PHP · MySQL · HTML · CSS · JavaScript'],
      ['remittance.png', 'Remittance Management System', 'Quasar · Vue.js · JavaScript'],
      ['payroll.png', 'Payroll System', 'Laravel · PHP · React · MySQL'],
      ['letecia-farm.jpg', 'Letecia Farm Staycation', 'React · Laravel · MySQL · Firebase'],
    ]),
  },
  {
    id: 'mobile-projects',
    title: 'Mobile App Projects',
    desc: 'Mobile-first apps for service booking, marketplace ordering, and workforce attendance.',
    color: '#10b981',
    type: 'image',
    kicker: 'Development vault',
    unit: 'projects',
    items: devItems('mobile', [
      ['laundry-express.png', 'Laundry Express', 'React Native · Flutter · Firebase · Supabase'],
      ['timekeep.png', 'TimeKeep — Attendance Monitoring', 'Flutter · Firebase · Laravel API', CONCEPT],
      ['animart.png', 'AniMart — Farm Produce Marketplace', 'React Native · Supabase · Expo', CONCEPT],
    ]),
  },
  {
    id: 'desktop-projects',
    title: 'Desktop App Projects',
    desc: 'Native desktop software for point-of-sale, clinic records, and warehouse inventory control.',
    color: '#f43f5e',
    type: 'image',
    kicker: 'Development vault',
    unit: 'projects',
    items: devItems('desktop', [
      ['fusionserve-pos.png', 'FusionServe POS', 'Flutter · SQLite'],
      ['meditrack.png', 'MediTrack — Clinic Records', 'Java · JavaFX · MySQL', CONCEPT],
      ['stockpilot.png', 'StockPilot — Warehouse Inventory', 'Python · PyQt6 · PostgreSQL', CONCEPT],
    ]),
  },
  {
    id: 'wireframes',
    title: 'Wireframes',
    desc: 'UX studies, page systems, and layout direction for web experiences.',
    color: '#06b6d4',
    type: 'image',
    files: [
      'Desktop - 15.png', 'Desktop - 3.png', 'Desktop - 4.png',
      'Final (1).png', 'final.png', 'Frame.png',
      'home (1).png', 'home (2).png', 'home.png',
      'Homepage (1).png', 'HOMEPAGE FINAL.png', 'Homepage.png',
      'screencapture-legacyandcocollective-2026-07-05-09_39_55.png', 'WIREFRAME.png',
    ].map(file => `${BASE}/wireframe/${enc(file)}`),
  },
  {
    id: 'animated-ads',
    title: 'Animated Ads',
    desc: 'Motion-led campaigns and short ad loops built for digital placements.',
    color: '#e91e8c',
    type: 'video',
    files: ['5.mp4', '6.mp4', '7.mp4', '8.mp4'].map(file => `${BASE}/animated_ads/${file}`),
  },
  {
    id: 'ads-design',
    title: 'Ads Design',
    desc: 'Static ad compositions for social promos, launches, and evergreen campaigns.',
    color: '#a855f7',
    type: 'image',
    files: [
      '10.png', '11.png', '12.png',
      'hp_asset.jpg', 'hp_asset2.jpg',
      'inuax_asset2.jpg', 'inulax_assest.jpg',
      'lsg_asset.jpg', 'lsg_asset2.jpg',
      'rr_assets.jpg', 'rr_assets2.jpg',
      'uph_asset.jpg', 'uph_asset2.jpg',
    ].map(file => `${BASE}/ads_designs/${file}`),
  },
  {
    id: 'newsletter',
    title: 'Newsletter',
    desc: 'Editorial email layouts and promotional newsletter visual systems.',
    color: '#f59e0b',
    type: 'image',
    files: ['2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', '9.png']
      .map(file => `${BASE}/newsletter/${file}`),
  },
  {
    id: 'reels',
    title: 'Reels',
    desc: 'Vertical edits and social-first storytelling designed for quick engagement.',
    color: '#7c3aed',
    type: 'video',
    files: [
      '10.mp4', '11.mp4',
      'Portfolio (200 x 768 px) (1).mp4',
      'Portfolio (200 x 768 px).mp4',
    ].map(file => `${BASE}/reels/${enc(file)}`),
  },
]

const categories = rawCategories.map(category => ({
  ...category,
  files: category.files ?? category.items.map(item => item.file),
}))

const Icons = {
  'web-projects': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18" />
    </svg>
  ),
  'mobile-projects': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
      <rect x="6" y="2" width="12" height="20" rx="2.5" />
      <path d="M10.5 18h3" />
    </svg>
  ),
  'desktop-projects': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
      <rect x="2" y="4" width="20" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  ),
  wireframes: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4M7 8h4M7 11h6" />
    </svg>
  ),
  'animated-ads': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
      <path d="M15 10l4.553-2.07A1 1 0 0121 8.845v6.31a1 1 0 01-1.447.894L15 14" />
      <rect x="3" y="7" width="12" height="10" rx="2" />
    </svg>
  ),
  'ads-design': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
      <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  ),
  newsletter: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  reels: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none" />
    </svg>
  ),
}

function PaperThumb({ file, color }) {
  if (isVideoFile(file)) {
    return (
      <div className="thumb-video">
        <span className="thumb-video-chip">Clip</span>
        <VideoPoster
          src={file}
          alt=""
          className="thumb-video-poster"
          fallback={<div className="thumb-video-fallback" />}
        />
        <span className="thumb-video-icon" style={{ color }}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </div>
    )
  }

  return <img src={file} alt="" className="thumb-img" loading="lazy" draggable={false} />
}

function FolderPreviewMedia({ category, file }) {
  if (isVideoFile(file)) {
    return (
      <div className="folder-preview-media folder-preview-media--video">
        <VideoPoster
          src={file}
          alt={`${category.title} preview`}
          className="folder-preview-image"
          fallback={<div className="folder-preview-fallback" />}
        />
        <span className="folder-preview-play" style={{ color: category.color }}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </div>
    )
  }

  return (
    <img
      src={file}
      alt={`${category.title} preview`}
      className="folder-preview-image"
      loading="lazy"
      draggable={false}
    />
  )
}

/* Closed: tucked behind the folder, invisible. Open: fanned out above it. */
const REST_PAPERS = [
  { rotation: -6, x: -10, y: -6, opacity: 0, scale: 0.8 },
  { rotation: 0, x: 0, y: -16, opacity: 0, scale: 0.84 },
  { rotation: 6, x: 10, y: -6, opacity: 0, scale: 0.8 },
]

const OPEN_PAPERS = [
  { rotation: -18, x: -58, y: -132, opacity: 1, scale: 0.98 },
  { rotation: 0, x: 0, y: -160, opacity: 1, scale: 1.04 },
  { rotation: 18, x: 58, y: -132, opacity: 1, scale: 0.98 },
]

function FolderCard({ category, index, onOpen }) {
  const wrapperRef = useRef(null)
  const folderRef = useRef(null)
  const papersRef = useRef(null)
  const previewRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [previewIndex, setPreviewIndex] = useState(() => index % category.files.length)

  const setPapers = useCallback((config, duration, ease) => {
    const papers = papersRef.current?.children
    if (!papers?.length) return

    const slotOffset = papers.length === 1 ? 1 : 0

    Array.from(papers).forEach((paper, paperIndex) => {
      const state = config[paperIndex + slotOffset] ?? config[1]
      gsap.to(paper, {
        rotation: state.rotation,
        x: state.x,
        y: state.y,
        opacity: state.opacity,
        scale: state.scale,
        duration,
        delay: paperIndex * 0.04,
        ease,
      })
    })
  }, [])

  useEffect(() => {
    const papers = papersRef.current?.children
    if (papers?.length) {
      const slotOffset = papers.length === 1 ? 1 : 0

      Array.from(papers).forEach((paper, paperIndex) => {
        const state = REST_PAPERS[paperIndex + slotOffset] ?? REST_PAPERS[1]
        gsap.set(paper, {
          rotation: state.rotation,
          x: state.x,
          y: state.y,
          opacity: state.opacity,
          scale: state.scale,
          transformOrigin: '50% 100%',
        })
      })
    }

    gsap.fromTo(
      wrapperRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        ease: 'power3.out',
        delay: index * 0.09,
        scrollTrigger: { trigger: wrapperRef.current, start: 'top 88%' },
      }
    )
  }, [index])

  useEffect(() => {
    if (isHovered || category.files.length <= 1) return undefined

    const interval = window.setInterval(() => {
      setPreviewIndex(current => (current + 1) % category.files.length)
    }, 2400 + index * 180)

    return () => window.clearInterval(interval)
  }, [category.files.length, index, isHovered])

  useEffect(() => {
    if (category.files.length <= 1) return undefined

    if (!previewRef.current) return

    gsap.fromTo(
      previewRef.current,
      { opacity: 0, x: 16, scale: 1.04 },
      { opacity: 1, x: 0, scale: 1, duration: 0.42, ease: 'power2.out' }
    )
  }, [category.files.length, previewIndex])

  /* Hover state drives the animation, so the papers can never be left
     open by a mouseleave that never fires (e.g. the lightbox opening
     over the card, or the card scrolling out from under the cursor). */
  useEffect(() => {
    gsap.to(folderRef.current, {
      y: isHovered ? -6 : 0,
      scale: isHovered ? 1.012 : 1,
      duration: isHovered ? 0.38 : 0.34,
      ease: isHovered ? 'power2.out' : 'power2.inOut',
    })

    if (isHovered) setPapers(OPEN_PAPERS, 0.48, 'power2.out')
    else setPapers(REST_PAPERS, 0.34, 'power2.inOut')
  }, [isHovered, setPapers])

  const handleEnter = () => setIsHovered(true)
  const handleLeave = () => setIsHovered(false)

  const open = () => {
    setIsHovered(false)
    onOpen(category)
  }

  const handleKeyDown = event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      open()
    }
  }

  const previews = useMemo(
    () => getPreviewWindow(category.files, previewIndex, 3),
    [category.files, previewIndex]
  )
  const currentPreview = previews[0]
  const paperSlots = previews.map((_, slotIndex) => slotIndex)
  const unit = category.unit ?? 'curated pieces'
  const countLabel = `${String(category.files.length).padStart(2, '0')} ${category.files.length === 1 ? unit.replace(/s$/, '') : unit}`
  const typeLabel = category.kicker ?? (category.type === 'video' ? 'Motion vault' : 'Design vault')

  return (
    <div
      ref={wrapperRef}
      className="folder-wrapper"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      onClick={open}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Open ${category.title} gallery`}
    >
      <div className="folder-halo" style={{ '--col': category.color }} />

      <div ref={papersRef} className="folder-papers">
        {paperSlots.map(slotIndex => {
          const file = previews[slotIndex]

          return (
          <div
            key={`${category.id}-paper-${slotIndex}`}
            className="folder-paper"
            style={{ '--col': category.color, zIndex: slotIndex === 1 ? 4 : 3 }}
          >
            <div className="folder-paper-frame">
              <PaperThumb file={file} color={category.color} />
            </div>
            <span className="folder-paper-order">{String(slotIndex + 1).padStart(2, '0')}</span>
          </div>
          )
        })}
      </div>

      <div
        ref={folderRef}
        className="folder-3d"
        style={{
          '--col': category.color,
          '--col-dim': `${category.color}22`,
          '--col-mid': `${category.color}66`,
          '--col-strong': `${category.color}aa`,
        }}
      >
        <div className="folder-glow" />
        <div className="folder-sheen" />
        <div className="folder-tab" />
        <div className="folder-tab folder-tab--ghost" />

        <div className="folder-face">
          <div className="folder-topline">
            <span className="folder-kicker">{typeLabel}</span>
            <span className="folder-track" />
          </div>

          <div className="folder-preview-stage">
            <div key={`${category.id}-${previewIndex}`} ref={previewRef} className="folder-preview-asset">
              <FolderPreviewMedia category={category} file={currentPreview} />
            </div>
            <div className="folder-preview-badge">
              {Icons[category.id]}
            </div>
          </div>

          <div className="folder-copy">
            <h3 className="folder-name">{category.title}</h3>
            <p className="folder-desc">{category.desc}</p>
          </div>

          <div className="folder-footer">
            <p className="folder-meta">
              <span className="folder-count">{countLabel}</span>
            </p>
            <span className="folder-cta">Open archive</span>
          </div>
        </div>

        <div className="folder-depth" />
      </div>
    </div>
  )
}

function CtaCard({ index }) {
  const ref = useRef(null)

  useEffect(() => {
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        ease: 'power3.out',
        delay: index * 0.09,
        scrollTrigger: { trigger: ref.current, start: 'top 88%' },
      }
    )
  }, [index])

  return (
    <div ref={ref} className="folder-wrapper folder-wrapper--cta">
      <div className="folder-halo folder-halo--cta" />

      <div
        className="folder-3d folder-3d--cta"
        style={{
          '--col': '#a855f7',
          '--col-dim': '#a855f722',
          '--col-mid': '#a855f766',
          '--col-strong': '#a855f7aa',
        }}
      >
        <div className="folder-glow" />
        <div className="folder-sheen" />
        <div className="folder-tab" />
        <div className="folder-tab folder-tab--ghost" />

        <div className="folder-face folder-face--cta">
          <div className="folder-topline folder-topline--cta">
            <span className="folder-kicker">Available for new work</span>
            <span className="folder-track" />
          </div>

          <div className="cta-rocket">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" />
              <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" />
              <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
            </svg>
          </div>

          <div className="folder-copy folder-copy--cta">
            <h3 className="cta-title">Have a new project?</h3>
            <p className="cta-sub">Let&apos;s turn the next idea into something polished and memorable.</p>
          </div>

          <a href="#contact" className="folder-cta folder-cta--btn">Start a project</a>
        </div>

        <div className="folder-depth folder-depth--cta" />
      </div>
    </div>
  )
}

export default function Projects() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      }
    )
  }, [])

  return (
    <section id="projects" className="section projects-section" ref={sectionRef}>
      <div className="container">
        <div ref={headerRef} className="section-header">
          <span className="section-label">Portfolio</span>
          <h2 className="section-title">My <span>Work</span></h2>
          <p className="section-subtitle">
            A curated collection of development builds &mdash; web, mobile, and desktop &mdash; alongside visual work across
            wireframes, campaigns, reels, ad creatives, and newsletter design.
          </p>
        </div>

        <div className="folders-grid">
          {categories.map((category, index) => (
            <FolderCard key={category.id} category={category} index={index} onOpen={setLightbox} />
          ))}
          <CtaCard index={categories.length} />
        </div>
      </div>

      {lightbox && (
        <Lightbox project={lightbox} onClose={() => setLightbox(null)} />
      )}
    </section>
  )
}
