"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"

// Page for love

interface Bubble {
  id: number
  x: number
  y: number
  size: number
  duration: number
}

interface FloatingSeal {
  id: number
  x: number
  y: number
  image: string
  duration: number
  delay: number
  visible: boolean
}

interface FloatingText {
  id: number
  x: number
  y: number
  text: string
  duration: number
  size: number
}

interface Track {
  title: string
  artist: string
  icon: string
  audioSrc?: string
  bgColor?: string
  specialEffect?: "cigarettes"
}

const sealImages = [
  "/images/foca-pepsi.jpg",
  "/images/foca-rosas.jpg",
  "/images/foca-pera.jpg",
  "/images/foca-guitarra.jpg",
]

export default function LovePage() {
  const [stage, setStage] = useState<"seal" | "question" | "content">("seal")
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [floatingSeals, setFloatingSeals] = useState<FloatingSeal[]>([])
  const [showSecret, setShowSecret] = useState(false)
  const [activeTrack, setActiveTrack] = useState<number | null>(null)
  const [hoveredTrack, setHoveredTrack] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [submerged, setSubmerged] = useState(false)
  const [bgColor, setBgColor] = useState<string | null>(null)
  const [cigarettesEffect, setCigarettesEffect] = useState(false)
  const [sealClicked, setSealClicked] = useState(false)
  const [poppingSeals, setPoppingSeals] = useState<number[]>([])
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  
  const loveTexts = ["te amo", "mi amor", "eres hermosa", "mi cielo", "te quiero", "mi vida", "siempre juntos", "eres todo"]

  const tracks: Track[] = [
    { title: "Self Aware", artist: "Temper City", icon: "🦭", audioSrc: "/audio/self-aware.mp3", bgColor: "#1a3a4a" },
    { title: "You Get Me So High", artist: "The Neighbourhood", icon: "🎸", audioSrc: "/audio/you-get-me-so-high.mp3", bgColor: "#2d1b4e" },
    { title: "I Thought I Saw Your Face Today", artist: "She & Him", icon: "💫", audioSrc: "/audio/i-thought-i-saw-your-face.mp3", bgColor: "#4a3728" },
    { title: "Babydoll", artist: "Dominic Fike", icon: "🐠", audioSrc: "/audio/babydoll.mp3", bgColor: "#1e3a2f" },
    { title: "I Don't Know You Anymore", artist: "sombr", icon: "🌙", audioSrc: "/audio/i-dont-know-you-anymore.mp3", bgColor: "#0d1a2d" },
    { title: "Cigarettes Out The Window", artist: "TV Girl", icon: "🚬", audioSrc: "/audio/cigarettes-out-the-window.mp3", specialEffect: "cigarettes" },
    { title: "Dardos", artist: "Romeo Santos, Prince Royce", icon: "🏹", bgColor: "#3d1a1a" },
    { title: "Pensamientos", artist: "Airbag", icon: "💭", bgColor: "#1a2d3d" },
    { title: "Out of My League", artist: "Fitz and The Tantrums", icon: "💗", bgColor: "#3d1a2d" },
  ]
  
  const secretTrack = { title: "Join Me In Death", artist: "HIM", audioSrc: "/audio/join-me-in-death.mp3" }
  
  const playAudioAtTime = (src: string, startTime: number = 0) => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    const audio = new Audio(src)
    audioRef.current = audio
    audio.currentTime = startTime
    audio.play()
    setIsPlaying(true)
    audio.onended = () => setIsPlaying(false)
  }
  
  const playSecretTrack = useCallback(() => {
    playAudioAtTime(secretTrack.audioSrc)
    setActiveTrack(null)
  }, [secretTrack.audioSrc])

  const playTrack = (index: number) => {
    const track = tracks[index]
    if (!track.audioSrc) return
    
    if (activeTrack === index && isPlaying) {
      if (audioRef.current) audioRef.current.pause()
      setIsPlaying(false)
      return
    }
    
    playAudioAtTime(track.audioSrc)
    setActiveTrack(index)
    
    if (track.specialEffect === "cigarettes") {
      setCigarettesEffect(true)
    } else {
      setCigarettesEffect(false)
    }
  }

  const handleTrackHover = (index: number | null) => {
    setHoveredTrack(index)
    if (index !== null && tracks[index]) {
      const track = tracks[index]
      if (track.specialEffect === "cigarettes") {
        setBgColor(null)
      } else if (track.bgColor) {
        setBgColor(track.bgColor)
      }
    } else {
      setBgColor(null)
    }
  }

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  // Generate floating seals
  useEffect(() => {
    if (stage === "content") {
      const generateSeal = () => {
        const id = Date.now() + Math.random()
        const newSeal: FloatingSeal = {
          id,
          x: Math.random() * 70 + 15,
          y: Math.random() * 60 + 20,
          image: sealImages[Math.floor(Math.random() * sealImages.length)],
          duration: 10000,
          delay: 0,
          visible: true,
        }
        setFloatingSeals(prev => {
          // Keep max 3 seals at a time
          const filtered = prev.length >= 3 ? prev.slice(1) : prev
          return [...filtered, newSeal]
        })
      }
      
      generateSeal()
      const interval = setInterval(generateSeal, 5000)
      return () => clearInterval(interval)
    }
  }, [stage])
  
  // Generate floating love texts - slow and calm like bubbles
  useEffect(() => {
    if (stage === "content") {
      const generateText = () => {
        const newText: FloatingText = {
          id: Date.now() + Math.random(),
          x: Math.random() * 80 + 10,
          y: 85 + Math.random() * 10, // Start from bottom
          text: loveTexts[Math.floor(Math.random() * loveTexts.length)],
          duration: 12000, // Much slower - 12 seconds
          size: Math.random() * 10 + 14,
        }
        setFloatingTexts(prev => {
          const filtered = prev.length >= 5 ? prev.slice(1) : prev // Less texts at a time
          return [...filtered, newText]
        })
        setTimeout(() => {
          setFloatingTexts(prev => prev.filter(t => t.id !== newText.id))
        }, newText.duration)
      }
      
      generateText()
      const interval = setInterval(generateText, 4000) // Less frequent - every 4 seconds
      return () => clearInterval(interval)
    }
  }, [stage, loveTexts])

  const generateBubble = useCallback((x: number, y: number, duration: number) => {
    const newBubble: Bubble = {
      id: Date.now() + Math.random(),
      x,
      y,
      size: Math.random() * 20 + 5,
      duration,
    }
    setBubbles((prev) => [...prev, newBubble])
    setTimeout(() => {
      setBubbles((prev) => prev.filter((b) => b.id !== newBubble.id))
    }, duration)
  }, [])

  useEffect(() => {
    if (stage !== "seal") {
      const interval = setInterval(() => {
        generateBubble(Math.random() * window.innerWidth, window.innerHeight + 10, 4000)
      }, 150)
      return () => clearInterval(interval)
    }
  }, [stage, generateBubble])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (Math.random() > 0.8) {
      generateBubble(e.clientX, e.clientY, 1000)
    }
  }

  const handleSealClick = () => {
    setSealClicked(true)
    // Play sombr - I don't know you anymore
    playAudioAtTime("/audio/i-dont-know-you-anymore.mp3")
    setTimeout(() => {
      setStage("question")
      setSealClicked(false)
    }, 600)
  }
  
  const handleSealPop = (sealId: number) => {
    setPoppingSeals(prev => [...prev, sealId])
    setTimeout(() => {
      setFloatingSeals(prev => prev.filter(s => s.id !== sealId))
      setPoppingSeals(prev => prev.filter(id => id !== sealId))
    }, 500)
  }

  const handleSubmerge = () => {
    // Stop current audio and play Self Aware at 0:47
    if (audioRef.current) audioRef.current.pause()
    playAudioAtTime("/audio/self-aware.mp3", 47)
    setSubmerged(true)
    setTimeout(() => {
      setStage("content")
      setActiveTrack(0) // Self Aware is track 0
    }, 1000)
  }

  return (
    <div className="relative h-screen w-full overflow-hidden font-sans" onMouseMove={handleMouseMove}>
      {/* Ocean Background with dynamic color */}
      <div
        className={`fixed inset-0 -z-20 transition-all duration-1000 ${
          submerged ? "" : "bg-abyss"
        } ${cigarettesEffect ? "bg-black" : ""}`}
        style={{
          background: cigarettesEffect 
            ? undefined
            : bgColor 
              ? bgColor 
              : submerged 
                ? "var(--ocean-blue)" 
                : undefined
        }}
      >
        <div
          className={`absolute inset-0 transition-opacity duration-[3000ms] ${
            submerged && !cigarettesEffect ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: "radial-gradient(circle at 50% 20%, rgba(0, 180, 216, 0.4) 0%, transparent 70%)",
          }}
        />
      </div>
      
      {/* Cigarettes Special Effect - Full screen blue to pink */}
      {cigarettesEffect && (
        <div className="fixed inset-0 -z-10 overflow-hidden">
          {/* Main animated gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 animate-gradient-shift" />
          
          {/* Overlay glow effects */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/40 via-transparent to-transparent animate-pulse" />
            <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-pink-500/40 via-transparent to-transparent animate-pulse" style={{ animationDelay: "1s" }} />
          </div>
          
          {/* Moving light beams */}
          <div className="absolute top-0 left-[20%] w-1 h-full bg-gradient-to-b from-cyan-400/30 via-cyan-400/10 to-transparent animate-beam-1" />
          <div className="absolute top-0 right-[30%] w-1 h-full bg-gradient-to-b from-pink-400/30 via-pink-400/10 to-transparent animate-beam-2" />
          <div className="absolute top-0 left-[60%] w-1 h-full bg-gradient-to-b from-purple-400/20 via-purple-400/10 to-transparent animate-beam-3" />
          
          {/* Floating smoke particles */}
          <div className="absolute bottom-[10%] left-[5%] w-4 h-4 rounded-full bg-white/15 animate-smoke-1" />
          <div className="absolute bottom-[20%] left-[20%] w-6 h-6 rounded-full bg-cyan-300/10 animate-smoke-2" />
          <div className="absolute bottom-[5%] left-[40%] w-3 h-3 rounded-full bg-white/20 animate-smoke-3" />
          <div className="absolute bottom-[15%] right-[15%] w-5 h-5 rounded-full bg-pink-300/10 animate-smoke-1" style={{ animationDelay: "1s" }} />
          <div className="absolute bottom-[25%] right-[30%] w-4 h-4 rounded-full bg-white/15 animate-smoke-2" style={{ animationDelay: "0.5s" }} />
          <div className="absolute bottom-[8%] right-[5%] w-6 h-6 rounded-full bg-purple-300/10 animate-smoke-3" style={{ animationDelay: "1.5s" }} />
          
          {/* Text overlays */}
          <div className="absolute top-[15%] left-[10%] text-6xl font-black text-white/5 animate-float-1">CIGARETTES</div>
          <div className="absolute bottom-[20%] right-[5%] text-4xl font-black text-white/5 animate-float-2">OUT THE WINDOW</div>
        </div>
      )}

      {/* Underwater creatures */}
      {stage === "content" && (
        <>
          <div className="absolute left-[5%] top-[20%] text-4xl animate-float-1 opacity-60">🐟</div>
          <div className="absolute right-[10%] top-[30%] text-3xl animate-float-2 opacity-50">🐠</div>
          <div className="absolute left-[15%] bottom-[25%] text-5xl animate-float-3 opacity-40">🐙</div>
          <div className="absolute right-[8%] bottom-[35%] text-4xl animate-float-1 opacity-50">🦑</div>
          <div className="absolute left-[80%] top-[15%] text-3xl animate-float-2 opacity-60">🐡</div>
          <div className="absolute left-[3%] top-[50%] text-6xl animate-float-3 opacity-30">🪸</div>
          <div className="absolute right-[3%] bottom-[10%] text-5xl animate-float-1 opacity-40">🌿</div>
        </>
      )}
      
      {/* Floating Love Texts */}
      {floatingTexts.map(textItem => (
        <div
          key={textItem.id}
          className="absolute z-10 pointer-events-none animate-love-text text-white/20 font-bold italic"
          style={{
            left: `${textItem.x}%`,
            top: `${textItem.y}%`,
            fontSize: `${textItem.size}px`,
            animationDuration: `${textItem.duration}ms`,
          }}
        >
          {textItem.text}
        </div>
      ))}

      {/* Floating Seal Images */}
      {floatingSeals.map(seal => (
        <div
          key={seal.id}
          className={`absolute z-20 cursor-pointer transition-all ${
            poppingSeals.includes(seal.id) 
              ? "animate-seal-pop" 
              : "animate-seal-float hover:scale-110"
          }`}
          style={{
            left: `${seal.x}%`,
            top: `${seal.y}%`,
            animationDuration: poppingSeals.includes(seal.id) ? "500ms" : `${seal.duration}ms`,
            animationDelay: poppingSeals.includes(seal.id) ? "0ms" : `${seal.delay}ms`,
          }}
          onClick={() => handleSealPop(seal.id)}
        >
          <Image
            src={seal.image}
            alt="Foquita"
            width={100}
            height={100}
            className="rounded-full object-cover shadow-lg"
          />
          {/* Bubble particles when popping */}
          {poppingSeals.includes(seal.id) && (
            <div className="absolute inset-0 flex items-center justify-center">
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-3 h-3 rounded-full bg-white/60 animate-bubble-burst"
                  style={{
                    animationDelay: `${i * 50}ms`,
                    transform: `rotate(${i * 45}deg) translateY(-30px)`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Bubbles */}
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="pointer-events-none absolute rounded-full bg-white/30 animate-bubble"
          style={{
            left: bubble.x,
            top: bubble.y,
            width: bubble.size,
            height: bubble.size,
            animationDuration: `${bubble.duration}ms`,
          }}
        />
      ))}

      {/* Stage 1: Seal Intro */}
      {stage === "seal" && (
        <div
          className="fixed inset-0 z-[10000] flex cursor-pointer flex-col items-center justify-center bg-black"
          onClick={handleSealClick}
        >
          <div className={`text-9xl drop-shadow-[0_0_30px_var(--ocean-blue)] transition-all duration-300 ${
            sealClicked 
              ? "scale-150 rotate-12 animate-seal-pulse" 
              : "animate-float-seal hover:scale-110"
          }`}>
            🦭
          </div>
          <p className={`mt-5 font-bold tracking-[3px] text-ocean-blue transition-opacity ${sealClicked ? "opacity-0" : ""}`}>
            CLICK A LA FOQUITA
          </p>
        </div>
      )}

      {/* Stage 2: Question */}
      {stage === "question" && (
        <div
          className={`fixed inset-0 z-[5000] flex flex-col items-center justify-center text-center transition-opacity duration-1000 ${
            submerged ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <h1 className="mb-12 animate-fade-in-up text-4xl font-black md:text-5xl lg:text-6xl drop-shadow-[0_0_20px_rgba(0,180,216,0.8)]">
            ¿Quieres salir de la obscuridad y sumergirte conmigo?
          </h1>
          <button
            onClick={handleSubmerge}
            className="rounded-full border-[3px] border-white bg-white/5 px-16 py-5 text-2xl font-bold text-white transition-all duration-500 hover:scale-110 hover:bg-white hover:text-abyss hover:shadow-[0_0_30px_white]"
          >
            SUMERGIRSE
          </button>
        </div>
      )}

      {/* Stage 3: Main Content */}
      {stage === "content" && (
        <div className="relative h-screen w-full animate-fade-in">
          {/* Secret Button */}
          <button
            onClick={() => setShowSecret(true)}
            className="absolute right-6 top-6 z-[100] text-4xl text-sky-100 drop-shadow-[0_0_10px_var(--ocean-blue)] transition-transform hover:scale-110"
          >
            ?
          </button>

          {/* Spotify Style Player */}
          <div className="absolute left-1/2 top-1/2 z-50 w-[95%] max-w-[420px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl bg-gradient-to-b from-[#282828] to-[#121212] shadow-2xl max-h-[90vh]">
            {/* Header */}
            <div className="bg-gradient-to-b from-ocean-blue/40 to-transparent p-5 pb-8">
              <div className="flex items-end gap-4">
                <div className="h-24 w-24 rounded shadow-lg bg-gradient-to-br from-ocean-blue to-sky-300 flex items-center justify-center text-5xl">
                  🦭
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-white/60">Playlist</p>
                  <h2 className="text-2xl font-extrabold text-white">Para mi Cielo</h2>
                  <p className="text-xs text-white/60 mt-2 max-w-[200px] italic">&quot;Me demore mucho mi nina hermosa pero te amo, esta playlist es para ti, te adoro muchisimo.&quot;</p>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 px-5 py-3">
              <button 
                onClick={() => activeTrack !== null && playTrack(activeTrack)}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1ed760] text-black transition-transform hover:scale-105"
              >
                {isPlaying ? (
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              <span className="text-sm text-white/50">{tracks.filter(t => t.audioSrc).length} canciones disponibles</span>
            </div>

            {/* Track List */}
            <div className="px-2 pb-4 overflow-y-auto max-h-[45vh]">
              {/* Header Row */}
              <div className="grid grid-cols-[16px_1fr_auto] gap-4 px-4 py-2 text-xs font-medium uppercase tracking-wider text-white/50 border-b border-white/10 mb-2">
                <span>#</span>
                <span>Titulo</span>
                <span></span>
              </div>
              
              {tracks.map((track, index) => (
                <SpotifyTrackRow
                  key={index}
                  index={index}
                  track={track}
                  isActive={activeTrack === index}
                  isPlaying={activeTrack === index && isPlaying}
                  isHovered={hoveredTrack === index}
                  onClick={() => playTrack(index)}
                  onHover={() => handleTrackHover(index)}
                  onLeave={() => handleTrackHover(null)}
                  hasAudio={!!track.audioSrc}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Secret Zone */}
      {showSecret && (
        <SecretZone 
          onClose={() => {
            setShowSecret(false)
            if (audioRef.current) {
              audioRef.current.pause()
              setIsPlaying(false)
            }
          }}
          onPlay={playSecretTrack}
          isPlaying={isPlaying}
          trackTitle={secretTrack.title}
          trackArtist={secretTrack.artist}
        />
      )}
    </div>
  )
}

function SecretZone({ 
  onClose, 
  onPlay, 
  isPlaying,
  trackTitle,
  trackArtist 
}: { 
  onClose: () => void
  onPlay: () => void
  isPlaying: boolean
  trackTitle: string
  trackArtist: string
}) {
  useEffect(() => {
    onPlay()
  }, [onPlay])
  
  return (
    <div
      className="fixed inset-0 z-[2000] flex animate-fade-in flex-col items-center justify-center overflow-hidden"
      style={{ background: "radial-gradient(circle, #1a0033 0%, #000 100%)" }}
      onClick={onClose}
    >
      {/* Animated Rays */}
      <div className="absolute left-[20%] h-24 w-0.5 animate-ray bg-gradient-to-b from-transparent via-purple-700 to-transparent opacity-30" />
      <div
        className="absolute left-[50%] h-24 w-0.5 animate-ray bg-gradient-to-b from-transparent via-purple-700 to-transparent opacity-30"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute left-[80%] h-24 w-0.5 animate-ray bg-gradient-to-b from-transparent via-purple-700 to-transparent opacity-30"
        style={{ animationDelay: "2s" }}
      />

      <h1 className="mb-8 animate-glow text-5xl font-black text-white drop-shadow-[0_0_10px_#4a00e0]">
        ZONA SECRETA
      </h1>

      {/* Vinyl Record */}
      <div className={`relative h-72 w-72 rounded-full border-8 border-neutral-800 bg-neutral-900 shadow-[0_0_60px_rgba(74,0,224,0.7)] ${isPlaying ? 'animate-spin-slow' : ''}`}>
        <div className="absolute inset-16 rounded-full border-4 border-neutral-900 bg-gradient-to-br from-pink-400 to-purple-600" />
      </div>
      
      {/* Now Playing */}
      <div className="mt-6 text-center">
        <p className="text-lg font-bold text-white">{trackTitle}</p>
        <p className="text-sm text-purple-300">{trackArtist}</p>
        {isPlaying && (
          <div className="mt-3 flex justify-center items-end gap-1 h-6">
            <span className="w-1.5 bg-purple-500 animate-equalizer-1 rounded-full" />
            <span className="w-1.5 bg-purple-500 animate-equalizer-2 rounded-full" />
            <span className="w-1.5 bg-purple-500 animate-equalizer-3 rounded-full" />
            <span className="w-1.5 bg-purple-500 animate-equalizer-1 rounded-full" />
            <span className="w-1.5 bg-purple-500 animate-equalizer-2 rounded-full" />
          </div>
        )}
      </div>

      <h3 className="mt-6 max-w-[80%] text-center text-xl text-sky-100">
        Esta cancion es para ti mi amor
      </h3>
      <p className="mt-4 text-sm opacity-50">(Toca en cualquier lado para volver)</p>
    </div>
  )
}

function SpotifyTrackRow({
  index,
  track,
  isActive,
  isPlaying,
  isHovered,
  onClick,
  onHover,
  onLeave,
  hasAudio,
}: {
  index: number
  track: Track
  isActive: boolean
  isPlaying?: boolean
  isHovered?: boolean
  onClick?: () => void
  onHover?: () => void
  onLeave?: () => void
  hasAudio?: boolean
}) {
  const isCigarettes = track.specialEffect === "cigarettes"
  
  return (
    <div
      className={`grid grid-cols-[16px_1fr_auto] gap-4 items-center px-4 py-2 rounded-md cursor-pointer transition-all duration-300 group ${
        isActive ? "bg-white/20" : ""
      } ${!hasAudio ? "opacity-40 cursor-not-allowed" : "hover:bg-white/10"} ${
        isCigarettes && isHovered ? "bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-pink-600/30 animate-pulse" : ""
      }`}
      onClick={hasAudio ? onClick : undefined}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Number / Play icon / Equalizer */}
      <div className="text-sm text-white/50 w-4 flex justify-center">
        {isPlaying ? (
          <div className="flex items-end gap-[2px] h-4">
            <span className="w-[3px] bg-[#1ed760] animate-equalizer-1 rounded-sm" />
            <span className="w-[3px] bg-[#1ed760] animate-equalizer-2 rounded-sm" />
            <span className="w-[3px] bg-[#1ed760] animate-equalizer-3 rounded-sm" />
          </div>
        ) : isHovered && hasAudio ? (
          <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        ) : (
          <span className={isActive ? "text-[#1ed760]" : ""}>{index + 1}</span>
        )}
      </div>
      
      {/* Track Info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className={`text-xl transition-transform ${isHovered && hasAudio ? "animate-bounce" : ""}`}>
          {track.icon}
        </div>
        <div className="min-w-0">
          <p className={`font-medium truncate ${isActive ? "text-[#1ed760]" : "text-white"}`}>
            {track.title}
          </p>
          <p className="text-sm text-white/50 truncate">{track.artist}</p>
        </div>
      </div>
      
      {/* Play indicator */}
      <div className="text-white/50 text-sm">
        {hasAudio && (
          <span className={`opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? "opacity-100" : ""}`}>
            {isPlaying ? "||" : ""}
          </span>
        )}
      </div>
    </div>
  )
}
