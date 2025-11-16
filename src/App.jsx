import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import ProductCard from './components/ProductCard'
import Filters from './components/Filters'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function useQueryParams(params) {
  return new URLSearchParams(Object.entries(params).filter(([_, v]) => v !== undefined && v !== ''))
}

function App() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState({})
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState({ items: [], total: 0 })
  const [sessionId] = useState(() => {
    const v = localStorage.getItem('sid')
    if (v) return v
    const n = Math.random().toString(36).slice(2)
    localStorage.setItem('sid', n)
    return n
  })
  const owner = useMemo(() => ({ owner_type: 'session', owner_id: sessionId }), [sessionId])

  const fetchProducts = async (opts = {}) => {
    setLoading(true)
    try {
      const qp = useQueryParams({ q: query, ...filter, ...opts })
      const res = await fetch(`${API}/api/products?${qp.toString()}`)
      const data = await res.json()
      setProducts(data.items || [])
    } catch (e) {
      console.error(e)
    } finally { setLoading(false) }
  }

  const refreshCart = async () => {
    const qp = useQueryParams(owner)
    const res = await fetch(`${API}/api/cart?${qp.toString()}`)
    const data = await res.json()
    setCart({ items: data.items || [], total: data.total || 0 })
  }

  const addToCart = async (p) => {
    const body = {
      ...owner,
      item: { product_id: p.id || p._id || p.product_id, name: p.name, price: p.price, size: p.sizes?.[0] || 9, qty: 1, image: p.images?.[0] }
    }
    // API expects owner and item separately; send as form-encoded by two fetches or combine? We'll call endpoint with JSON body split by server using query params isn't supported, adjust to server contract
  }

  // Adapt to server: POST to /api/cart/add with JSON: { owner:{owner_type,owner_id}, item:{...}}
  const addToCartServer = async (p) => {
    const payload = {
      owner_type: owner.owner_type,
      owner_id: owner.owner_id,
      product_id: p.id || p._id,
      name: p.name,
      price: p.price,
      size: p.sizes?.[0] || 9,
      qty: 1,
      image: p.images?.[0]
    }
    await fetch(`${API}/api/cart/add?owner_type=${owner.owner_type}&owner_id=${owner.owner_id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: payload.product_id,
        name: payload.name,
        price: payload.price,
        size: payload.size,
        qty: payload.qty,
        image: payload.image
      })
    })
    await refreshCart()
  }

  useEffect(() => {
    fetchProducts()
    refreshCart()
  }, [])

  useEffect(() => {
    const id = setTimeout(() => fetchProducts(), 200)
    return () => clearTimeout(id)
  }, [query, filter])

  const brands = useMemo(() => Array.from(new Set(products.map(p => p.brand))).filter(Boolean), [products])
  const styles = useMemo(() => Array.from(new Set(products.map(p => p.style))).filter(Boolean), [products])
  const sizes = useMemo(() => Array.from(new Set(products.flatMap(p => p.sizes || []))).sort((a,b)=>a-b), [products])

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50">
      <Header onCartClick={() => alert('Cart items: ' + cart.items.length)} onSearch={setQuery} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <section className="mb-6">
          <div className="p-5 rounded-3xl border border-white/60 bg-white/40 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">Find your perfect pair</h2>
              <span className="text-sm text-slate-600">{loading ? 'Loading...' : `${products.length} results`}</span>
            </div>
            <Filters brands={brands} styles={styles} sizes={sizes} current={filter} onChange={setFilter} />
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => (
            <ProductCard key={p.id || p._id} product={p} onAdd={addToCartServer} />
          ))}
        </section>

        {products.length === 0 && !loading && (
          <div className="text-center text-slate-600 py-20">No products yet. Click the button below to seed sample shoes.</div>
        )}

        <div className="mt-8 flex justify-center">
          <button onClick={async () => { await fetch(`${API}/api/seed`, { method: 'POST' }); fetchProducts(); }} className="rounded-full bg-slate-900 text-white px-5 py-2 shadow hover:shadow-md">
            Seed Sample Products
          </button>
        </div>
      </main>

      <footer className="py-10 text-center text-sm text-slate-600">
        Built with a modern glassmorphic design for a smooth shopping experience.
      </footer>
    </div>
  )
}

export default App
