export function DeviceShowcase() {
  return (
    <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-6 md:p-8 relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-96">
        {/* Badge */}
        <div className="mb-6 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-white text-xs font-medium">
          X-boost mode
        </div>

        {/* Device Image Placeholder */}
        <div className="w-full max-w-xs h-64 bg-gradient-to-b from-neutral-800 to-neutral-900 rounded-xl border border-orange-500/20 flex items-center justify-center mb-8 relative">
          <div className="text-center">
            <div className="text-6xl mb-2">🔋</div>
            <div className="text-neutral-400 text-sm">ZEUS-X Device</div>
          </div>
          {/* Accent glow */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-500/10 to-transparent pointer-events-none" />
        </div>

        {/* Power Control */}
        <div className="flex items-center justify-center gap-8">
          <div>
            <div className="text-neutral-500 text-sm uppercase tracking-wide">POWER</div>
            <div className="w-16 h-16 rounded-full border-4 border-neutral-700 flex items-center justify-center cursor-pointer hover:border-orange-500 transition">
              <div className="w-12 h-12 rounded-full border-2 border-orange-500 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <span className="text-orange-500 text-xl">●</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-white font-bold uppercase text-sm hover:text-orange-500 transition">ON</button>
            <button className="text-neutral-500 font-bold uppercase text-sm hover:text-orange-500 transition">
              OFF
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
