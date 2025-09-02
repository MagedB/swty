
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { useAuth } from '../context/AuthContext'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [params, setParams] = useSearchParams()
  const { API } = useAuth()

  const current = params.get('category') || 'smart'
  const tabs = [
    { key: 'smart', label: 'Smart device' },
    { key: 'fashion', label: 'Fashion' },
    { key: 'cars', label: 'Cars' },
  ]

  useEffect(() => {
    setLoading(true)
    fetch(`${API}/api/products?category=${current}`)
      .then(r => r.json())
      .then(d => { setProducts(d); setLoading(false); })
      .catch(e => { setError(String(e)); setLoading(false); })
  }, [current, API])

  return (
    <div>
      <h1>Products</h1>
      <div className="tabs">
        {tabs.map(t => (
          <button key={t.key}
            className={`tab ${current===t.key ? 'active':''}`}
            onClick={() => setParams({ category: t.key })}
          >
            {t.label}
          </button>
        ))}
      </div>
      {loading ? <p>Loading…</p> : error ? <p>{error}</p> : (
        <div className="grid">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
