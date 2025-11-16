import { Star } from 'lucide-react'

export default function ProductCard({ product, onAdd }) {
  const img = product.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop'
  return (
    <div className="group relative rounded-2xl p-4 bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg hover:shadow-2xl transition overflow-hidden">
      <div className="aspect-square rounded-xl overflow-hidden ring-1 ring-white/60 bg-white/40">
        <img src={img} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition" />
      </div>
      <div className="mt-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-slate-900 line-clamp-1">{product.name}</h3>
          <p className="font-bold text-slate-900">${product.price?.toFixed(2)}</p>
        </div>
        <p className="text-xs text-slate-600 mt-1">{product.brand} · {product.style}</p>
        <div className="mt-2 flex items-center gap-1 text-amber-500">
          <Star size={14} fill="currentColor" className="opacity-80"/>
          <span className="text-xs text-slate-700">{product.rating?.average ?? 0} ({product.rating?.count ?? 0})</span>
        </div>
        <button onClick={() => onAdd(product)} className="mt-3 w-full rounded-xl bg-slate-900 text-white py-2 text-sm shadow hover:shadow-md">Add to cart</button>
      </div>
      <div className="absolute -inset-1 bg-gradient-to-br from-white/40 to-transparent rounded-3xl pointer-events-none"/>
    </div>
  )
}
