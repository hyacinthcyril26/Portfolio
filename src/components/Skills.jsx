import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  SiReact, SiLaravel, SiQuasar, SiWordpress, SiShopify, SiWix,
  SiFigma, SiFlutter, SiKotlin, SiPython, SiPhp,
  SiGithub, SiMysql, SiTailwindcss, SiJavascript
} from 'react-icons/si'
import { FiZap, FiCode } from 'react-icons/fi'
import './Skills.css'

gsap.registerPlugin(ScrollTrigger)

const categories = [
  {
    label: 'Web Development',
    color: '#e91e8c',
    skills: [
      { name: 'React.js',      icon: <SiReact /> },
      { name: 'Laravel / PHP', icon: <SiLaravel /> },
      { name: 'Quasar.js',     icon: <SiQuasar /> },
      { name: 'JavaScript',    icon: <SiJavascript /> },
      { name: 'Tailwind CSS',  icon: <SiTailwindcss /> },
      { name: 'MySQL',         icon: <SiMysql /> },
    ],
  },
  {
    label: 'No-Code & CMS',
    color: '#a855f7',
    skills: [
      { name: 'GoHighLevel', icon: <FiZap /> },
      { name: 'WordPress',   icon: <SiWordpress /> },
      { name: 'Shopify',     icon: <SiShopify /> },
      { name: 'Wix',         icon: <SiWix /> },
      { name: 'Figma',       icon: <SiFigma /> },
      { name: 'GitHub',      icon: <SiGithub /> },
    ],
  },
  {
    label: 'Mobile & App Dev',
    color: '#06b6d4',
    skills: [
      { name: 'Flutter', icon: <SiFlutter /> },
      { name: 'Kotlin',  icon: <SiKotlin /> },
      { name: 'Java',    icon: <FiCode /> },
      { name: 'Python',  icon: <SiPython /> },
      { name: 'PHP',     icon: <SiPhp /> },
      { name: 'VB.NET',  icon: <FiZap /> },
    ],
  },
]

export default function Skills() {
  const sectionRef = useRef(null)
  const headerRef  = useRef(null)
  const cardsRef   = useRef([])

  useEffect(() => {
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      }
    )

    cardsRef.current.forEach((card, i) => {
      if (!card) return

      gsap.fromTo(
        card,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
          delay: i * 0.12,
          scrollTrigger: { trigger: card, start: 'top 85%' },
        }
      )

      const badges = card.querySelectorAll('.skill-badge')
      gsap.fromTo(
        badges,
        { opacity: 0, x: -14 },
        {
          opacity: 1, x: 0, duration: 0.45, ease: 'power2.out',
          stagger: 0.07,
          delay: i * 0.12 + 0.25,
          scrollTrigger: { trigger: card, start: 'top 85%' },
        }
      )
    })
  }, [])

  return (
    <section id="skills" className="section skills-section" ref={sectionRef}>
      <div className="container">
        <div ref={headerRef} className="section-header">
          <span className="section-label">My Expertise</span>
          <h2 className="section-title">Skills & <span>Technologies</span></h2>
          <p className="section-subtitle">
            A versatile tech stack built through years of real-world project experience across web, mobile, and no-code platforms.
          </p>
        </div>

        <div className="skills-categories">
          {categories.map((cat, i) => (
            <div
              key={i}
              ref={el => cardsRef.current[i] = el}
              className="skill-cat-card glass-card"
              style={{ '--cat-color': cat.color }}
            >
              {/* Card header */}
              <div className="skill-cat-header">
                <span className="skill-cat-dot" />
                <h3 className="skill-cat-label">{cat.label}</h3>
              </div>

              {/* Skill badges */}
              <div className="skill-badges">
                {cat.skills.map((skill, j) => (
                  <div key={j} className="skill-badge">
                    <span className="skill-badge-icon">{skill.icon}</span>
                    <span className="skill-badge-name">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
