import { Header } from "@/components/header"
import { EnergyFlow } from "@/components/energy-flow"
import { Details } from "@/components/details"
import { ChargerConnector } from "@/components/charger-connector"
import { DeviceShowcase } from "@/components/device-showcase"
import { ChargingMode } from "@/components/charging-mode"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Energy Flow - spans full width on mobile, 2 cols on desktop */}
          <div className="lg:col-span-2">
            <EnergyFlow />
          </div>

          {/* Device Showcase - spans 1 col */}
          <DeviceShowcase />

          {/* Details Card - spans 1 col */}
          <Details />

          {/* Charger Connector - spans 1 col */}
          <ChargerConnector />

          {/* Charging Mode - spans 1 col */}
          <ChargingMode />
        </div>
      </main>
    </div>
  )
}
