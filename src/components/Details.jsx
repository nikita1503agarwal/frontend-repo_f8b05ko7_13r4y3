export default function Details({ station, onClose }) {
  if (!station) return null
  return (
    <div className="absolute right-4 top-4 w-80 bg-white/95 backdrop-blur border border-slate-200 rounded-lg shadow-lg p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h3 className="text-lg font-semibold">{station.name}</h3>
          <p className="text-sm text-slate-600">{station.address || ''}</p>
          <p className="text-xs text-slate-500">{station.city}{station.state ? ', ' + station.state : ''}</p>
        </div>
        <button onClick={onClose} className="px-2 py-1 text-sm rounded bg-slate-200">Close</button>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="p-2 bg-slate-50 rounded border">
          <div className="text-slate-500">Power</div>
          <div className="font-semibold">{station.power_kw || '—'} kW</div>
        </div>
        <div className="p-2 bg-slate-50 rounded border">
          <div className="text-slate-500">Connectors</div>
          <div className="font-semibold">{(station.connectors || []).join(', ') || '—'}</div>
        </div>
        <div className="p-2 bg-slate-50 rounded border">
          <div className="text-slate-500">Price</div>
          <div className="font-semibold">{station.price || '—'}</div>
        </div>
        <div className="p-2 bg-slate-50 rounded border">
          <div className="text-slate-500">Availability</div>
          <div className="font-semibold">{station.available === false ? 'Unavailable' : 'Available'}</div>
        </div>
      </div>

      {station.amenities && station.amenities.length > 0 && (
        <div className="mt-3 text-sm">
          <div className="text-slate-500">Amenities</div>
          <div>{station.amenities.join(', ')}</div>
        </div>
      )}

      <a
        className="mt-4 inline-flex items-center justify-center w-full bg-blue-600 text-white rounded py-2"
        href={`https://www.google.com/maps?q=${station.latitude},${station.longitude}`}
        target="_blank"
        rel="noreferrer"
      >
        Navigate
      </a>
    </div>
  )
}
