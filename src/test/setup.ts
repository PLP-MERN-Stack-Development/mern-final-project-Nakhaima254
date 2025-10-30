import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const React = require('react')
      return React.createElement('div', props, children)
    },
    form: ({ children, ...props }: any) => {
      const React = require('react')
      return React.createElement('form', props, children)
    },
    section: ({ children, ...props }: any) => {
      const React = require('react')
      return React.createElement('section', props, children)
    },
  },
  AnimatePresence: ({ children }: any) => children,
}))

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useSearchParams: () => [new URLSearchParams(), vi.fn()],
  Link: ({ children, to, ...props }: any) => {
    const React = require('react')
    return React.createElement('a', { href: to, ...props }, children)
  },
  BrowserRouter: ({ children }: any) => children,
  Routes: ({ children }: any) => children,
  Route: ({ element }: any) => element,
}))

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
    },
  },
}))