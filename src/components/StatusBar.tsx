export default function StatusBar({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  return (
    <div
      className={`flex h-[54px] w-full items-end justify-between px-6 pb-2 ${
        variant === 'light' ? 'text-white' : 'text-black'
      }`}
    >
      <span className="text-sm font-semibold">9:41</span>
      <div className="flex items-center gap-1.5">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
          <rect x="0" y="8" width="3" height="4" rx="0.5" fill="currentColor" />
          <rect x="5" y="5" width="3" height="7" rx="0.5" fill="currentColor" />
          <rect x="10" y="2" width="3" height="10" rx="0.5" fill="currentColor" />
          <rect x="15" y="0" width="3" height="12" rx="0.5" fill="currentColor" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path
            d="M8 10.5a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4zM4.3 6.8a5.2 5.2 0 017.4 0l-1.2 1.2a3.5 3.5 0 00-5 0L4.3 6.8zM1.7 4.2a9 9 0 0112.6 0L13 5.4a7.3 7.3 0 00-10 0L1.7 4.2z"
            fill="currentColor"
          />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="currentColor" opacity="0.4" />
          <rect x="2" y="2" width="18" height="8" rx="1.5" fill="currentColor" />
          <rect x="22.5" y="4" width="1.5" height="4" rx="0.75" fill="currentColor" opacity="0.4" />
        </svg>
      </div>
    </div>
  )
}
