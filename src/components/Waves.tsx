import { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface WavesProps {
  lineColor?: string
  backgroundColor?: string
  waveSpeedX?: number
  waveSpeedY?: number
  waveAmpX?: number
  waveAmpY?: number
  xGap?: number
  yGap?: number
  friction?: number
  tension?: number
  maxCursorMove?: number
  className?: string
}

class Grad {
  x: number
  y: number
  z: number
  constructor(x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z
  }
  dot2(x: number, y: number) {
    return this.x * x + this.y * y
  }
}

class Noise {
  grad3: Grad[]
  p: number[]
  perm: number[]
  gradP: Grad[]
  
  constructor(seed = 0) {
    this.grad3 = [
      new Grad(1, 1, 0),
      new Grad(-1, 1, 0),
      new Grad(1, -1, 0),
      new Grad(-1, -1, 0),
      new Grad(1, 0, 1),
      new Grad(-1, 0, 1),
      new Grad(1, 0, -1),
      new Grad(-1, 0, -1),
      new Grad(0, 1, 1),
      new Grad(0, -1, 1),
      new Grad(0, 1, -1),
      new Grad(0, -1, -1),
    ]
    this.p = [
      151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225,
      140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247,
      120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177,
      33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165,
      71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211,
      133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25,
      63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
      135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217,
      226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206,
      59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248,
      152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22,
      39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218,
      246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241,
      81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157,
      184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93,
      222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180,
    ]
    this.perm = new Array(512)
    this.gradP = new Array(512)
    this.seed(seed)
  }

  seed(seed: number) {
    if (seed > 0 && seed < 1) seed *= 65536
    seed = Math.floor(seed)
    if (seed < 256) seed |= seed << 8
    for (let i = 0; i < 256; i++) {
      let v = i & 1 ? this.p[i] ^ (seed & 255) : this.p[i] ^ ((seed >> 8) & 255)
      this.perm[i] = this.perm[i + 256] = v
      this.gradP[i] = this.gradP[i + 256] = this.grad3[v % 12]
    }
  }

  fade(t: number) {
    return t * t * t * (t * (t * 6 - 15) + 10)
  }

  lerp(a: number, b: number, t: number) {
    return (1 - t) * a + t * b
  }

  perlin2(x: number, y: number) {
    let X = Math.floor(x),
      Y = Math.floor(y)
    x -= X
    y -= Y
    X &= 255
    Y &= 255
    const n00 = this.gradP[X + this.perm[Y]].dot2(x, y)
    const n01 = this.gradP[X + this.perm[Y + 1]].dot2(x, y - 1)
    const n10 = this.gradP[X + 1 + this.perm[Y]].dot2(x - 1, y)
    const n11 = this.gradP[X + 1 + this.perm[Y + 1]].dot2(x - 1, y - 1)
    const u = this.fade(x)
    return this.lerp(
      this.lerp(n00, n10, u),
      this.lerp(n01, n11, u),
      this.fade(y),
    )
  }
}

export function Waves({
  lineColor = "#2D5A27",
  backgroundColor = "transparent",
  waveSpeedX = 0.008,
  waveSpeedY = 0.003,
  waveAmpX = 15,
  waveAmpY = 8,
  xGap = 20,
  yGap = 50,
  friction = 0.93,
  tension = 0.003,
  maxCursorMove = 60,
  className,
}: WavesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const mouseRef = useRef({ x: 0, y: 0 })
  const noiseRef = useRef(new Noise(Math.random()))
  const timeRef = useRef(0)
  const pointsRef = useRef<Array<Array<{ x: number; y: number; vx: number; vy: number; ox: number; oy: number }>>>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const noise = noiseRef.current

    const resizeCanvas = () => {
      const { devicePixelRatio: ratio = 1 } = window
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * ratio
      canvas.height = rect.height * ratio
      ctx.scale(ratio, ratio)
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'
      
      initPoints()
    }

    const initPoints = () => {
      const rect = canvas.getBoundingClientRect()
      const cols = Math.ceil(rect.width / xGap) + 1
      const rows = Math.ceil(rect.height / yGap) + 1
      
      pointsRef.current = []
      
      for (let i = 0; i < rows; i++) {
        pointsRef.current[i] = []
        for (let j = 0; j < cols; j++) {
          const x = j * xGap - (cols * xGap - rect.width) / 2
          const y = i * yGap - (rows * yGap - rect.height) / 2
          
          pointsRef.current[i][j] = {
            x: x,
            y: y,
            ox: x,
            oy: y,
            vx: 0,
            vy: 0,
          }
        }
      }
    }

    const updatePoints = () => {
      const rect = canvas.getBoundingClientRect()
      timeRef.current += 1
      
      pointsRef.current.forEach((row, i) => {
        row.forEach((point, j) => {
          // Perlin noise for organic wave motion
          const noiseX = noise.perlin2(
            (point.ox + timeRef.current * waveSpeedX * 50) * 0.008,
            (point.oy + timeRef.current * waveSpeedY * 50) * 0.008
          )
          const noiseY = noise.perlin2(
            (point.ox + timeRef.current * waveSpeedX * 30 + 1000) * 0.006,
            (point.oy + timeRef.current * waveSpeedY * 30 + 1000) * 0.006
          )

          const targetX = point.ox + noiseX * waveAmpX
          const targetY = point.oy + noiseY * waveAmpY

          // Mouse interaction
          const dx = mouseRef.current.x - point.x
          const dy = mouseRef.current.y - point.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const maxDistance = maxCursorMove

          if (distance < maxDistance) {
            const force = (1 - distance / maxDistance) * 0.3
            const angle = Math.atan2(dy, dx)
            point.vx += Math.cos(angle) * force * 2
            point.vy += Math.sin(angle) * force * 2
          }

          // Spring physics
          point.vx += (targetX - point.x) * tension
          point.vy += (targetY - point.y) * tension
          point.vx *= friction
          point.vy *= friction
          point.x += point.vx
          point.y += point.vy
        })
      })
    }

    const draw = () => {
      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)
      
      if (backgroundColor && backgroundColor !== 'transparent') {
        ctx.fillStyle = backgroundColor
        ctx.fillRect(0, 0, rect.width, rect.height)
      }

      if (pointsRef.current.length === 0) return

      ctx.strokeStyle = lineColor
      ctx.lineWidth = 0.8
      ctx.globalAlpha = 0.6

      // Draw horizontal lines
      pointsRef.current.forEach((row) => {
        if (row.length < 2) return
        ctx.beginPath()
        ctx.moveTo(row[0].x, row[0].y)
        
        for (let j = 1; j < row.length - 2; j++) {
          const xc = (row[j].x + row[j + 1].x) / 2
          const yc = (row[j].y + row[j + 1].y) / 2
          ctx.quadraticCurveTo(row[j].x, row[j].y, xc, yc)
        }
        
        if (row.length > 2) {
          ctx.quadraticCurveTo(
            row[row.length - 2].x,
            row[row.length - 2].y,
            row[row.length - 1].x,
            row[row.length - 1].y
          )
        }
        ctx.stroke()
      })

      // Draw vertical lines
      if (pointsRef.current.length > 0) {
        const cols = pointsRef.current[0].length
        for (let j = 0; j < cols; j++) {
          if (pointsRef.current.length < 2) continue
          ctx.beginPath()
          ctx.moveTo(pointsRef.current[0][j].x, pointsRef.current[0][j].y)
          
          for (let i = 1; i < pointsRef.current.length - 2; i++) {
            const xc = (pointsRef.current[i][j].x + pointsRef.current[i + 1][j].x) / 2
            const yc = (pointsRef.current[i][j].y + pointsRef.current[i + 1][j].y) / 2
            ctx.quadraticCurveTo(pointsRef.current[i][j].x, pointsRef.current[i][j].y, xc, yc)
          }
          
          if (pointsRef.current.length > 2) {
            ctx.quadraticCurveTo(
              pointsRef.current[pointsRef.current.length - 2][j].x,
              pointsRef.current[pointsRef.current.length - 2][j].y,
              pointsRef.current[pointsRef.current.length - 1][j].x,
              pointsRef.current[pointsRef.current.length - 1][j].y
            )
          }
          ctx.stroke()
        }
      }
    }

    const animate = () => {
      updatePoints()
      draw()
      animationRef.current = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = e.clientX - rect.left
      mouseRef.current.y = e.clientY - rect.top
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const rect = canvas.getBoundingClientRect()
      const touch = e.touches[0]
      if (touch) {
        mouseRef.current.x = touch.clientX - rect.left
        mouseRef.current.y = touch.clientY - rect.top
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas()
    })

    resizeCanvas()
    animate()
    
    resizeObserver.observe(canvas)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      resizeObserver.disconnect()
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('touchmove', handleTouchMove)
    }
  }, [lineColor, backgroundColor, waveSpeedX, waveSpeedY, waveAmpX, waveAmpY, xGap, yGap, friction, tension, maxCursorMove])

  return (
    <canvas
      ref={canvasRef}
      className={cn("w-full h-full", className)}
      style={{ 
        background: backgroundColor,
        touchAction: 'none'
      }}
    />
  )
}