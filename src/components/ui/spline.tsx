
'use client'

import { Suspense, lazy } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
  onLoad?: () => void
  pauseAfterLoad?: boolean
}

export function SplineScene({ scene, className, onLoad, pauseAfterLoad = false }: SplineSceneProps) {
  return (
    <Suspense 
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      }
    >
      <Spline
        scene={scene}
        className={className}
        renderOnDemand
        onLoad={(application) => {
          onLoad?.()
          if (pauseAfterLoad) requestAnimationFrame(() => application.stop())
        }}
      />
    </Suspense>
  )
}
