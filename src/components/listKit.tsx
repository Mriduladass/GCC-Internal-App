import { Search, SlidersHorizontal } from 'lucide-react'
import { IconButton, InputGroup, InputGroupAddon, InputGroupInput, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@payglocal_ui/flux-ui'

// Shared sizing for every floating/overlapping options list (dropdown menus, select
// popovers) across the app's list screens, so they all read as one consistent,
// mobile-scaled component instead of Flux's desktop-scaled defaults.
export const FLOATING_CONTENT_CLASS = 'min-w-[9rem] p-1'
export const FLOATING_ITEM_CLASS = 'gap-2 px-2.5 py-2 text-[12.5px]'

export type Tone = 'positive' | 'negative' | 'warning' | 'neutral'

const TONE_BADGE: Record<Tone, 'success' | 'error' | 'warning' | 'secondary'> = {
  positive: 'success',
  negative: 'error',
  warning: 'warning',
  neutral: 'secondary',
}

export { TONE_BADGE }

export function DetailField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="mt-1 truncate font-medium text-foreground">{value}</p>
    </div>
  )
}

export function FilterField({
  label,
  placeholder,
  value,
  onChange,
  options,
}: {
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div>
      <p className="mb-1.5 text-[11.5px] font-medium text-muted-foreground">{label}</p>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-10 text-[13px]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="p-1">
          <SelectItem value="all" className="py-2 pl-2.5 text-[12.5px]">
            {placeholder}
          </SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} className="py-2 pl-2.5 text-[12.5px]">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export function SearchFilterRow({
  value,
  onChange,
  placeholder,
  onToggleFilters,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  onToggleFilters: () => void
}) {
  return (
    <div className="mt-3.5 flex items-center gap-2">
      <InputGroup className="flex-1">
        <InputGroupAddon>
          <Search className="h-4 w-4" />
        </InputGroupAddon>
        <InputGroupInput placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
      </InputGroup>
      <IconButton aria-label="Toggle filters" variant="outline" size="md" rounded="lg" onClick={onToggleFilters} className="shrink-0">
        <SlidersHorizontal className="h-4 w-4" />
      </IconButton>
    </div>
  )
}
