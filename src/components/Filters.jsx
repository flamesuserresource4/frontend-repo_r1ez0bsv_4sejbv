export default function Filters({ brands, styles, sizes, current, onChange }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <select className="bg-white/60 backdrop-blur rounded-xl px-3 py-2 ring-1 ring-white/50" value={current.brand || ''} onChange={e=>onChange({ ...current, brand: e.target.value || undefined })}>
        <option value="">All Brands</option>
        {brands.map(b => <option key={b} value={b}>{b}</option>)}
      </select>
      <select className="bg-white/60 backdrop-blur rounded-xl px-3 py-2 ring-1 ring-white/50" value={current.style || ''} onChange={e=>onChange({ ...current, style: e.target.value || undefined })}>
        <option value="">All Styles</option>
        {styles.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <select className="bg-white/60 backdrop-blur rounded-xl px-3 py-2 ring-1 ring-white/50" value={current.size || ''} onChange={e=>onChange({ ...current, size: e.target.value ? Number(e.target.value) : undefined })}>
        <option value="">Any Size</option>
        {sizes.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <div className="flex items-center gap-2">
        <input type="number" placeholder="Min $" className="w-full bg-white/60 backdrop-blur rounded-xl px-3 py-2 ring-1 ring-white/50" value={current.min_price ?? ''} onChange={e=>onChange({ ...current, min_price: e.target.value ? Number(e.target.value) : undefined })} />
        <input type="number" placeholder="Max $" className="w-full bg-white/60 backdrop-blur rounded-xl px-3 py-2 ring-1 ring-white/50" value={current.max_price ?? ''} onChange={e=>onChange({ ...current, max_price: e.target.value ? Number(e.target.value) : undefined })} />
      </div>
    </div>
  )
}
