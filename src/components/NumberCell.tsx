import { cn } from '@/lib/utils'

export function NumberCell({
  value,
  onChange,
  width,
  placeholder,
}: {
  value: number
  onChange: (value: number) => void
  width: 'w-24' | 'w-20'
  placeholder?: string
}) {
  return (
    <td className="px-3 py-2">
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        placeholder={placeholder}
        className={cn(width, 'rounded-lg border border-border bg-background px-2 py-1')}
      />
    </td>
  )
}
