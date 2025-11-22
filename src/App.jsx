import { useEffect, useMemo, useState } from 'react'
import Map from './components/Map'
import Sidebar from './components/Sidebar'
import Details from './components/Details'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function App() {
  const [stations, setStations] = useState([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)
  const [center, setCenter] = useState({ lat: 20.5937, lng: 78.9629 })
  const [zoom, setZoom] = useState(5)
  const [filters, setFilters] = useState({})

  const fetchStations = async (extra = {}) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      const f = { ...filters, ...extra }
      if (f.connector) params.append('connector', f.connector)
      if (f.min_power) params.append('min_power', f.min_power)
      if (f.city) params.append('city', f.city)
      if (f.q) params.append('q', f.q)
      const res = await fetch(`${BACKEND}/api/stations?${params.toString()}`)
      const data = await res.json()
      setStations(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStations()
  }, [])

  useEffect(() => {
    const t = setTimeout(() => fetchStations(), 200)
    return () => clearTimeout(t)
  }, [filters])

  const handleLocate = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude
      const lng = pos.coords.longitude
      setCenter({ lat, lng })
      setZoom(12)
      try {
        const res = await fetch(`${BACKEND}/api/stations/near?lat=${lat}&lng=${lng}&radius_km=25`)
        const data = await res.json()
        setStations(data)
      } catch (e) {}
    })
  }

  return (
    <div className="min-h-screen w-full flex flex-col">
      <header className="h-14 border-b border-slate-200 flex items-center justify-between px-4 bg-white">
        <div className="font-semibold">Chargeway Map (Demo)</div>
        <div className="text-sm text-slate-600">India EV chargers • Demo data</div>
      </header>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[320px_1fr]">
        <Sidebar onFiltersChange={setFilters} onLocate={handleLocate} loading={loading} />
        <div className="relative">
          <Map center={center} zoom={zoom} stations={stations} onMarkerClick={setSelected} />
          <Details station={selected} onClose={() => setSelected(null)} />
        </div>
      </div>
    </div>
  )
}
