import { useEffect, useState, type ReactNode } from 'react'
import { Info, X } from 'lucide-react'
import {
  Button,
  Callout,
  Field,
  FieldLabel,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from '@payglocal_ui/flux-ui'

const MID_TYPE_OPTIONS = [
  { value: 'TRANSACTING', label: 'Transacting' },
  { value: 'PORTFOLIO', label: 'Portfolio' },
]

const COUNTRY_CODES = ['+91', '+1', '+44', '+971']

function RequiredLabel({ children }: { children: ReactNode }) {
  return (
    <FieldLabel>
      <span className="text-destructive">*</span> {children}
    </FieldLabel>
  )
}

export default function MerchantAdminDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [midType, setMidType] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [mid, setMid] = useState('')
  const [email, setEmail] = useState('')
  const [countryCode, setCountryCode] = useState('+91')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const reset = () => {
    setMidType('')
    setFirstName('')
    setLastName('')
    setMid('')
    setEmail('')
    setCountryCode('+91')
    setPhone('')
  }

  const handleCancel = () => {
    reset()
    onClose()
  }

  const handleSubmit = () => {
    reset()
    onClose()
  }

  return (
    <div className={`absolute inset-0 z-50 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ease-pg-standard ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleCancel}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add new admin user"
        className={`absolute inset-x-0 bottom-0 flex max-h-[88%] flex-col rounded-t-3xl border-t border-border bg-card shadow-2xl transition-transform duration-300 ease-pg-standard ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="relative shrink-0 px-5 pb-3 pt-4">
          <h2 className="text-center text-[16px] font-bold text-foreground">Add New Admin User</h2>
          <button
            type="button"
            onClick={handleCancel}
            aria-label="Close"
            className="absolute right-4 top-3 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <Separator />

        <form
          className="flex-1 overflow-y-auto px-5 py-4"
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
        >
          <Callout variant="warning" className="justify-center py-3 text-center">
            <p className="text-[12.5px] font-medium leading-snug">Submitting this form will create a new Merchant</p>
          </Callout>

          <div className="mt-5 flex flex-col gap-4">
            <Field>
              <RequiredLabel>MID Type</RequiredLabel>
              <Select value={midType} onValueChange={setMidType}>
                <SelectTrigger className="h-11 text-[13.5px]">
                  <SelectValue placeholder="Please select a MID type" />
                </SelectTrigger>
                <SelectContent className="p-1">
                  {MID_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="py-2 pl-2.5 text-[13px]">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <RequiredLabel>First Name</RequiredLabel>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" />
            </Field>

            <Field>
              <RequiredLabel>Last Name</RequiredLabel>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" />
            </Field>

            <Field>
              <RequiredLabel>MID</RequiredLabel>
              <Input value={mid} onChange={(e) => setMid(e.target.value)} placeholder="Merchant ID" />
            </Field>

            <Field>
              <RequiredLabel>Email</RequiredLabel>
              <InputGroup>
                <InputGroupInput
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                />
                <InputGroupAddon align="inline-end">
                  <Info className="h-4 w-4" />
                </InputGroupAddon>
              </InputGroup>
            </Field>

            <Field>
              <RequiredLabel>Phone</RequiredLabel>
              <div className="flex gap-2">
                <Select value={countryCode} onValueChange={setCountryCode}>
                  <SelectTrigger className="h-11 w-[84px] shrink-0 px-2.5 text-[13.5px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="min-w-[80px] p-1">
                    {COUNTRY_CODES.map((code) => (
                      <SelectItem key={code} value={code} className="py-2 pl-2.5 text-[13px]">
                        {code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <InputGroup className="flex-1">
                  <InputGroupInput
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone number"
                  />
                  <InputGroupAddon align="inline-end">
                    <Info className="h-4 w-4" />
                  </InputGroupAddon>
                </InputGroup>
              </div>
            </Field>
          </div>

          <div className="mt-6 flex flex-col gap-3 pb-2">
            <Button type="submit" variant="primary" size="md" className="w-full">
              Submit
            </Button>
            <Button type="button" variant="outline" size="md" onClick={handleCancel} className="w-full">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
