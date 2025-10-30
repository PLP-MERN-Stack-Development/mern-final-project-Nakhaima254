import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Home from '@/pages/Home'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ children, to, ...props }: any) => <a href={to} {...props}>{children}</a>,
  }
})

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders hero section correctly', () => {
    render(<Home />)
    
    expect(screen.getByText(/Find affordable medicines near you/)).toBeInTheDocument()
    expect(screen.getByText(/Compare prices, check availability/)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Search for medicines/)).toBeInTheDocument()
  })

  it('renders statistics section', () => {
    render(<Home />)
    
    expect(screen.getByText('500+')).toBeInTheDocument()
    expect(screen.getByText('Partner Pharmacies')).toBeInTheDocument()
    expect(screen.getByText('10K+')).toBeInTheDocument()
    expect(screen.getByText('Medicines Tracked')).toBeInTheDocument()
  })

  it('renders features section', () => {
    render(<Home />)
    
    expect(screen.getByText('Why Choose AfyaAlert?')).toBeInTheDocument()
    expect(screen.getByText('Verified Pharmacies')).toBeInTheDocument()
    expect(screen.getByText('Real-time Availability')).toBeInTheDocument()
    expect(screen.getByText('Community Driven')).toBeInTheDocument()
  })

  it('handles search form submission', async () => {
    const user = userEvent.setup()
    render(<Home />)
    
    const searchInput = screen.getByPlaceholderText(/Search for medicines/)
    const searchButton = screen.getByRole('button', { name: /search now/i })
    
    await user.type(searchInput, 'Paracetamol')
    await user.click(searchButton)
    
    expect(mockNavigate).toHaveBeenCalledWith('/search?q=Paracetamol')
  })

  it('does not navigate with empty search', async () => {
    const user = userEvent.setup()
    render(<Home />)
    
    const searchButton = screen.getByRole('button', { name: /search now/i })
    await user.click(searchButton)
    
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('trims whitespace from search query', async () => {
    const user = userEvent.setup()
    render(<Home />)
    
    const searchInput = screen.getByPlaceholderText(/Search for medicines/)
    const searchButton = screen.getByRole('button', { name: /search now/i })
    
    await user.type(searchInput, '  Paracetamol  ')
    await user.click(searchButton)
    
    expect(mockNavigate).toHaveBeenCalledWith('/search?q=Paracetamol')
  })

  it('encodes special characters in search query', async () => {
    const user = userEvent.setup()
    render(<Home />)
    
    const searchInput = screen.getByPlaceholderText(/Search for medicines/)
    const searchButton = screen.getByRole('button', { name: /search now/i })
    
    await user.type(searchInput, 'Medicine & Co')
    await user.click(searchButton)
    
    expect(mockNavigate).toHaveBeenCalledWith('/search?q=Medicine%20%26%20Co')
  })
})