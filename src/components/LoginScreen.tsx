import { useState, type Ref } from 'react'
import { Button, Field, FieldError, FieldLabel, Input, PasswordInput } from '@payglocal_ui/flux-ui'
import StatusBar from './StatusBar'
import { LogoDispersionEmbed } from './SplashScreen'

const CREDENTIALS: Record<string, string> = {
  deepankarraj: '0000',
  mriduladass: '1111',
  nihalhaneef: '2222',
}

export default function LoginScreen({
  onSubmit,
  logoRef,
  hideLogo = false,
}: {
  onSubmit?: (credentials: { username: string; password: string }) => void
  /** Ref to the logo mark, for measuring the splash-to-login handoff's end rect. */
  logoRef?: Ref<HTMLDivElement>
  /** Hide the real mark while the flying clone is mid-flight toward it. */
  hideLogo?: boolean
}) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const canSubmit = username.trim().length > 0 && password.length > 0

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-blue-pressed">
      <StatusBar variant="light" />

      <div className="flex flex-1 flex-col items-center px-6 pb-8 pt-2 text-center">
        <div ref={logoRef} style={{ width: 220, height: 220 }}>
          {/* Mounted fresh (T=0, solid mark) exactly when the flying clone lands, so the
              handoff never shows a mid-loop dispersed frame under the just-landed clone. */}
          {!hideLogo && <LogoDispersionEmbed size={220} />}
        </div>

        <h1 className="mt-2 text-3xl font-extrabold leading-tight text-white">Welcome 👋</h1>
        <p className="mt-3 text-[15px] text-white/70">Login using your username and password</p>

        <form
          className="mt-8 flex w-full flex-1 flex-col gap-5 text-left"
          onSubmit={(e) => {
            e.preventDefault()
            if (!canSubmit) return
            if (CREDENTIALS[username.trim()] === password) {
              setError(false)
              onSubmit?.({ username, password })
            } else {
              setError(true)
            }
          }}
        >
          <Field invalid={error}>
            <FieldLabel htmlFor="login-username" className="text-white/80">
              Username
            </FieldLabel>
            <Input
              id="login-username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setError(false)
              }}
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              placeholder="Username"
            />
          </Field>

          <Field invalid={error}>
            <FieldLabel htmlFor="login-password" className="text-white/80">
              Password
            </FieldLabel>
            <PasswordInput
              id="login-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(false)
              }}
              placeholder="Password"
            />
            <FieldError errors={error ? [{ message: 'Incorrect username or password. Please try again.' }] : undefined} />
          </Field>

          <div className="flex-1" />

          <Button type="submit" variant="primary" size="lg" disabled={!canSubmit} className="mt-3 w-full rounded-full">
            Log in
          </Button>
        </form>
      </div>
    </div>
  )
}
