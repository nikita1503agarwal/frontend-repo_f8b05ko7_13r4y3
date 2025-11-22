import { useEffect, useMemo, useRef, useState } from 'react'

const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

function Marker({ station, onClick }) {
  return (
    <div
      onClick={() => onClick(station)}
      className="absolute -translate-x-1/2 -translate-y-full cursor-pointer"
      style={{ left: station._px?.x, top: station._px?.y }}
    >
      <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded shadow">
        ⚡ {station.power_kw || 7}kW
      </div>
    </div>
  )
}

export default function Map({ center = { lat: 20.5937, lng: 78.9629 }, zoom = 5, stations, onMarkerClick }) {
  const mapRef = useRef(null)
  const [size, setSize] = useState({ width: 800, height: 600 })

  useEffect(() => {
    const handle = () => {
      if (!mapRef.current) return
      const rect = mapRef.current.getBoundingClientRect()
      setSize({ width: rect.width, height: rect.height })
    }
    handle()
    window.addEventListener('resize', handle)
    return () => window.removeEventListener('resize', handle)
  }, [])

  // Simple mercator projection to map lat/lng to pixels
  const project = (lat, lng, z) => {
    const tileSize = 256
    const scale = tileSize * Math.pow(2, z)
    const x = (lng + 180) / 360 * scale
    const sinLat = Math.sin(lat * Math.PI / 180)
    const y = (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale
    return { x, y }
  }

  const centerPx = useMemo(() => project(center.lat, center.lng, zoom), [center, zoom])

  // Compute visible tiles
  const tiles = useMemo(() => {
    const tileSize = 256
    const scale = Math.pow(2, zoom)
    const cols = Math.ceil(size.width / tileSize) + 2
    const rows = Math.ceil(size.height / tileSize) + 2
    const startX = Math.floor(centerPx.x / tileSize) - Math.floor(cols / 2)
    const startY = Math.floor(centerPx.y / tileSize) - Math.floor(rows / 2)

    const list = []
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const tx = startX + x
        const ty = startY + y
        const left = (tx * tileSize) - centerPx.x + size.width / 2
        const top = (ty * tileSize) - centerPx.y + size.height / 2
        list.push({ x: tx, y: ty, left, top, url: TILE_URL.replace('{s}', 'a').replace('{z}', zoom).replace('{x}', tx).replace('{y}', ty) })
      }
    }
    return list
  }, [centerPx, size, zoom])

  // Position stations
  const positioned = useMemo(() => {
    if (!stations) return []
    return stations.map(s => {
      const p = project(s.latitude, s.longitude, zoom)
      return { ...s, _px: { x: p.x - centerPx.x + size.width / 2, y: p.y - centerPx.y + size.height / 2 } }
    })
  }, [stations, centerPx, size, zoom])

  return (
    <div ref={mapRef} className="w-full h-full relative overflow-hidden bg-slate-200">
      {tiles.map((t, i) => (
        <img key={i} src={t.url} className="absolute" style={{ left: t.left, top: t.top, width: 256, height: 256 }} alt="tile" />
      ))}

      {positioned.map((st, idx) => (
        <Marker key={idx} station={st} onClick={onMarkerClick} />
      ))}
    </div>
  )
}
