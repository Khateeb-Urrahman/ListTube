"use client"

import { useState } from "react"

export function ChargingMode() {
  const [progress, setProgress] = useState(74)

  return (
    <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-6 md:p-8 lg:col-span-2">
      <h2 className="text-2xl font-bold text-white mb-8 uppercase tracking-wider">Charging Mode</h2>

      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Circular Progress */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-48 h-48">
            {/* Background circle */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="none" stroke="#404040" strokeWidth="8" />
            </svg>

            {/* Progress circle */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
              <defs>
                <linearGradient id="chargeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
              </defs>
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="url(#chargeGradient)"
                strokeWidth="8"
                strokeDasharray={`${(progress / 100) * 565} 565`}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
              />
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-6xl font-bold text-white">{progress}%</div>
              <div className="text-neutral-500 text-sm uppercase tracking-wide">Charged</div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="flex-1 space-y-6">
          {/* Percentage indicators */}
          <div className="space-y-2">
            <div className="text-right text-neutral-400 text-sm">0%</div>
            <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-right text-neutral-400 text-sm">100%</div>
          </div>

          {/* Power specifications */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-800">
            <div>
              <div className="text-neutral-500 text-xs uppercase tracking-wide mb-1">Power</div>
              <div className="text-white font-bold text-lg">5A / 220V</div>
            </div>
            <div>
              <div className="text-neutral-500 text-xs uppercase tracking-wide mb-1">Input</div>
              <div className="text-white font-bold text-lg">200 KWH</div>
            </div>
          </div>

          {/* Action Button */}
          <button className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase rounded-lg transition">
            Optimize Charging
          </button>
        </div>
      </div>
    </div>
  )
}
