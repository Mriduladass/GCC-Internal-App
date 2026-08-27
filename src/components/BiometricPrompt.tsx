import { Fingerprint } from 'lucide-react'

type BioState = 'prompt' | 'retry'

export default function BiometricPrompt({
  state,
  onEnterPassword,
  onCancel,
  onRetry,
}: {
  state: BioState
  onEnterPassword: () => void
  onCancel: () => void
  onRetry: () => void
}) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/40 px-8 backdrop-blur-md">
      <div className="w-full max-w-[280px] rounded-[28px] bg-neutral-900/90 px-6 pb-5 pt-7 text-center shadow-2xl">
        <Fingerprint className="mx-auto h-10 w-10 text-[#ff375f]" />

        <h2 className="mt-4 text-[17px] font-semibold text-white">
          {state === 'retry' ? 'Try Again' : 'Touch ID for "PayGlocal"'}
        </h2>
        <p className="mt-2 text-[13px] leading-snug text-white/70">Enter your passcode or use Touch ID to unlock</p>

        <div className="mt-5 flex flex-col gap-2.5">
          {state === 'retry' && (
            <button
              type="button"
              onClick={onEnterPassword}
              className="w-full rounded-2xl bg-white/10 py-3 text-[15px] font-semibold text-white"
            >
              Enter Passcode
            </button>
          )}
          <button type="button" onClick={onCancel} className="w-full rounded-2xl bg-white/10 py-3 text-[15px] font-semibold text-white">
            Cancel
          </button>
        </div>
      </div>

      <button type="button" onClick={onRetry} className="mt-6 text-[15px] font-semibold text-[#3b82f6]">
        Unlock
      </button>
    </div>
  )
}
