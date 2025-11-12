"use client"

import { Plus } from "lucide-react"

export function EnergyFlow() {
  return (
    <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-6 md:p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            ENERGY
            <br />
            FLOW
          </h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-full text-white text-sm font-medium transition">
          ADD PORT
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between h-64">
        {/* Output Section */}
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 rounded-lg p-4 text-white text-center">
            <div className="text-2xl font-bold">39</div>
            <div className="text-xs uppercase">KWH</div>
          </div>
          <div className="bg-orange-500 rounded-full p-3 flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <span className="text-orange-500 text-sm font-bold">+</span>
            </div>
          </div>
        </div>

        {/* SVG Visualization - Energy Flow Lines */}
        <svg className="flex-1 h-full" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
          {/* Orange flow lines */}
          <path d="M 20 60 Q 60 40, 120 50" stroke="#f97316" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M 20 100 Q 60 100, 120 100" stroke="#ea580c" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M 20 140 Q 60 160, 120 150" stroke="#f97316" strokeWidth="8" fill="none" strokeLinecap="round" />

          {/* Gray flow lines */}
          <path d="M 120 50 Q 160 60, 200 100" stroke="#6b7280" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M 120 100 Q 160 100, 200 140" stroke="#6b7280" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M 120 150 Q 160 150, 200 160" stroke="#6b7280" strokeWidth="8" fill="none" strokeLinecap="round" />

          {/* Accent bars */}
          <rect x="115" y="45" width="10" height="30" fill="#f97316" rx="2" />
          <rect x="115" y="130" width="10" height="30" fill="#f97316" rx="2" />
        </svg>

        {/* Power Ports Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-neutral-500 text-xs uppercase tracking-wide">Main AC</div>
              <div className="text-white font-bold text-lg">30 KWH</div>
            </div>
            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-neutral-500 text-xs uppercase tracking-wide">Sec AC</div>
              <div className="text-neutral-600 font-bold text-lg">0 KWH</div>
            </div>
            <div className="w-4 h-4 bg-neutral-700 rounded-full"></div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-neutral-500 text-xs uppercase tracking-wide">USB-C</div>
              <div className="text-neutral-600 font-bold text-lg">0 KWH</div>
            </div>
            <div className="w-4 h-4 bg-neutral-700 rounded-full"></div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-neutral-500 text-xs uppercase tracking-wide">USB-C</div>
              <div className="text-white font-bold text-lg">8 KWH</div>
            </div>
            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-neutral-500 text-xs uppercase tracking-wide">USB-A</div>
              <div className="text-neutral-600 font-bold text-lg">0 KWH</div>
            </div>
            <div className="w-4 h-4 bg-neutral-700 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Battery Life */}
      <div className="mt-8 flex items-center gap-4">
        <div>
          <div className="text-5xl font-bold text-white">12</div>
          <div className="text-xs uppercase text-neutral-500 tracking-wide">HR</div>
          <div className="text-xs uppercase text-neutral-500 tracking-wide">BATTERY LIFE</div>
        </div>
        <div className="flex items-center gap-2 ml-6">
          <div className="text-orange-500 text-2xl">📈</div>
          <div className="text-neutral-400 uppercase text-sm font-medium">MEDIUM LOAD</div>
        </div>
      </div>
    </div>
  )
}
