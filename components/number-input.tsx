'use client'

import { useState, useRef, useCallback } from "react"
import { formatNumber } from "@/lib/utils"

interface NumberInputProps {
  value: number
  onChange: (value: number) => void
  className?: string
  placeholder?: string
  suffix?: string
  autoShrink?: boolean
}

export function NumberInput({ value, onChange, className = "", placeholder = "0", suffix, autoShrink = false }: NumberInputProps) {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const displayValue = focused ? String(value || 0) : (value ? formatNumber(value) : "")

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\s/g, "").replace(/,/g, ".")
    const num = Number(raw)
    if (!isNaN(num)) onChange(num)
  }, [onChange])

  const numLength = String(Math.abs(value)).length
  const fontSize = autoShrink && numLength > 8 ? "text-xs" : numLength > 6 ? "text-sm" : "text-sm"

  return (
    <div className="relative flex items-center gap-1">
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        className={`w-full bg-transparent text-right font-black ${fontSize} focus:outline-none transition-colors ${className}`}
        value={displayValue}
        placeholder={placeholder}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {suffix && !focused && value !== 0 && (
        <span className="text-[10px] font-bold text-muted-foreground/60 shrink-0">{suffix}</span>
      )}
    </div>
  )
}
