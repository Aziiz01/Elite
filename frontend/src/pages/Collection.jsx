import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useSearchParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import ProductItem from '../components/ProductItem'

const ChevronDown = ({ open }) => (
  <svg
    className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
    strokeWidth={2}
  >
    <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
  </svg>
)

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className='border-b border-[#e5e5e5]'>
      <button
        type='button'
        onClick={() => setOpen((o) => !o)}
        className='flex w-full items-center justify-between py-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#111] cursor-pointer'
      >
        {title}
        <ChevronDown open={open} />
      </button>
      {open && <div className='pb-4'>{children}</div>}
    </div>
  )
}

const Collection = () => {
  const [searchParams] = useSearchParams()
  const { products, search, showSearch } = useContext(ShopContext)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [filterProducts, setFilterProducts] = useState([])
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [sortType, setSortType] = useState('relevant')
  const [bestsellerOnly, setBestsellerOnly] = useState(false)
  const [newOnly, setNewOnly] = useState(false)
  const [dealOnly, setDealOnly] = useState(false)

  const { filterCategories, filterSubcategories } = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category).filter(Boolean))].sort()
    const subs = [...new Set(products.map((p) => p.subCategory).filter(Boolean))].sort()
    return { filterCategories: cats, filterSubcategories: subs }
  }, [products])

  useEffect(() => {
    const cat = searchParams.get('category')
    const sub = searchParams.get('subCategory')
    const best = searchParams.get('bestseller')
    const newParam = searchParams.get('new')
    const dealParam = searchParams.get('deal')
    setCategory(cat ? [cat] : [])
    setSubCategory(sub ? [sub] : [])
    setBestsellerOnly(best === '1' || best === 'true')
    setNewOnly(newParam === '1' || newParam === 'true')
    setDealOnly(dealParam === '1' || dealParam === 'true')
  }, [searchParams])

  const toggleCategory = (val) =>
    setCategory((prev) => (prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]))

  const toggleSubCategory = (val) =>
    setSubCategory((prev) => (prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]))

  const applyFilter = () => {
    let list = products.slice()
    if (showSearch && search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    if (category.length > 0) list = list.filter((p) => p.category && category.includes(p.category))
    if (subCategory.length > 0) list = list.filter((p) => p.subCategory && subCategory.includes(p.subCategory))
    if (bestsellerOnly) list = list.filter((p) => p.bestseller === true)
    if (newOnly) list = list.filter((p) => p.date && Date.now() - Number(p.date) < 86400000)
    if (dealOnly) list = list.filter((p) => p.newPrice != null && p.newPrice !== '' && Number(p.newPrice) < Number(p.price))
    setFilterProducts(list)
  }

  const sortProduct = () => {
    const getDisplayPrice = (p) => (p.newPrice != null && p.newPrice !== '' ? p.newPrice : p.price)
    setFilterProducts((prev) => {
      const copy = prev.slice()
      if (sortType === 'low-high') return copy.sort((a, b) => getDisplayPrice(a) - getDisplayPrice(b))
      if (sortType === 'high-low') return copy.sort((a, b) => getDisplayPrice(b) - getDisplayPrice(a))
      return copy
    })
  }

  useEffect(() => { applyFilter() }, [category, subCategory, search, showSearch, products, bestsellerOnly, newOnly, dealOnly])
  useEffect(() => { if (sortType !== 'relevant') sortProduct() }, [sortType])

  const activeFilterCount =
    category.length + subCategory.length + (bestsellerOnly ? 1 : 0) + (newOnly ? 1 : 0) + (dealOnly ? 1 : 0)

  const clearAll = () => {
    setCategory([])
    setSubCategory([])
    setBestsellerOnly(false)
    setNewOnly(false)
    setDealOnly(false)
  }

  const FilterPanel = () => (
    <div>
      <FilterSection title='Catégories'>
        <div className='flex flex-col gap-2.5'>
          {filterCategories.map((c) => (
            <label key={c} className='flex items-center gap-2.5 cursor-pointer group'>
              <input
                type='checkbox'
                value={c}
                checked={category.includes(c)}
                onChange={() => toggleCategory(c)}
                className='w-3.5 h-3.5 accent-[#111] cursor-pointer'
              />
              <span className='text-[13px] text-[#555] group-hover:text-[#111] transition-colors'>{c}</span>
            </label>
          ))}
          {filterCategories.length === 0 && <p className='text-[12px] text-[#aaa]'>Aucune catégorie</p>}
        </div>
      </FilterSection>

      {filterSubcategories.length > 0 && (
        <FilterSection title='Sous-type'>
          <div className='flex flex-col gap-2.5'>
            {filterSubcategories.map((s) => (
              <label key={s} className='flex items-center gap-2.5 cursor-pointer group'>
                <input
                  type='checkbox'
                  value={s}
                  checked={subCategory.includes(s)}
                  onChange={() => toggleSubCategory(s)}
                  className='w-3.5 h-3.5 accent-[#111] cursor-pointer'
                />
                <span className='text-[13px] text-[#555] group-hover:text-[#111] transition-colors'>{s}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      <FilterSection title='Spécial'>
        <div className='flex flex-col gap-2.5'>
          {[
            { label: 'Meilleures ventes', val: bestsellerOnly, set: setBestsellerOnly },
            { label: 'Nouveautés', val: newOnly, set: setNewOnly },
            { label: 'Promotions', val: dealOnly, set: setDealOnly },
          ].map(({ label, val, set }) => (
            <label key={label} className='flex items-center gap-2.5 cursor-pointer group'>
              <input
                type='checkbox'
                checked={val}
                onChange={() => set((o) => !o)}
                className='w-3.5 h-3.5 accent-[#111] cursor-pointer'
              />
              <span className='text-[13px] text-[#555] group-hover:text-[#111] transition-colors'>{label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {activeFilterCount > 0 && (
        <button
          type='button'
          onClick={clearAll}
          className='mt-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#888] hover:text-[#111] transition-colors underline cursor-pointer'
        >
          Réinitialiser ({activeFilterCount})
        </button>
      )}
    </div>
  )

  return (
    <div className='pt-8'>
      <Helmet>
        <title>Toutes les collections | Elite</title>
        <meta name='description' content='Parcourez notre catalogue maquillage et soins. Filtrez par catégorie, triez par prix.' />
      </Helmet>

      {/* Page header */}
      <div className='mb-8 flex items-end justify-between border-b border-[#e5e5e5] pb-6'>
        <div>
          <p className='section-eyebrow mb-2'>Catalogue</p>
          <h1 className='text-2xl font-bold text-[#111] sm:text-3xl'>Toutes les collections</h1>
          <p className='mt-1 text-[12px] text-[#aaa]'>{filterProducts.length} produit{filterProducts.length !== 1 ? 's' : ''}</p>
        </div>

        <div className='flex items-center gap-3'>
          {/* Mobile filter toggle */}
          <button
            type='button'
            onClick={() => setMobileFiltersOpen(true)}
            className='lg:hidden flex items-center gap-1.5 border border-[#e5e5e5] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#555] hover:border-[#111] hover:text-[#111] transition-colors cursor-pointer'
          >
            Filtres {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>

          {/* Sort */}
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className='border border-[#e5e5e5] bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#555] focus:border-[#111] focus:outline-none transition-colors cursor-pointer'
          >
            <option value='relevant'>Pertinent</option>
            <option value='low-high'>Prix croissant</option>
            <option value='high-low'>Prix décroissant</option>
          </select>
        </div>
      </div>

      <div className='flex gap-10'>
        {/* Desktop sidebar */}
        <aside className='hidden lg:block w-52 flex-shrink-0'>
          <FilterPanel />
        </aside>

        {/* Product grid */}
        <div className='flex-1 min-w-0'>
          {filterProducts.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-20 text-center'>
              <p className='text-[#111] font-medium mb-2'>Aucun produit trouvé</p>
              <p className='text-[13px] text-[#888] mb-8 max-w-xs'>
                {activeFilterCount > 0 || (showSearch && search)
                  ? 'Essayez d\'ajuster vos filtres ou votre recherche.'
                  : 'Cette collection ne contient pas encore de produits.'}
              </p>
              {activeFilterCount > 0 ? (
                <button type='button' onClick={clearAll} className='btn-primary'>
                  Réinitialiser les filtres
                </button>
              ) : (
                <Link to='/' className='btn-primary'>Retour à l'accueil</Link>
              )}
            </div>
          ) : (
            <div className='grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8'>
              {filterProducts.map((item) => (
                <ProductItem
                  key={item._id}
                  id={item._id}
                  name={item.name}
                  price={item.price}
                  newPrice={item.newPrice}
                  image={item.image}
                  colors={item.colors}
                  inStock={item.inStock}
                  date={item.date}
                  isNew={item.isNew}
                  subCategory={item.subCategory}
                  category={item.category}
                  rating={item.avgRating}
                  reviewCount={item.reviewCount}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <>
          <div
            className='fixed inset-0 z-40 bg-black/40'
            onClick={() => setMobileFiltersOpen(false)}
            aria-hidden='true'
          />
          <div className='fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl flex flex-col'>
            <div className='flex items-center justify-between px-5 h-14 border-b border-[#e5e5e5]'>
              <span className='text-[11px] font-semibold uppercase tracking-[0.2em] text-[#111]'>Filtres</span>
              <button
                type='button'
                onClick={() => setMobileFiltersOpen(false)}
                className='text-[#555] hover:text-[#111] transition-colors cursor-pointer'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.5}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
            <div className='flex-1 overflow-y-auto px-5 py-2'>
              <FilterPanel />
            </div>
            <div className='px-5 py-4 border-t border-[#e5e5e5]'>
              <button
                type='button'
                onClick={() => setMobileFiltersOpen(false)}
                className='btn-primary w-full'
              >
                Voir {filterProducts.length} produit{filterProducts.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Collection
