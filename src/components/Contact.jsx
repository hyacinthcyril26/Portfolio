import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiMail, FiMapPin, FiSend } from 'react-icons/fi'
import './Contact.css'

gsap.registerPlugin(ScrollTrigger)

/* Web3Forms — set VITE_WEB3FORMS_KEY in .env (see .env.example).
   The access key is a public client-side token by design; it only lets
   the form post to your own inbox. */
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY ?? ''
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'

/* Stricter than type="email" (which accepts things like "a@b"):
   requires a real domain label and a 2+ letter TLD. */
const EMAIL_RE = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i

/* Common provider typos → suggestion shown under the field */
const DOMAIN_TYPOS = {
  'gmail.con': 'gmail.com', 'gmail.co': 'gmail.com', 'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com', 'gnail.com': 'gmail.com', 'gmail.cm': 'gmail.com',
  'yahoo.con': 'yahoo.com', 'yaho.com': 'yahoo.com', 'yahooo.com': 'yahoo.com',
  'hotmial.com': 'hotmail.com', 'hotmail.con': 'hotmail.com',
  'outlok.com': 'outlook.com', 'outlook.con': 'outlook.com',
  'icloud.con': 'icloud.com',
}

function validateEmail(value) {
  const email = value.trim()
  if (!email) return 'Email is required.'
  if (!EMAIL_RE.test(email)) return 'Enter a valid email address (e.g. name@gmail.com).'

  const domain = email.split('@')[1].toLowerCase()
  const fix = DOMAIN_TYPOS[domain]
  if (fix) return `Did you mean ${email.split('@')[0]}@${fix}?`

  return ''
}

export default function Contact() {
  const sectionRef = useRef(null)
  const leftRef = useRef(null)
  const formRef = useRef(null)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const [sendError, setSendError] = useState('')
  const botcheckRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(leftRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
        }
      )
      gsap.fromTo(formRef.current,
        { opacity: 0, x: 50 },
        {
          opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    /* Only re-validate live once the field has been blurred, so the
       error doesn't flash while the address is still being typed. */
    if (name === 'email' && emailTouched) setEmailError(validateEmail(value))
  }

  const handleEmailBlur = e => {
    setEmailTouched(true)
    setEmailError(validateEmail(e.target.value))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const err = validateEmail(form.email)
    if (err) {
      setEmailTouched(true)
      setEmailError(err)
      e.target.email?.focus()
      return
    }

    /* Honeypot: only a bot fills a field humans can't see. */
    if (botcheckRef.current?.checked) return

    if (!WEB3FORMS_KEY) {
      setSendError('The form isn’t configured yet. Set VITE_WEB3FORMS_KEY in your .env file.')
      return
    }

    setSendError('')
    setSending(true)

    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
          from_name: 'Portfolio Contact Form',
          replyto: form.email.trim(),
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'The message could not be sent.')
      }

      setSent(true)
      setForm({ name: '', email: '', subject: '', message: '' })
      setEmailError('')
      setEmailTouched(false)
      setTimeout(() => setSent(false), 5000)
    } catch (error) {
      setSendError(
        error instanceof TypeError
          ? 'Network error — check your connection and try again.'
          : error.message || 'Something went wrong. Please try again.'
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contact" className="section contact-section" ref={sectionRef}>
      <div className="contact-orb" />
      <div className="container">
        <div className="contact-grid">
          {/* Left */}
          <div ref={leftRef} className="contact-left">
            <span className="section-label">Get In Touch</span>
            <h2 className="section-title">
              Are You Ready<br /><span>to Work With Me?</span>
            </h2>
            <p className="contact-desc">
              Have a project in mind, want to collaborate, or just want to say hello?
              I'm always open to discussing new opportunities and creative ideas.
            </p>

            <div className="contact-info-list">
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <FiMail />
                </div>
                <div>
                  <p className="info-label">Email</p>
                  <a href="mailto:hyacinthenog60@gmail.com" className="info-value">
                    hyacinthenog60@gmail.com
                  </a>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <FiMapPin />
                </div>
                <div>
                  <p className="info-label">Location</p>
                  <p className="info-value">Philippines</p>
                </div>
              </div>
            </div>

          </div>

          {/* Form */}
          <div ref={formRef} className="contact-form-wrap glass-card">
            {sent ? (
              <div className="form-success">
                <div className="success-icon">&#10003;</div>
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out. I'll get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <h3 className="form-title">Send a Message</h3>

                {/* Honeypot — hidden from people, tempting to bots */}
                <input
                  ref={botcheckRef}
                  type="checkbox"
                  name="botcheck"
                  className="form-botcheck"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={handleEmailBlur}
                      className={emailError ? 'input-invalid' : ''}
                      placeholder="Enter your email address"
                      autoComplete="email"
                      inputMode="email"
                      spellCheck={false}
                      aria-invalid={emailError ? 'true' : 'false'}
                      aria-describedby={emailError ? 'email-error' : undefined}
                      required
                    />
                    {emailError && (
                      <p id="email-error" className="form-error" role="alert">{emailError}</p>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Project inquiry..."
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project..."
                    rows={5}
                    required
                  />
                </div>
                {sendError && (
                  <p className="form-send-error" role="alert">{sendError}</p>
                )}

                <button type="submit" className="form-submit btn-primary" disabled={sending}>
                  <span>{sending ? 'Sending...' : 'Send Message'}</span>
                  <FiSend />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
