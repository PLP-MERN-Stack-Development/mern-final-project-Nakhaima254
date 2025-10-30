import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Contact from '@/pages/Contact'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

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

describe('Contact Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders contact form correctly', () => {
    renderWithProviders(<Contact />)
    
    expect(screen.getByText('Get in Touch')).toBeInTheDocument()
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Contact />)
    
    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/message is required/i)).toBeInTheDocument()
    })
  })

  it('validates email format', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Contact />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /send message/i })
    
    await user.type(emailInput, 'invalid-email')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument()
    })
  })

  it('validates message length', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Contact />)
    
    const messageInput = screen.getByLabelText(/message/i)
    const submitButton = screen.getByRole('button', { name: /send message/i })
    
    await user.type(messageInput, 'a'.repeat(1001)) // Over limit
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/message must be less than 1000 characters/i)).toBeInTheDocument()
    })
  })

  it('shows contact information', () => {
    renderWithProviders(<Contact />)
    
    expect(screen.getByText(/support@afyaalert.co.ke/i)).toBeInTheDocument()
    expect(screen.getByText(/+254 700 123 456/i)).toBeInTheDocument()
    expect(screen.getByText(/Nairobi, Kenya/i)).toBeInTheDocument()
  })
})