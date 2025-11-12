export function Details() {
  return (
    <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">Details</h2>

      <div className="space-y-6">
        {/* Mode */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-neutral-500 text-xs uppercase tracking-wide mb-2">Mode</div>
            <div className="flex items-center gap-2">
              <span className="text-orange-500">⚡</span>
              <span className="text-white font-bold">X-BOOST</span>
            </div>
          </div>
          <div>
            <div className="text-neutral-500 text-xs uppercase tracking-wide mb-2">Time</div>
            <div className="flex items-center gap-2">
              <span>🕐</span>
              <span className="text-white font-bold">3H 15M</span>
            </div>
          </div>
        </div>

        {/* Frequency */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-neutral-500 text-xs uppercase tracking-wide mb-2">Frequency</div>
            <div className="flex items-center gap-2">
              <span className="text-orange-500">⚙️</span>
              <span className="text-white font-bold">50 HZ</span>
            </div>
          </div>
          <div>
            <div className="text-neutral-500 text-xs uppercase tracking-wide mb-2">Temp</div>
            <div className="flex items-center gap-2">
              <span>🌡️</span>
              <span className="text-white font-bold">30°C</span>
            </div>
          </div>
        </div>

        {/* Ampere */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-neutral-500 text-xs uppercase tracking-wide mb-2">Ampere</div>
            <div className="flex items-center gap-2">
              <span className="text-orange-500">●</span>
              <span className="text-white font-bold">600A</span>
            </div>
          </div>
          <div>
            <div className="text-neutral-500 text-xs uppercase tracking-wide mb-2">Current</div>
            <div className="flex items-center gap-2">
              <span>⚙️</span>
              <span className="text-white font-bold">10A</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
