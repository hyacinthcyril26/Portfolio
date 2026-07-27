import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiSmartphone, FiLayout, FiGlobe, FiPenTool } from 'react-icons/fi'
import './About.css'

gsap.registerPlugin(ScrollTrigger)

const highlights = [
  {
    icon: <FiGlobe />,
    title: 'Web Development',
    desc: 'Laravel, React.js, Quasar.js, WordPress, Shopify, Wix & GHL',
  },
  {
    icon: <FiPenTool />,
    title: 'Web Design',
    desc: 'Landing pages, ad creatives, newsletters & social campaigns',
  },
  {
    icon: <FiSmartphone />,
    title: 'Desktop & Mobile Development',
    desc: 'Flutter, Kotlin & Java for Android; VB.NET, Python & Java for desktop',
  },
  {
    icon: <FiLayout />,
    title: 'UI/UX & No-Code',
    desc: 'Figma wireframes, GHL funnels, Shopify stores & Wix sites',
  },
]

export default function About() {
  const sectionRef = useRef(null)
  const leftRef = useRef(null)
  const rightRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(leftRef.current,
        { opacity: 0, x: -60 },
        {
          opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
        }
      )
      gsap.fromTo(rightRef.current,
        { opacity: 0, x: 60 },
        {
          opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
        }
      )
      cardsRef.current.forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: i * 0.12,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' }
          }
        )
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" className="section about-section" ref={sectionRef}>
      <div className="container">
        <div className="about-grid">
          {/* Left - Image & stats */}
          <div ref={leftRef} className="about-left">
            <div className="about-img-wrap">
              <div className="about-img-bg" />
              <img src={`${import.meta.env.BASE_URL}logo.jpg`} alt="Hyacinth Cyril Enog" className="about-img" />
              <div className="about-experience-tag">
                <span className="exp-years">3+</span>
                <span className="exp-label">Years of<br/>Experience</span>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div ref={rightRef} className="about-right">
            <span className="section-label">About Me</span>
            <h2 className="section-title">
              Crafting Digital<br />
              <span>Experiences</span>
            </h2>
            <p className="about-para">
              I'm <strong>Hyacinth Cyril Enog</strong>, a <strong>web designer and developer</strong> passionate
              about building beautiful, functional digital solutions. With over 3 years of hands-on experience,
              I specialize in web and mobile development, bridging design and functionality.
            </p>
            <p className="about-para">
              From designing interfaces in <strong>Figma</strong> and <strong>Canva</strong> to developing websites
              with <strong>React.js</strong> and <strong>Laravel</strong> and cross-platform mobile apps with
              <strong> Flutter</strong>, I bring ideas to life through clean, efficient code. I also excel in
              no-code platforms like <strong>GoHighLevel</strong>, <strong>Shopify</strong>, <strong>Wix</strong>,
              and <strong>WordPress</strong>.
            </p>

            {/* Cards grid */}
            <div className="about-cards">
              {highlights.map((item, i) => (
                <div
                  key={i}
                  ref={el => cardsRef.current[i] = el}
                  className="about-card glass-card"
                >
                  <div className="card-icon">{item.icon}</div>
                  <div>
                    <h4 className="card-title">{item.title}</h4>
                    <p className="card-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
