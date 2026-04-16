/* eslint-disable react/prop-types */
import { useState } from 'react'

const PANELS = [
  { key: 'characteristics', label: 'Caractéristiques' },
  { key: 'usageTips', label: "Conseils d'utilisation" },
  { key: 'ingredients', label: 'Ingrédients' },
]

const ProductCharacteristics = ({ productData }) => {
  const [active, setActive] = useState('characteristics')
  const attributes = productData?.productAttributes || {}

  const rows = [
    { label: 'Date de sortie', value: attributes.releaseDate },
    { label: 'Marque', value: attributes.brand },
    { label: 'Gamme', value: attributes.range },
    { label: 'Type de produit', value: attributes.productType },
    { label: 'Classification', value: attributes.classification },
    { label: 'Contenance', value: attributes.content },
    { label: 'Pays', value: attributes.country },
    { label: 'Collection', value: attributes.collection },
    { label: 'Fabricant', value: attributes.manufacturer },
    { label: 'Précautions', value: attributes.precautions },
  ].filter((r) => r.value && String(r.value).trim())

  return (
    <section className='border-t border-[#E5E5E5] py-14 sm:py-16'>
      {/* Header */}
      <div className='mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <span className='section-eyebrow'>Fiche produit</span>
          <h2 className='mt-2 font-display text-2xl font-semibold text-[#1C1917] sm:text-3xl'>
            Caractéristiques
          </h2>
        </div>

        {/* Sub-nav pills */}
        <div className='flex items-center gap-px border border-[#E5E5E5] bg-[#E5E5E5] self-start sm:self-auto'>
          {PANELS.map(({ key, label }) => (
            <button
              key={key}
              type='button'
              onClick={() => setActive(key)}
              className={`px-4 py-2 text-[11px] uppercase tracking-[0.1em] font-medium transition-colors cursor-pointer ${
                active === key
                  ? 'bg-[#1C1917] text-white'
                  : 'bg-white text-[#A8A29E] hover:text-[#1C1917]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Panel content */}
      <div className='border border-[#E5E5E5] bg-white'>
        {active === 'characteristics' && (
          <div className='divide-y divide-[#F0EDE8]'>
            {rows.length > 0 ? (
              rows.map((row) => (
                <div
                  key={row.label}
                  className='grid grid-cols-1 gap-1 px-6 py-4 sm:grid-cols-[180px_1fr] sm:gap-8'
                >
                  <span className='text-[11px] font-medium uppercase tracking-[0.15em] text-[#A8A29E]'>
                    {row.label}
                  </span>
                  <span className='text-sm text-[#1C1917]'>{row.value}</span>
                </div>
              ))
            ) : (
              <p className='px-6 py-8 text-sm text-[#A8A29E]'>
                Les caractéristiques seront bientôt disponibles.
              </p>
            )}
          </div>
        )}

        {active === 'usageTips' && (
          <div className='px-6 py-8'>
            <p className='whitespace-pre-line text-sm leading-[1.8] text-[#57534E]'>
              {attributes.usageTips || "Aucun conseil d'utilisation disponible pour le moment."}
            </p>
          </div>
        )}

        {active === 'ingredients' && (
          <div className='px-6 py-8'>
            <p className='whitespace-pre-line text-sm leading-[1.8] text-[#57534E]'>
              {attributes.ingredients || 'Aucune information sur les ingrédients pour le moment.'}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductCharacteristics
