export function ChargerConnector() {
  return (
    <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-6">
      <div className="flex flex-col items-center justify-center h-full">
        {/* Connector Illustration */}
        <div className="relative w-32 h-32 mb-6">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            {/* Outer ring */}
            <circle cx="60" cy="60" r="45" fill="none" stroke="#525252" strokeWidth="2" />
            {/* Orange connector ring */}
            <circle cx="60" cy="60" r="35" fill="none" stroke="#f97316" strokeWidth="3" />
            {/* Center dot */}
            <circle cx="60" cy="60" r="8" fill="#f97316" />
            {/* Pins */}
            <circle cx="35" cy="60" r="3" fill="#f97316" />
            <circle cx="85" cy="60" r="3" fill="#f97316" />
            <circle cx="60" cy="35" r="3" fill="#f97316" />
            <circle cx="60" cy="85" r="3" fill="#f97316" />
          </svg>
        </div>

        {/* Specifications */}
        <div className="text-center space-y-3">
          <div>
            <div className="text-orange-500 text-sm font-bold">⚡ 1w</div>
            <div className="text-neutral-400 text-xs uppercase tracking-wide">Ø 15</div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <div className="h-px bg-orange-500 w-8"></div>
            <span className="text-orange-500 text-xs uppercase font-bold">FLASH MODE</span>
            <div className="h-px bg-orange-500 w-8"></div>
          </div>

          <div>
            <span className="text-white font-bold uppercase tracking-wider">CABEL</span>
          </div>

          <div className="flex items-center justify-between w-full mt-4 pt-4 border-t border-neutral-800">
            <span className="text-neutral-500 text-xs">AC 23.8V</span>
            <span className="text-white text-xs font-bold">DC 14V</span>
          </div>

          <button className="text-orange-500 text-xs font-bold uppercase mt-2 hover:text-orange-400 transition">
            Details →
          </button>
        </div>

        {/* Toggle Switch */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="text-white text-xs font-bold">ON</span>
          <div className="w-10 h-6 bg-orange-500 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
