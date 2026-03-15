import React from 'react'

/**
 * Consistent section wrapper for homepage layout.
 * Provides spacing, max-width, and semantic structure.
 */
const Section = ({
  children,
  className = '',
  /** 'tight' | 'normal' | 'wide' | 'full' - controls max-width and padding */
  width = 'normal',
  /** Section spacing: 'sm' | 'md' | 'lg' | 'xl' */
  spacing = 'lg',
  /** Optional id for anchor links */
  id,
  /** Optional background: 'white' | 'gray' | 'transparent' */
  background = 'transparent',
  /** Remove bottom border */
  noBorder = false,
}) => {
  const widthClasses = {
    tight: 'max-w-4xl mx-auto px-4 sm:px-6',
    normal: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    wide: 'max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10',
    full: 'w-full px-4 sm:px-6 lg:px-8',
  }
  const spacingClasses = {
    sm: 'py-12 sm:py-16',
    md: 'py-14 sm:py-16 md:py-20',
    lg: 'py-16 sm:py-20 md:py-24',
    xl: 'py-20 sm:py-24 md:py-28',
  }
  const bgClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    transparent: '',
  }

  return (
    <section
      id={id}
      className={`
        ${spacingClasses[spacing]}
        ${bgClasses[background]}
        ${!noBorder ? 'border-b border-gray-200 last:border-b-0' : ''}
        ${className}
      `}
    >
      <div className={widthClasses[width]}>{children}</div>
    </section>
  )
}

export default Section
