import { useEffect, useState } from 'react'

export default function Sidebar({ onFiltersChange, onLocate, loading }) {
  const [connector, setConnector] = useState('')
  const [minPower, setMinPower] = useState('')
  const [city, setCity] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    const t = setTimeout(() => {
      onFiltersChange({ connector, min_power: minPower, city, q: query })
    }, 300)
    return () => clearTimeout(t)
  }, [connector, minPower, city, query])

  return (
    <div className="w-full md:w-80 bg-white/80 backdrop-blur border-r border-slate-200 p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Find chargers</h2>
        <button onClick={onLocate} className="text-sm px-3 py-1 bg-blue-600 text-white rounded">Locate me</button>
      </div>

      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search name or address" className="w-full px-3 py-2 border rounded" />

      <div className="grid grid-cols-2 gap-3">
        <select value={connector} onChange={e => setConnector(e.target.value)} className="px-3 py-2 border rounded">
          <option value="">Any connector</option>
          <option>CCS2</option>
          <option>CHAdeMO</option>
          <option>Type2</option>
          <option>Tesla</option>
          <option>GB/T</option>
        </select>

        <select value={minPower} onChange={e => setMinPower(e.target.value)} className="px-3 py-2 border rounded">
          <option value="">Any power</option>
          <option value="7">7+ kW</option>
          <option value="22">22+ kW</option>
          <option value="50">50+ kW</option>
          <option value="100">100+ kW</option>
        </select>
      </div>

      <input value={city} onChange={e => setCity(e.target.value)} placeholder="City" className="w-full px-3 py-2 border rounded" />

      <div className="text-sm text-slate-600">{loading ? 'Loading stations…' : ''}</div>

      <div className="mt-auto text-xs text-slate-500">
        Data is demo only. Add real stations via the backend seed endpoint.
      </div>
    </div>
  )
}
