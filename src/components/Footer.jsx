import { useEffect, useState } from 'react'
import { FiGithub, FiLinkedin, FiArrowUp } from 'react-icons/fi'
import './Footer.css'

export default function Footer() {
  const [showTop, setShowTop] = useState(false)

  /* Only offer "back to top" once there's something to scroll back from. */
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ]

  const scrollTo = (e, href) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-glow" />
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <img src={`${import.meta.env.BASE_URL}logo.jpg`} alt="Logo" className="footer-logo-img" />
                <span className="footer-logo-text">HYA</span>
              </div>
              <p className="footer-tagline">
                Building digital experiences that blend creativity, performance, and purpose.
              </p>
              <div className="footer-socials">
                <a href="https://github.com/hyacinthcyril26" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <FiGithub />
                </a>
                <a href="https://www.linkedin.com/in/hyacinth-enog-a99319425/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <FiLinkedin />
                </a>
              </div>
            </div>

            <div className="footer-links-col">
              <h4 className="footer-col-title">Navigation</h4>
              <ul>
                {navLinks.map(link => (
                  <li key={link.label}>
                    <a href={link.href} onClick={e => scrollTo(e, link.href)}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-links-col">
              <h4 className="footer-col-title">Services</h4>
              <ul>
                <li><a href="#projects">Web Development</a></li>
                <li><a href="#projects">Web Design</a></li>
                <li><a href="#projects">Mobile Apps</a></li>
                <li><a href="#projects">UI/UX Design</a></li>
                <li><a href="#projects">No-Code Solutions</a></li>
              </ul>
            </div>

            <div className="footer-links-col">
              <h4 className="footer-col-title">Technologies</h4>
              <ul>
                <li><span>Figma / Canva</span></li>
                <li><span>React.js / Quasar.js</span></li>
                <li><span>Laravel / PHP</span></li>
                <li><span>Flutter / Kotlin</span></li>
                <li><span>GHL / Shopify / Wix</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-inner">
            <p>
              &copy; {new Date().getFullYear()} Hyacinth Cyril Enog.
            </p>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="footer-resume-link">
              View Resume
            </a>
          </div>
        </div>
      </div>

      <button
        className={`scroll-top-btn${showTop ? ' scroll-top-btn--visible' : ''}`}
        onClick={scrollTop}
        aria-label="Back to top"
        aria-hidden={!showTop}
        tabIndex={showTop ? 0 : -1}
      >
        <FiArrowUp />
      </button>
    </footer>
  )
}
