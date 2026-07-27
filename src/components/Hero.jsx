import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { FiArrowDown, FiDownload, FiGithub, FiLinkedin } from 'react-icons/fi'
import './Hero.css'

const roles = ['Web Developer', 'Web Designer', 'Mobile Developer', 'UI/UX Designer', 'Full-Stack Developer']
const publicUrl = path => `${import.meta.env.BASE_URL}${path}`

export default function Hero() {
  const heroRef    = useRef(null)
  const greetRef   = useRef(null)
  const nameRef    = useRef(null)
  const roleRef    = useRef(null)
  const descRef    = useRef(null)
  const btnsRef    = useRef(null)
  const imgRef     = useRef(null)
  const socialsRef = useRef(null)
  const roleText   = useRef(null)
  const roleIndex  = useRef(0)

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.fromTo(greetRef.current,   { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 })
      .fromTo(nameRef.current,    { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.4')
      .fromTo(roleRef.current,    { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
      .fromTo(descRef.current,    { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.3')
      .fromTo(btnsRef.current,    { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.3')
      .fromTo(socialsRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.7 }, '-=0.5')
      .fromTo(imgRef.current,     { opacity: 0, y: 30, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power2.out' }, '-=0.8')

    gsap.to(imgRef.current, {
      y: -14, duration: 3.5, ease: 'sine.inOut', yoyo: true, repeat: -1,
    })

    const rotateRole = () => {
      roleIndex.current = (roleIndex.current + 1) % roles.length
      gsap.to(roleText.current, {
        opacity: 0, y: -12, duration: 0.35,
        onComplete: () => {
          if (roleText.current) roleText.current.textContent = roles[roleIndex.current]
          gsap.to(roleText.current, { opacity: 1, y: 0, duration: 0.35 })
        },
      })
    }
    const interval = setInterval(rotateRole, 2800)
    return () => clearInterval(interval)
  }, [])

  const scrollDown = () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section className="hero-section" ref={heroRef}>
      <div className="hero-orb orb-1" />
      <div className="hero-orb orb-2" />

      <div className="container">
        <div className="hero-grid">

          {/* ---- Left: Text ---- */}
          <div className="hero-content">
            <div ref={socialsRef} className="hero-socials">
              <a href="https://github.com/hyacinthcyril26" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="GitHub"><FiGithub /></a>
              <a href="https://www.linkedin.com/in/hyacinth-enog-a99319425/" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn"><FiLinkedin /></a>
              <div className="social-line" />
            </div>

            <div className="hero-text">
              <p ref={greetRef} className="hero-greeting">Hello, I&apos;m</p>
              <h1 ref={nameRef} className="hero-name">
                Hyacinth Cyril<br />
                <span className="name-accent">Enog</span>
              </h1>
              <div ref={roleRef} className="hero-role">
                <span className="role-prefix">/</span>
                <span ref={roleText} className="role-text">{roles[0]}</span>
              </div>
              <p ref={descRef} className="hero-desc">
                Passionate Web Designer and Developer crafting visually engaging, responsive, and seamless digital experiences across web and mobile platforms. Specialized in Laravel, React.js, Flutter, UI/UX design, and no-code solutions.
              </p>
              <div ref={btnsRef} className="hero-buttons">
                <button className="btn-primary" onClick={scrollDown}>
                  <span>View My Work</span>
                  <FiArrowDown />
                </button>
                <a href={publicUrl('resume.pdf')} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  <FiDownload />
                  Download CV
                </a>
              </div>
            </div>
          </div>

          {/* ---- Right: Profile ---- */}
          <div ref={imgRef} className="hero-image-wrap">
            {/* Neon glow orb behind profile */}
            <div className="hero-profile-glow" />

            <div className="hero-portrait-outer">
              {/* Corner bracket accents */}
              <span className="hc hc-tl" />
              <span className="hc hc-tr" />
              <span className="hc hc-bl" />
              <span className="hc hc-br" />

              {/* Framed studio portrait */}
              <div className="hero-portrait">
                <img
                  src={publicUrl('hero-portrait.webp')}
                  alt="Hyacinth Cyril Enog"
                  className="hero-profile-img"
                  draggable={false}
                />
                <span className="portrait-grade" />
                <span className="portrait-fade" />
              </div>
            </div>

            {/* Floating stat badges */}
            <div className="hero-badge badge-1">
              <span className="badge-num">3+</span>
              <span className="badge-label">Years Exp.</span>
            </div>
            <div className="hero-badge badge-2">
              <span className="badge-num">15+</span>
              <span className="badge-label">Projects</span>
            </div>
            <div className="hero-badge badge-3">
              <span className="badge-num">10+</span>
              <span className="badge-label">Tech Stack</span>
            </div>
          </div>

        </div>

        <button className="scroll-indicator" onClick={scrollDown} aria-label="Scroll down">
          <div className="scroll-mouse"><div className="scroll-dot" /></div>
          <span>Scroll Down</span>
        </button>
      </div>
    </section>
  )
}
