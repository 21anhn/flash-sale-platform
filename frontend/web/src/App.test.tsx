import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App.tsx'

afterEach(() => cleanup())

describe('App', () => {
  it('shows backend status when health check succeeds', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ status: 'UP' }),
    }))
    render(<App />)
    expect(await screen.findByText('Backend status: UP')).toBeDefined()
    vi.unstubAllGlobals()
  })

  it('shows unavailable message when health check fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))
    render(<App />)
    expect(await screen.findByText(/Backend unavailable/)).toBeDefined()
    vi.unstubAllGlobals()
  })
})
