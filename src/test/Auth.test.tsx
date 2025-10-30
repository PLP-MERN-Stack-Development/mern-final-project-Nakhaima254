import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Auth from '@/pages/Auth'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
})

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  )
}

describe('Auth Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form by default', () => {
    renderWithProviders(<Auth />)
    
    expect(screen.getByText('Welcome back')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('switches to signup form when clicking signup tab', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Auth />)
    
    const signupTab = screen.getByText('Sign Up')
    await user.click(signupTab)
    
    expect(screen.getByText('Create your account')).toBeInTheDocument()
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('validates email format', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Auth />)
    
    const emailInput = screen.getByLabelText('Email')
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    await user.type(emailInput, 'invalid-email')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
    })
  })

  it('validates password requirements', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Auth />)
    
    const signupTab = screen.getByText('Sign Up')
    await user.click(signupTab)
    
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: /create account/i })
    
    await user.type(passwordInput, '123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument()
    })
  })

  it('calls supabase signInWithPassword on login', async () => {
    const user = userEvent.setup()
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: null, session: null },
      error: null
    })
    
    renderWithProviders(<Auth />)
    
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
    })
  })

  it('calls supabase signUp on registration', async () => {
    const user = userEvent.setup()
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: null, session: null },
      error: null
    })
    
    renderWithProviders(<Auth />)
    
    // Switch to signup
    const signupTab = screen.getByText('Sign Up')
    await user.click(signupTab)
    
    const nameInput = screen.getByLabelText('Full Name')
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: /create account/i })
    
    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: 'password123',
        options: {
          emailRedirectTo: expect.stringContaining('/'),
          data: { name: 'John Doe' }
        }
      })
    })
  })
})