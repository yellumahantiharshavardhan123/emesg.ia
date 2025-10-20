import { InputHTMLAttributes } from 'react'

export default function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`bg-white/5 border border-white/10 rounded-lg px-3 py-2 ${props.className ?? ''}`} />
}
