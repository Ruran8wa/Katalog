export function StatCard({
  label,
  value,
  hint,
  tone = 'default',
}: {
  label: string
  value: number
  hint?: string
  tone?: 'default' | 'warn' | 'bad'
}) {
  return (
    <div className="flex flex-col gap-1 border border-border p-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={
          tone === 'bad'
            ? 'text-2xl font-semibold text-destructive'
            : tone === 'warn'
              ? 'text-2xl font-semibold text-amber-600 dark:text-amber-500'
              : 'text-2xl font-semibold'
        }
      >
        {value}
      </span>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </div>
  )
}
