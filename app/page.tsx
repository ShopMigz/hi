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

const loveTexts = [
  "Te amo con todo mi ser 💕",
  "Eres mi universo entero 🌌",
  "Contigo todo es mejor ✨", 
  "Mi corazon late por ti 💗",
  "Eres mi paz y mi calma 🌊",
  "Juntos por siempre y para siempre 💫",
  "Mi alma gemela 🦭",
  "Eres mi hogar 🏠",
  "Te elijo cada dia 🌹",
  "Mi eterno amor 💝",
  "Eres perfecta para mi 🌸",
  "Mi razon de ser 🌟",
  "Contigo a donde sea 🐠",
  "Nadando en tu amor 🐟",
  "Mi foquita hermosa 🦭",
  "Eres mi oceano de amor 🌊",
  "Burbujas de felicidad 🫧",
  "Mi tesoro del mar 💎"
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
  
  const [oceanClickEffect, setOceanClickEffect] = useState(false)

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
      setOceanClickEffect(false)
    } else {
      setCigarettesEffect(false)
      setOceanClickEffect(false)
    }
  }
  
  const handleOceanClick = () => {
    if (cigarettesEffect) {
      setOceanClickEffect(!oceanClickEffect)
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

  // Generate floating seals - optimized with max limit
  useEffect(() => {
    if (stage === "content") {
      const generateSeal = () => {
        const id = Date.now() + Math.random()
        const newSeal: FloatingSeal = {
          id,
          x: Math.random() * 70 + 15,
          y: Math.random() * 60 + 20,
          image: sealImages[Math.floor(Math.random() * sealImages.length)],
          duration: 12000, // Longer duration for smoother experience
          delay: 0,
          visible: true,
        }
        setFloatingSeals(prev => {
          // Keep max 2 seals at a time for better performance
          if (prev.length >= 2) return prev.slice(1).concat(newSeal)
          return [...prev, newSeal]
        })
      }
      
      generateSeal()
      // Increased interval from 5s to 7s for less frequent updates
      const interval = setInterval(generateSeal, 7000)
      return () => clearInterval(interval)
    }
  }, [stage])
  
  // Generate floating love texts - optimized for performance
  useEffect(() => {
    if (stage === "content") {
      const generateText = () => {
        const duration = 5000 // Slightly longer for smoother animations
        const newText: FloatingText = {
          id: Date.now() + Math.random(),
          x: Math.random() * 80 + 10,
          y: 75 + Math.random() * 15,
          text: loveTexts[Math.floor(Math.random() * loveTexts.length)],
          duration,
          size: Math.random() * 12 + 16,
        }
        setFloatingTexts(prev => {
          // Limit to max 5 texts for better performance
          if (prev.length >= 5) return prev.slice(1).concat(newText)
          return [...prev, newText]
        })
        setTimeout(() => {
          setFloatingTexts(prev => prev.filter(t => t.id !== newText.id))
        }, duration)
      }
      
      generateText()
      // Reduced frequency from 1.5s to 2.5s
      const interval = setInterval(generateText, 2500)
      return () => clearInterval(interval)
    }
  }, [stage])

  // Optimized bubble cleanup with requestAnimationFrame batching
  useEffect(() => {
    if (bubbles.length === 0) return
    const timeout = setTimeout(() => {
      setBubbles(prev => prev.slice(Math.max(0, prev.length - 15)))
    }, 4500)
    return () => clearTimeout(timeout)
  }, [bubbles.length])

  const generateBubble = useCallback((x: number, y: number, duration: number) => {
    setBubbles((prev) => {
      // Limit total bubbles for performance
      if (prev.length >= 25) return prev
      const newBubble: Bubble = {
        id: Date.now() + Math.random(),
        x,
        y,
        size: Math.random() * 20 + 5,
        duration,
      }
      return [...prev, newBubble]
    })
  }, [])

  useEffect(() => {
    if (stage !== "seal") {
      // Reduced frequency from 150ms to 400ms for better performance
      const interval = setInterval(() => {
        // Limit max bubbles to 20 for performance
        setBubbles(prev => {
          if (prev.length >= 20) return prev
          const newBubble: Bubble = {
            id: Date.now() + Math.random(),
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 10,
            size: Math.random() * 20 + 5,
            duration: 4000,
          }
          return [...prev, newBubble]
        })
      }, 400)
      return () => clearInterval(interval)
    }
  }, [stage])

  // Throttled mouse move for better performance
  const lastMouseBubble = useRef(0)
  const handleMouseMove = (e: React.MouseEvent) => {
    const now = Date.now()
    // Only generate bubble every 200ms and with 30% chance
    if (now - lastMouseBubble.current > 200 && Math.random() > 0.7) {
      lastMouseBubble.current = now
      generateBubble(e.clientX, e.clientY, 1500)
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
        className="fixed inset-0 -z-20 transition-all duration-1000"
        style={{
          background: cigarettesEffect 
            ? "#000000"
            : submerged 
              ? "linear-gradient(to bottom, #0a1628 0%, #0d1a2e 25%, #0f1d35 50%, #081525 75%, #050d18 100%)" 
              : "#050810"
        }}
      >
        {/* Animated underwater light rays */}
        {submerged && !cigarettesEffect && (
          <>
            <div className="absolute top-0 left-[10%] w-[120px] h-full bg-gradient-to-b from-cyan-400/8 via-cyan-300/3 to-transparent animate-light-ray-1 blur-sm" />
            <div className="absolute top-0 left-[25%] w-[80px] h-full bg-gradient-to-b from-blue-400/6 via-blue-300/2 to-transparent animate-light-ray-2 blur-md" />
            <div className="absolute top-0 left-[45%] w-[150px] h-full bg-gradient-to-b from-teal-400/7 via-teal-300/3 to-transparent animate-light-ray-3 blur-sm" />
            <div className="absolute top-0 left-[65%] w-[100px] h-full bg-gradient-to-b from-cyan-300/5 via-cyan-200/2 to-transparent animate-light-ray-1 blur-lg" style={{ animationDelay: '2s' }} />
            <div className="absolute top-0 left-[85%] w-[90px] h-full bg-gradient-to-b from-blue-300/6 via-blue-200/2 to-transparent animate-light-ray-2 blur-md" style={{ animationDelay: '4s' }} />
          </>
        )}
        
        {/* Floating particles - subtle and organic */}
        {submerged && !cigarettesEffect && (
          <>
            {/* Glowing orbs */}
            <div className="absolute w-1 h-1 rounded-full bg-cyan-300/40 animate-particle-rise" style={{ left: '5%', bottom: '-2%', animationDelay: '0s' }} />
            <div className="absolute w-2 h-2 rounded-full bg-cyan-400/30 animate-particle-rise" style={{ left: '12%', bottom: '-2%', animationDelay: '3s' }} />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-teal-300/35 animate-particle-rise" style={{ left: '22%', bottom: '-2%', animationDelay: '1.5s' }} />
            <div className="absolute w-1 h-1 rounded-full bg-blue-300/40 animate-particle-rise" style={{ left: '38%', bottom: '-2%', animationDelay: '4s' }} />
            <div className="absolute w-2.5 h-2.5 rounded-full bg-cyan-300/25 animate-particle-rise" style={{ left: '55%', bottom: '-2%', animationDelay: '2s' }} />
            <div className="absolute w-1 h-1 rounded-full bg-teal-400/40 animate-particle-rise" style={{ left: '68%', bottom: '-2%', animationDelay: '5s' }} />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400/35 animate-particle-rise" style={{ left: '78%', bottom: '-2%', animationDelay: '1s' }} />
            <div className="absolute w-2 h-2 rounded-full bg-blue-400/30 animate-particle-rise" style={{ left: '92%', bottom: '-2%', animationDelay: '3.5s' }} />
            
            {/* Ambient floating dust */}
            <div className="absolute w-0.5 h-0.5 rounded-full bg-white/20 animate-dust-float" style={{ left: '15%', top: '20%' }} />
            <div className="absolute w-0.5 h-0.5 rounded-full bg-white/15 animate-dust-float" style={{ left: '35%', top: '40%', animationDelay: '2s' }} />
            <div className="absolute w-1 h-1 rounded-full bg-white/10 animate-dust-float" style={{ left: '60%', top: '30%', animationDelay: '4s' }} />
            <div className="absolute w-0.5 h-0.5 rounded-full bg-white/20 animate-dust-float" style={{ left: '80%', top: '60%', animationDelay: '1s' }} />
            <div className="absolute w-0.5 h-0.5 rounded-full bg-white/15 animate-dust-float" style={{ left: '45%', top: '70%', animationDelay: '3s' }} />
          </>
        )}
        
        {/* Depth fog layers */}
        {submerged && !cigarettesEffect && (
          <>
            <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-[#050d18]/80 to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-1/6 bg-gradient-to-b from-cyan-900/10 to-transparent pointer-events-none" />
          </>
        )}
      </div>
      
      {/* Cigarettes Special Effect - Cinematic atmosphere */}
      {cigarettesEffect && (
        <div 
          className="fixed inset-0 -z-10 overflow-hidden cursor-pointer"
          onClick={handleOceanClick}
        >
          {/* Base gradient with aurora effect */}
          <div className={`absolute inset-0 transition-all duration-1500 ${
            oceanClickEffect 
              ? "bg-gradient-to-b from-[#0a1628] via-[#0d1f35] to-[#050d18]" 
              : "bg-gradient-to-br from-[#0f0a1a] via-[#1a0f2e] to-[#0a0f1a]"
          }`} />
          
          {/* Aurora waves */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -left-1/4 w-[150%] h-full bg-gradient-to-r from-transparent via-purple-600/10 to-transparent animate-aurora-1 blur-3xl" />
            <div className="absolute -top-1/2 -right-1/4 w-[150%] h-full bg-gradient-to-l from-transparent via-cyan-500/8 to-transparent animate-aurora-2 blur-3xl" />
            <div className="absolute top-1/4 left-0 w-full h-1/2 bg-gradient-to-r from-transparent via-pink-500/6 to-transparent animate-aurora-3 blur-3xl" />
          </div>
          
          {/* Dynamic light streaks */}
          <div className="absolute top-0 left-[15%] w-[2px] h-full bg-gradient-to-b from-cyan-400/40 via-cyan-400/10 to-transparent animate-streak-fall" />
          <div className="absolute top-0 left-[35%] w-[1px] h-full bg-gradient-to-b from-purple-400/30 via-purple-400/5 to-transparent animate-streak-fall" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-0 right-[25%] w-[2px] h-full bg-gradient-to-b from-pink-400/35 via-pink-400/8 to-transparent animate-streak-fall" style={{ animationDelay: '0.8s' }} />
          <div className="absolute top-0 right-[10%] w-[1px] h-full bg-gradient-to-b from-blue-400/25 via-blue-400/5 to-transparent animate-streak-fall" style={{ animationDelay: '2.2s' }} />
          
          {/* Floating ethereal orbs */}
          <div className="absolute w-40 h-40 rounded-full bg-purple-500/15 blur-3xl animate-orb-float-1" style={{ top: '10%', left: '10%' }} />
          <div className="absolute w-32 h-32 rounded-full bg-cyan-400/12 blur-2xl animate-orb-float-2" style={{ top: '30%', right: '15%' }} />
          <div className="absolute w-48 h-48 rounded-full bg-pink-500/10 blur-3xl animate-orb-float-3" style={{ bottom: '20%', left: '20%' }} />
          <div className="absolute w-24 h-24 rounded-full bg-blue-400/15 blur-2xl animate-orb-float-1" style={{ bottom: '30%', right: '25%', animationDelay: '2s' }} />
          
          {/* Smoke wisps */}
          <div className="absolute bottom-0 left-[5%] w-1 h-32 bg-gradient-to-t from-white/5 to-transparent animate-smoke-rise" />
          <div className="absolute bottom-0 left-[15%] w-0.5 h-40 bg-gradient-to-t from-white/8 to-transparent animate-smoke-rise" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-0 right-[20%] w-1 h-36 bg-gradient-to-t from-white/6 to-transparent animate-smoke-rise" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-0 right-[8%] w-0.5 h-28 bg-gradient-to-t from-white/7 to-transparent animate-smoke-rise" style={{ animationDelay: '0.5s' }} />
          
          {/* Vignette */}
          <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />
          
          {/* Hint text */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 text-xs tracking-widest uppercase animate-pulse">
            {oceanClickEffect ? "Click para volver" : "Click para cambiar"}
          </div>
        </div>
      )}

      {/* Floating ocean emojis */}
      {stage === "content" && (
        <>
          {/* Swimming fish */}
          <div className="absolute left-[3%] top-[15%] text-4xl animate-swim-right opacity-70" style={{ animationDuration: '18s' }}>🐟</div>
          <div className="absolute right-[5%] top-[25%] text-3xl animate-swim-left opacity-60" style={{ animationDuration: '20s', animationDelay: '2s' }}>🐠</div>
          <div className="absolute left-[8%] top-[45%] text-5xl animate-swim-right opacity-50" style={{ animationDuration: '22s', animationDelay: '4s' }}>🐡</div>
          <div className="absolute right-[10%] bottom-[30%] text-4xl animate-swim-left opacity-65" style={{ animationDuration: '16s', animationDelay: '1s' }}>🐟</div>
          
          {/* Cute seals */}
          <div className="absolute left-[5%] bottom-[20%] text-5xl animate-float-gentle opacity-80">🦭</div>
          <div className="absolute right-[8%] top-[35%] text-4xl animate-float-gentle opacity-70" style={{ animationDelay: '1.5s' }}>🦭</div>
          
          {/* Ocean creatures */}
          <div className="absolute left-[85%] bottom-[15%] text-4xl animate-float-gentle opacity-60" style={{ animationDelay: '3s' }}>🐙</div>
          <div className="absolute left-[12%] top-[65%] text-3xl animate-swim-right opacity-55" style={{ animationDuration: '25s', animationDelay: '5s' }}>🦑</div>
          <div className="absolute right-[15%] bottom-[45%] text-3xl animate-float-gentle opacity-50" style={{ animationDelay: '2.5s' }}>🦐</div>
          
          {/* Coral and plants at bottom */}
          <div className="absolute left-[10%] bottom-[3%] text-5xl opacity-40">🪸</div>
          <div className="absolute left-[25%] bottom-[2%] text-4xl opacity-35">🌿</div>
          <div className="absolute right-[20%] bottom-[3%] text-5xl opacity-40">🪸</div>
          <div className="absolute right-[8%] bottom-[2%] text-4xl opacity-30">🌊</div>
          
          {/* Bubbles */}
          <div className="absolute left-[30%] bottom-[10%] text-2xl animate-bubble-rise opacity-40">🫧</div>
          <div className="absolute left-[50%] bottom-[5%] text-3xl animate-bubble-rise opacity-35" style={{ animationDelay: '1s' }}>🫧</div>
          <div className="absolute right-[35%] bottom-[8%] text-2xl animate-bubble-rise opacity-45" style={{ animationDelay: '2s' }}>🫧</div>
        </>
      )}
      
      {/* Floating Love Texts - Beautiful messages */}
      {floatingTexts.map(textItem => (
        <div
          key={textItem.id}
          className="absolute z-10 pointer-events-none animate-love-text-float text-white/30 font-medium"
          style={{
            left: `${textItem.x}%`,
            top: `${textItem.y}%`,
            fontSize: `${textItem.size}px`,
            animationDuration: `${textItem.duration}ms`,
            textShadow: '0 0 15px rgba(34, 211, 238, 0.5), 0 0 30px rgba(34, 211, 238, 0.3)',
          }}
        >
          {textItem.text}
        </div>
      ))}

      {/* Floating Seal Images - Elegant drift */}
      {floatingSeals.map(seal => (
        <div
          key={seal.id}
          className={`absolute z-20 cursor-pointer transition-all duration-500 ${
            poppingSeals.includes(seal.id) 
              ? "animate-seal-pop-elegant" 
              : "animate-seal-drift hover:scale-105 hover:brightness-110"
          }`}
          style={{
            left: `${seal.x}%`,
            top: `${seal.y}%`,
            animationDuration: poppingSeals.includes(seal.id) ? "600ms" : `${seal.duration}ms`,
            animationDelay: poppingSeals.includes(seal.id) ? "0ms" : `${seal.delay}ms`,
          }}
          onClick={() => handleSealPop(seal.id)}
        >
          <Image
            src={seal.image}
            alt="Foquita"
            width={90}
            height={90}
            className="rounded-full object-cover shadow-[0_0_30px_rgba(34,211,238,0.3)] ring-2 ring-cyan-400/20"
          />
          {/* Sparkle particles when popping */}
          {poppingSeals.includes(seal.id) && (
            <div className="absolute inset-0 flex items-center justify-center">
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-2 h-2 rounded-full animate-sparkle-burst"
                  style={{
                    animationDelay: `${i * 30}ms`,
                    background: i % 3 === 0 ? 'rgba(34, 211, 238, 0.8)' : i % 3 === 1 ? 'rgba(56, 189, 248, 0.7)' : 'rgba(255, 255, 255, 0.6)',
                    boxShadow: '0 0 8px currentColor',
                    ['--angle' as string]: `${i * 30}deg`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Bubbles - GPU accelerated */}
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="pointer-events-none absolute rounded-full bg-white/30 animate-bubble will-change-transform"
          style={{
            left: bubble.x,
            top: bubble.y,
            width: bubble.size,
            height: bubble.size,
            animationDuration: `${bubble.duration}ms`,
            backfaceVisibility: 'hidden',
          }}
        />
      ))}
      
      {/* Stage 1: Seal Intro */}
      {stage === "seal" && (
        <div
          className="fixed inset-0 z-[10000] flex cursor-pointer flex-col items-center justify-center bg-[#050810]"
          onClick={handleSealClick}
        >
          {/* Ambient background glow - GPU accelerated */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none will-change-transform">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-3xl animate-breathe" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-blue-400/8 blur-2xl animate-breathe" style={{ animationDelay: '1s' }} />
          </div>
          
          {/* CSS-only bubbles for performance - no JS intervals */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Bubble stream 1 */}
            <div className="absolute left-[10%] bottom-0 w-3 h-3 rounded-full bg-white/20 animate-bubble-stream" style={{ animationDelay: '0s' }} />
            <div className="absolute left-[10%] bottom-0 w-2 h-2 rounded-full bg-cyan-300/30 animate-bubble-stream" style={{ animationDelay: '0.8s' }} />
            <div className="absolute left-[10%] bottom-0 w-4 h-4 rounded-full bg-white/15 animate-bubble-stream" style={{ animationDelay: '1.6s' }} />
            
            {/* Bubble stream 2 */}
            <div className="absolute left-[25%] bottom-0 w-2 h-2 rounded-full bg-cyan-200/25 animate-bubble-stream" style={{ animationDelay: '0.3s' }} />
            <div className="absolute left-[25%] bottom-0 w-3 h-3 rounded-full bg-white/20 animate-bubble-stream" style={{ animationDelay: '1.1s' }} />
            <div className="absolute left-[25%] bottom-0 w-2.5 h-2.5 rounded-full bg-cyan-300/20 animate-bubble-stream" style={{ animationDelay: '1.9s' }} />
            
            {/* Bubble stream 3 */}
            <div className="absolute left-[40%] bottom-0 w-4 h-4 rounded-full bg-white/15 animate-bubble-stream" style={{ animationDelay: '0.5s' }} />
            <div className="absolute left-[40%] bottom-0 w-2 h-2 rounded-full bg-cyan-200/30 animate-bubble-stream" style={{ animationDelay: '1.3s' }} />
            <div className="absolute left-[40%] bottom-0 w-3 h-3 rounded-full bg-white/20 animate-bubble-stream" style={{ animationDelay: '2.1s' }} />
            
            {/* Bubble stream 4 */}
            <div className="absolute left-[55%] bottom-0 w-2.5 h-2.5 rounded-full bg-cyan-300/25 animate-bubble-stream" style={{ animationDelay: '0.2s' }} />
            <div className="absolute left-[55%] bottom-0 w-3.5 h-3.5 rounded-full bg-white/20 animate-bubble-stream" style={{ animationDelay: '1s' }} />
            <div className="absolute left-[55%] bottom-0 w-2 h-2 rounded-full bg-cyan-200/30 animate-bubble-stream" style={{ animationDelay: '1.8s' }} />
            
            {/* Bubble stream 5 */}
            <div className="absolute left-[70%] bottom-0 w-3 h-3 rounded-full bg-white/20 animate-bubble-stream" style={{ animationDelay: '0.7s' }} />
            <div className="absolute left-[70%] bottom-0 w-2 h-2 rounded-full bg-cyan-300/25 animate-bubble-stream" style={{ animationDelay: '1.5s' }} />
            <div className="absolute left-[70%] bottom-0 w-4 h-4 rounded-full bg-white/15 animate-bubble-stream" style={{ animationDelay: '2.3s' }} />
            
            {/* Bubble stream 6 */}
            <div className="absolute left-[85%] bottom-0 w-2 h-2 rounded-full bg-cyan-200/30 animate-bubble-stream" style={{ animationDelay: '0.4s' }} />
            <div className="absolute left-[85%] bottom-0 w-3 h-3 rounded-full bg-white/20 animate-bubble-stream" style={{ animationDelay: '1.2s' }} />
            <div className="absolute left-[85%] bottom-0 w-2.5 h-2.5 rounded-full bg-cyan-300/20 animate-bubble-stream" style={{ animationDelay: '2s' }} />
          </div>
          
          {/* Background ocean emojis - optimized with will-change */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute left-[5%] top-[10%] text-4xl opacity-20 animate-float-gentle will-change-transform">🐟</div>
            <div className="absolute right-[8%] top-[15%] text-3xl opacity-15 animate-float-gentle will-change-transform" style={{ animationDelay: '1s' }}>🐠</div>
            <div className="absolute left-[10%] bottom-[20%] text-5xl opacity-20 animate-float-gentle will-change-transform" style={{ animationDelay: '2s' }}>🪸</div>
            <div className="absolute right-[12%] bottom-[25%] text-4xl opacity-15 animate-float-gentle will-change-transform" style={{ animationDelay: '0.5s' }}>🫧</div>
            <div className="absolute left-[80%] top-[40%] text-3xl opacity-20 animate-float-gentle will-change-transform" style={{ animationDelay: '1.5s' }}>🐡</div>
            <div className="absolute left-[15%] top-[50%] text-4xl opacity-15 animate-float-gentle will-change-transform" style={{ animationDelay: '2.5s' }}>🌊</div>
          </div>
          
          {/* Subtle ocean glow at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-cyan-900/15 via-cyan-900/5 to-transparent pointer-events-none" />
          
          <div className={`text-[10rem] transition-all duration-500 will-change-transform ${
            sealClicked 
              ? "scale-[1.8] rotate-6 animate-seal-expand" 
              : "animate-seal-breathe hover:scale-110"
          }`} style={{ filter: 'drop-shadow(0 0 40px rgba(34, 211, 238, 0.6))' }}>
            🦭
          </div>
          <p className={`mt-8 text-sm font-medium tracking-[4px] uppercase text-cyan-400/80 transition-all duration-300 ${sealClicked ? "opacity-0 translate-y-4" : "animate-pulse-subtle"}`}>
            Click a la foquita
          </p>
        </div>
      )}

      {/* Stage 2: Question */}
      {stage === "question" && (
        <div
          className={`fixed inset-0 z-[5000] flex flex-col items-center justify-center text-center transition-all duration-1000 bg-[#050810] ${
            submerged ? "pointer-events-none opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        >
          {/* Ambient background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none will-change-transform">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-3xl animate-breathe" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-3xl animate-breathe" style={{ animationDelay: '2s' }} />
          </div>
          
          {/* CSS-only rising bubbles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute left-[15%] bottom-0 w-3 h-3 rounded-full bg-white/25 animate-bubble-stream" style={{ animationDelay: '0s' }} />
            <div className="absolute left-[15%] bottom-0 w-2 h-2 rounded-full bg-cyan-300/30 animate-bubble-stream" style={{ animationDelay: '1.2s' }} />
            <div className="absolute left-[30%] bottom-0 w-4 h-4 rounded-full bg-white/20 animate-bubble-stream" style={{ animationDelay: '0.4s' }} />
            <div className="absolute left-[30%] bottom-0 w-2.5 h-2.5 rounded-full bg-cyan-200/25 animate-bubble-stream" style={{ animationDelay: '1.6s' }} />
            <div className="absolute left-[50%] bottom-0 w-3 h-3 rounded-full bg-white/20 animate-bubble-stream" style={{ animationDelay: '0.8s' }} />
            <div className="absolute left-[50%] bottom-0 w-2 h-2 rounded-full bg-cyan-300/30 animate-bubble-stream" style={{ animationDelay: '2s' }} />
            <div className="absolute left-[70%] bottom-0 w-3.5 h-3.5 rounded-full bg-white/25 animate-bubble-stream" style={{ animationDelay: '0.2s' }} />
            <div className="absolute left-[70%] bottom-0 w-2 h-2 rounded-full bg-cyan-200/30 animate-bubble-stream" style={{ animationDelay: '1.4s' }} />
            <div className="absolute left-[85%] bottom-0 w-3 h-3 rounded-full bg-white/20 animate-bubble-stream" style={{ animationDelay: '0.6s' }} />
            <div className="absolute left-[85%] bottom-0 w-2.5 h-2.5 rounded-full bg-cyan-300/25 animate-bubble-stream" style={{ animationDelay: '1.8s' }} />
          </div>
          
          {/* Ocean gradient hint at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-cyan-900/20 via-cyan-900/5 to-transparent pointer-events-none" />
          
          {/* Floating ocean emojis */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute text-4xl opacity-25 animate-swim-right will-change-transform" style={{ left: '-5%', top: '15%', animationDuration: '20s' }}>🐟</div>
            <div className="absolute text-3xl opacity-20 animate-swim-left will-change-transform" style={{ right: '-5%', top: '30%', animationDuration: '18s', animationDelay: '3s' }}>🐠</div>
            <div className="absolute text-5xl opacity-30 animate-float-gentle will-change-transform" style={{ left: '5%', bottom: '15%' }}>🦭</div>
            <div className="absolute text-4xl opacity-20 animate-float-gentle will-change-transform" style={{ right: '8%', bottom: '20%', animationDelay: '1s' }}>🐙</div>
            <div className="absolute text-3xl opacity-25 animate-bubble-rise will-change-transform" style={{ left: '20%', bottom: '5%' }}>🫧</div>
            <div className="absolute text-3xl opacity-20 animate-bubble-rise will-change-transform" style={{ left: '70%', bottom: '8%', animationDelay: '2s' }}>🫧</div>
            <div className="absolute text-4xl opacity-15 animate-float-gentle will-change-transform" style={{ left: '85%', top: '45%', animationDelay: '2s' }}>🐡</div>
          </div>
          
          <h1 className="mb-12 animate-fade-in-up text-3xl font-light md:text-4xl lg:text-5xl text-white/90 max-w-3xl px-6 leading-relaxed" style={{ textShadow: '0 0 40px rgba(34, 211, 238, 0.4)' }}>
            ¿Quieres salir de la obscuridad y sumergirte conmigo?
          </h1>
          <button
            onClick={handleSubmerge}
            className="group relative px-16 py-6 transition-all duration-500 hover:scale-110"
          >
            <span className="relative z-10 text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-100 to-cyan-300 animate-shimmer-text">
              SUMERGIRSE
            </span>
            <div className="absolute inset-0 blur-xl bg-gradient-to-r from-cyan-500/30 via-cyan-300/40 to-cyan-500/30 animate-glow-pulse" />
            <div className="absolute inset-x-0 -bottom-2 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      )}

      {/* Stage 3: Main Content */}
      {stage === "content" && (
        <div className="relative h-screen w-full animate-fade-in">
          {/* Secret Button */}
          <button
            onClick={() => setShowSecret(true)}
            className="absolute right-6 top-6 z-[100] text-4xl text-cyan-200 drop-shadow-[0_0_10px_rgba(0,180,216,0.8)] transition-transform hover:scale-110"
          >
            ?
          </button>

          {/* Spotify Style Player */}
          <div className="absolute left-1/2 top-1/2 z-50 w-[95%] max-w-[420px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl backdrop-blur-2xl bg-gradient-to-b from-[#1a1a1f]/95 to-[#0d0d10]/98 shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_80px_rgba(34,211,238,0.1)] border border-white/5 max-h-[90vh]">
            {/* Animated ambient glow */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-transparent to-teal-500/10 animate-ambient-glow pointer-events-none blur-xl" />
            
            {/* Header */}
            <div className="relative bg-gradient-to-b from-ocean-blue/50 via-ocean-blue/30 to-transparent p-5 pb-8">
              {/* Animated background particles in header */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-32 h-32 rounded-full bg-cyan-400/10 blur-3xl animate-float-1" style={{ top: '-20%', left: '-10%' }} />
                <div className="absolute w-24 h-24 rounded-full bg-blue-400/10 blur-2xl animate-float-2" style={{ top: '20%', right: '-5%' }} />
              </div>
              <div className="relative flex items-end gap-4">
                <div className="h-24 w-24 rounded-lg shadow-[0_4px_20px_rgba(0,180,216,0.4)] bg-gradient-to-br from-ocean-blue via-cyan-400 to-sky-300 flex items-center justify-center text-5xl transform hover:scale-105 transition-transform duration-300">
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
  const [hearts, setHearts] = useState<{id: number, x: number, y: number}[]>([])
  
  useEffect(() => {
    onPlay()
  }, [onPlay])
  
  // Generate floating hearts
  useEffect(() => {
    const interval = setInterval(() => {
      const newHeart = {
        id: Date.now(),
        x: Math.random() * 100,
        y: Math.random() * 100
      }
      setHearts(prev => [...prev.slice(-15), newHeart])
    }, 800)
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div
      className="fixed inset-0 z-[2000] flex animate-fade-in flex-col items-center justify-center overflow-hidden"
      style={{ background: "radial-gradient(ellipse at center, #1a0a2e 0%, #0d0015 50%, #000 100%)" }}
      onClick={onClose}
    >
      {/* Floating hearts */}
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="absolute text-3xl animate-float-1 pointer-events-none opacity-40"
          style={{ left: `${heart.x}%`, top: `${heart.y}%` }}
        >
          💜
        </div>
      ))}
      
      {/* Animated Stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.5 + 0.2
            }}
          />
        ))}
      </div>
      
      {/* Animated Rays */}
      <div className="absolute left-[15%] h-32 w-1 animate-ray bg-gradient-to-b from-transparent via-pink-500 to-transparent opacity-40" />
      <div
        className="absolute left-[35%] h-40 w-1 animate-ray bg-gradient-to-b from-transparent via-purple-500 to-transparent opacity-30"
        style={{ animationDelay: "0.5s" }}
      />
      <div
        className="absolute left-[55%] h-36 w-1 animate-ray bg-gradient-to-b from-transparent via-cyan-500 to-transparent opacity-35"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute left-[75%] h-28 w-1 animate-ray bg-gradient-to-b from-transparent via-pink-400 to-transparent opacity-40"
        style={{ animationDelay: "1.5s" }}
      />
      <div
        className="absolute left-[90%] h-44 w-1 animate-ray bg-gradient-to-b from-transparent via-purple-600 to-transparent opacity-25"
        style={{ animationDelay: "2s" }}
      />

      {/* Title with better glow */}
      <h1 className="mb-6 text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 drop-shadow-[0_0_30px_rgba(168,85,247,0.8)] animate-pulse">
        ZONA SECRETA
      </h1>
      
      {/* Subtitle */}
      <p className="mb-8 text-purple-300/60 text-sm tracking-widest uppercase">Solo para ti</p>

      {/* Vinyl Record with better design */}
      <div className="relative">
        {/* Glow ring */}
        <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-cyan-500/30 blur-xl animate-pulse" />
        
        <div className={`relative h-56 w-56 md:h-72 md:w-72 rounded-full border-[6px] border-neutral-800 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 shadow-[0_0_80px_rgba(168,85,247,0.5)] ${isPlaying ? 'animate-spin-slow' : ''}`}>
          {/* Vinyl grooves */}
          <div className="absolute inset-4 rounded-full border border-neutral-700/30" />
          <div className="absolute inset-8 rounded-full border border-neutral-700/20" />
          <div className="absolute inset-12 rounded-full border border-neutral-700/30" />
          
          {/* Center label */}
          <div className="absolute inset-14 md:inset-16 rounded-full border-4 border-neutral-900 bg-gradient-to-br from-pink-500 via-purple-600 to-cyan-500 flex items-center justify-center">
            <span className="text-3xl md:text-4xl">💀</span>
          </div>
          
          {/* Reflection */}
          <div className="absolute top-4 left-4 w-1/3 h-1/4 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-sm" />
        </div>
      </div>
      
      {/* Now Playing */}
      <div className="mt-8 text-center">
        <p className="text-xl md:text-2xl font-bold text-white tracking-wide">{trackTitle}</p>
        <p className="text-base text-purple-300 mt-1">{trackArtist}</p>
        {isPlaying && (
          <div className="mt-4 flex justify-center items-end gap-1.5 h-8">
            <span className="w-2 bg-gradient-to-t from-pink-500 to-purple-500 animate-equalizer-1 rounded-full" />
            <span className="w-2 bg-gradient-to-t from-purple-500 to-cyan-500 animate-equalizer-2 rounded-full" />
            <span className="w-2 bg-gradient-to-t from-cyan-500 to-pink-500 animate-equalizer-3 rounded-full" />
            <span className="w-2 bg-gradient-to-t from-pink-500 to-purple-500 animate-equalizer-1 rounded-full" />
            <span className="w-2 bg-gradient-to-t from-purple-500 to-cyan-500 animate-equalizer-2 rounded-full" />
            <span className="w-2 bg-gradient-to-t from-cyan-500 to-pink-500 animate-equalizer-3 rounded-full" />
            <span className="w-2 bg-gradient-to-t from-pink-500 to-purple-500 animate-equalizer-1 rounded-full" />
          </div>
        )}
      </div>

      {/* Love message */}
      <div className="mt-8 max-w-sm text-center px-4">
        <p className="text-lg md:text-xl text-white/90 font-light italic leading-relaxed">
          &quot;En cada nota de esta cancion, esta mi amor por ti. Eres lo mas hermoso que me ha pasado.&quot;
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <span className="text-2xl animate-bounce" style={{ animationDelay: "0s" }}>💜</span>
          <span className="text-2xl animate-bounce" style={{ animationDelay: "0.1s" }}>🖤</span>
          <span className="text-2xl animate-bounce" style={{ animationDelay: "0.2s" }}>💜</span>
        </div>
      </div>
      
      <p className="mt-8 text-sm text-white/30">(Toca en cualquier lado para volver)</p>
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
