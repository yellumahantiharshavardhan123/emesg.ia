import { ButtonHTMLAttributes } from 'react'

export default function Button({ variant = 'primary', className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' }) {
  const base = variant === 'primary' ? 'btn-primary' : 'btn-outline'
  return <button {...props} className={`${base} ${className}`} />
}
