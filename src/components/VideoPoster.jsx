import { useEffect, useState } from 'react'

const posterCache = new Map()
const pendingPosterCache = new Map()

function getTargetTime(duration) {
  if (!Number.isFinite(duration) || duration <= 0) return 0.15
  if (duration <= 0.4) return Math.max(0.05, duration / 3)
  return Math.min(duration * 0.2, duration - 0.1)
}

function loadVideoPoster(src) {
  if (posterCache.has(src)) {
    return Promise.resolve(posterCache.get(src))
  }

  if (pendingPosterCache.has(src)) {
    return pendingPosterCache.get(src)
  }

  const promise = new Promise(resolve => {
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    let settled = false

    const cleanup = () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('seeked', handleSeeked)
      video.removeEventListener('error', handleError)
      video.pause()
      video.removeAttribute('src')
      video.load()
      pendingPosterCache.delete(src)
    }

    const finish = value => {
      if (settled) return
      settled = true

      if (value) {
        posterCache.set(src, value)
      }

      cleanup()
      resolve(value)
    }

    const handleLoadedMetadata = () => {
      try {
        video.currentTime = getTargetTime(video.duration)
      } catch {
        finish(null)
      }
    }

    const handleSeeked = () => {
      try {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        const context = canvas.getContext('2d')
        if (!context) {
          finish(null)
          return
        }

        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        finish(canvas.toDataURL('image/jpeg', 0.82))
      } catch {
        finish(null)
      }
    }

    const handleError = () => finish(null)

    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true
    video.crossOrigin = 'anonymous'

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('seeked', handleSeeked)
    video.addEventListener('error', handleError)

    video.src = src
  })

  pendingPosterCache.set(src, promise)
  return promise
}

export default function VideoPoster({ src, alt, className, fallback = null }) {
  const [poster, setPoster] = useState(() => posterCache.get(src) ?? null)

  useEffect(() => {
    let cancelled = false

    if (posterCache.has(src)) {
      setPoster(posterCache.get(src))
      return () => {
        cancelled = true
      }
    }

    setPoster(null)

    loadVideoPoster(src).then(result => {
      if (!cancelled) {
        setPoster(result)
      }
    })

    return () => {
      cancelled = true
    }
  }, [src])

  if (poster) {
    return <img src={poster} alt={alt} className={className} loading="lazy" draggable={false} />
  }

  return fallback
}
