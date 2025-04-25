"use client"

import { useEffect, useState } from "react"
import ReactConfetti from "react-confetti"

interface ConfettiProps {
  onComplete?: () => void
}

export function Confetti({ onComplete }: ConfettiProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [particles, setParticles] = useState(200)

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

      
    handleResize()

  
    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <ReactConfetti
      width={dimensions.width}
      height={dimensions.height}
      numberOfPieces={particles}
      recycle={false}
      colors={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]}
      onConfettiComplete={(confetti) => {
        setParticles(0)
        confetti?.reset()
        if (onComplete) onComplete()
      }}
    />
  )
} 