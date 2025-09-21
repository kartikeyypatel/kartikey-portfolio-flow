
'use client'

import { Suspense, lazy, useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, RotateCcw, Zap, Music, Sparkles } from 'lucide-react'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
  showControls?: boolean
}

interface RobotObject {
  position: { set: (x: number, y: number, z: number) => void }
  rotation: { set: (x: number, y: number, z: number) => void }
  scale: { set: (x: number, y: number, z: number) => void }
}

interface SplineApplication {
  findObjectByName: (name: string) => RobotObject | null
  getAllObjects: () => RobotObject[]
  emitEvent: (event: string, target?: string) => void
}

export function SplineScene({ scene, className, showControls = true }: SplineSceneProps) {
  const [spline, setSpline] = useState<SplineApplication | null>(null)
  const [robot, setRobot] = useState<RobotObject | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const [robotFound, setRobotFound] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  
  const animationRef = useRef<number | null>(null)
  const originalTransform = useRef<{
    position: [number, number, number]
    rotation: [number, number, number]
    scale: [number, number, number]
  } | null>(null)

  // Common robot object names to try
  const robotNames = ['Robot', 'Group', 'Mesh', 'Character', 'Model', 'Object', 'Main']

  const onLoad = useCallback((splineApp: SplineApplication) => {
    console.log('Spline scene loaded')
    setSpline(splineApp)
    setIsLoading(false)

    // Try to find the robot object
    let foundRobot: RobotObject | null = null
    
    for (const name of robotNames) {
      foundRobot = splineApp.findObjectByName(name)
      if (foundRobot) {
        console.log(`Robot found with name: ${name}`)
        setRobot(foundRobot)
        setRobotFound(true)
        
        // Store original transform
        originalTransform.current = {
          position: [0, 0, 0], // Default position
          rotation: [0, 0, 0], // Default rotation
          scale: [1, 1, 1]     // Default scale
        }
        break
      }
    }

    if (!foundRobot) {
      console.log('Robot object not found, trying to get all objects')
      const allObjects = splineApp.getAllObjects()
      console.log('Available objects:', allObjects)
      
      // Try the first object if available
      if (allObjects.length > 0) {
        foundRobot = allObjects[0]
        setRobot(foundRobot)
        setRobotFound(true)
        console.log('Using first available object as robot')
      }
    }

    if (!foundRobot) {
      console.log('No robot object found - animations will use fallback methods')
      setRobotFound(false)
    }
  }, [])

  // Cleanup animation
  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    setIsAnimating(false)
  }, [])

  // Reset robot to original position
  const resetRobot = useCallback(() => {
    stopAnimation()
    
    if (robot && originalTransform.current) {
      const { position, rotation, scale } = originalTransform.current
      robot.position.set(position[0], position[1], position[2])
      robot.rotation.set(rotation[0], rotation[1], rotation[2])
      robot.scale.set(scale[0], scale[1], scale[2])
    }
    
    // Try fallback method
    if (spline) {
      spline.emitEvent('mouseDown', 'reset')
    }
  }, [robot, spline, stopAnimation])

  // Wave animation
  const waveAnimation = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    
    let animationTime = 0
    const duration = 4 // 4 cycles
    
    const animate = () => {
      animationTime += 0.1
      
      if (robot) {
        // Gentle swaying motion
        const waveX = Math.sin(animationTime) * 0.1
        const waveY = Math.sin(animationTime * 1.5) * 0.05
        
        robot.rotation.set(waveX, waveY, Math.sin(animationTime * 2) * 0.2)
      }
      
      if (animationTime < duration) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        // Return to original position
        if (robot) {
          robot.rotation.set(0, 0, 0)
        }
        setIsAnimating(false)
      }
    }
    
    animate()
  }, [robot, isAnimating])

  // Dance animation
  const danceAnimation = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    
    let animationTime = 0
    const duration = 8 // 8 cycles
    
    const animate = () => {
      animationTime += 0.1
      
      if (robot) {
        // Bouncy movement
        const bounceY = Math.abs(Math.sin(animationTime * 2)) * 0.3
        const swayX = Math.sin(animationTime) * 0.2
        const spinY = animationTime * 0.5
        
        robot.position.set(swayX, bounceY, 0)
        robot.rotation.set(0, spinY, Math.sin(animationTime * 3) * 0.3)
      }
      
      if (animationTime < duration) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        // Return to original position
        if (robot) {
          robot.position.set(0, 0, 0)
          robot.rotation.set(0, 0, 0)
        }
        setIsAnimating(false)
      }
    }
    
    animate()
  }, [robot, isAnimating])

  // Spin animation
  const spinAnimation = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    
    let animationTime = 0
    const duration = 4 * Math.PI // 2 full rotations
    
    const animate = () => {
      animationTime += 0.1
      
      if (robot) {
        robot.rotation.set(0, animationTime, 0)
      }
      
      if (animationTime < duration) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        // Return to original position
        if (robot) {
          robot.rotation.set(0, 0, 0)
        }
        setIsAnimating(false)
      }
    }
    
    animate()
  }, [robot, isAnimating])

  // Idle float animation
  const idleFloat = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    
    let animationTime = 0
    
    const animate = () => {
      animationTime += 0.05
      
      if (robot) {
        const floatY = Math.sin(animationTime) * 0.1
        robot.position.set(0, floatY, 0)
      }
      
      // Continuous animation
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animate()
  }, [robot, isAnimating])

  // Auto-click animation (random animations)
  const autoClickAnimation = useCallback(() => {
    if (isAnimating) return
    
    const animations = [waveAnimation, danceAnimation, spinAnimation]
    const randomAnimation = animations[Math.floor(Math.random() * animations.length)]
    
    randomAnimation()
    
    // Schedule next random animation
    setTimeout(() => {
      if (!isAnimating) {
        autoClickAnimation()
      }
    }, 3000)
  }, [waveAnimation, danceAnimation, spinAnimation, isAnimating])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAnimation()
    }
  }, [stopAnimation])

  return (
    <div className="relative w-full h-full">
      <Suspense 
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-portfolio-cyan"></div>
          </div>
        }
      >
        <Spline
          scene={scene}
          className={className}
          onLoad={onLoad}
        />
      </Suspense>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-portfolio-black/50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-portfolio-cyan mx-auto mb-4"></div>
            <p className="text-portfolio-text-muted text-sm">Loading 3D Scene...</p>
          </div>
        </div>
      )}

      {/* Control Interface */}
      {showControls && !isLoading && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute bottom-4 left-4 bg-portfolio-black/80 backdrop-blur-sm rounded-lg p-4 border border-portfolio-gray-lighter"
        >
          {/* Status Indicator */}
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-2 h-2 rounded-full ${robotFound ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
            <span className="text-xs text-portfolio-text-muted">
              {robotFound ? 'Robot Ready' : 'Fallback Mode'}
            </span>
          </div>

          {/* Control Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <motion.button
              onClick={waveAnimation}
              disabled={isAnimating}
              className="flex items-center gap-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-3 h-3" />
              Wave
            </motion.button>

            <motion.button
              onClick={danceAnimation}
              disabled={isAnimating}
              className="flex items-center gap-1 px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 text-xs rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Music className="w-3 h-3" />
              Dance
            </motion.button>

            <motion.button
              onClick={spinAnimation}
              disabled={isAnimating}
              className="flex items-center gap-1 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 text-xs rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw className="w-3 h-3" />
              Spin
            </motion.button>

            <motion.button
              onClick={autoClickAnimation}
              disabled={isAnimating}
              className="flex items-center gap-1 px-3 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 text-xs rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap className="w-3 h-3" />
              Auto
            </motion.button>
          </div>

          {/* Reset Button */}
          <motion.button
            onClick={resetRobot}
            className="w-full mt-2 flex items-center justify-center gap-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs rounded-md transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </motion.button>

          {/* Instructions Toggle */}
          <motion.button
            onClick={() => setShowInstructions(!showInstructions)}
            className="w-full mt-2 flex items-center justify-center gap-1 px-3 py-1 text-portfolio-text-muted hover:text-portfolio-cyan text-xs transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-3 h-3" />
            {showInstructions ? 'Hide' : 'Show'} Instructions
          </motion.button>
        </motion.div>
      )}

      {/* Instructions Overlay */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute top-4 right-4 bg-portfolio-black/90 backdrop-blur-sm rounded-lg p-4 border border-portfolio-gray-lighter max-w-xs"
          >
            <h3 className="text-portfolio-cyan text-sm font-semibold mb-2">Interactive Robot</h3>
            <div className="text-xs text-portfolio-text-muted space-y-1">
              <p><span className="text-blue-400">Wave:</span> Gentle swaying motion</p>
              <p><span className="text-purple-400">Dance:</span> Bouncy movement with spin</p>
              <p><span className="text-green-400">Spin:</span> Smooth 360° rotation</p>
              <p><span className="text-yellow-400">Auto:</span> Random animations</p>
              <p><span className="text-red-400">Reset:</span> Return to original position</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
