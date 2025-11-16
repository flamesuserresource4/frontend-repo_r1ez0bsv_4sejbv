import { useEffect, useState } from 'react'
import { ShoppingCart, Search, Sparkles } from 'lucide-react'

export default function Header({ onCartClick, onSearch, initialQuery = '' }) {
  const [q, setQ] = useState(initialQuery)

  useEffect(() => {
    const id = setTimeout(() => onSearch(q), 300)
    return () => clearTimeout(id)
  }, [q])

  return (
    <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/40 border-b border-white/30">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-400 shadow-lg shadow-sky-200/50 flex items-center justify-center text-white">
            <Sparkles size={18} />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">GlassKick</span>
        </div>
        <div className="flex-1" />
        <div className="hidden md:flex items-center bg-white/60 backdrop-blur rounded-full px-3 py-2 ring-1 ring-white/50 shadow-sm max-w-md w-full">
          <Search className="text-slate-500" size={18} />
          <input
            className="flex-1 bg-transparent outline-none px-2 text-sm"
            placeholder="Search shoes, brands, styles..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <button onClick={onCartClick} className="ml-3 inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-4 py-2 shadow-lg hover:shadow-xl transition">
          <ShoppingCart size={18} />
          <span className="hidden sm:inline">Cart</span>
        </button>
      </div>
    </header>
  )
}
