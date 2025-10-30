import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Search from '@/pages/Search'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock data
vi.mock('@/data/mockData.json', () => ({
  default: {
    medicines: [
      {
        id: '1',
        name: 'Paracetamol',
        strength: '500mg',
        price: 150,
        pharmacyName: 'Test Pharmacy',
        location: 'Nairobi',
        county: 'Nairobi',
        availability: 'In Stock',
        pharmacyId: '1'
      },
      {
        id: '2',
        name: 'Amoxicillin',
        strength: '250mg',
        price: 200,
        pharmacyName: 'Health Plus',
        location: 'Mombasa',
        county: 'Mombasa',
        availability: 'Low Stock',
        pharmacyId: '2'
      }
    ],
    counties: ['Nairobi', 'Mombasa', 'Kisumu']
  }
}))

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

describe('Search Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders search form correctly', () => {
    renderWithProviders(<Search />)
    
    expect(screen.getByText('Search Medicines')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search medicine name...')).toBeInTheDocument()
    expect(screen.getByText('Select location')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
  })

  it('displays medicine results correctly', async () => {
    renderWithProviders(<Search />)
    
    await waitFor(() => {
      expect(screen.getByText('Paracetamol')).toBeInTheDocument()
      expect(screen.getByText('Amoxicillin')).toBeInTheDocument()
      expect(screen.getByText('Test Pharmacy')).toBeInTheDocument()
      expect(screen.getByText('Health Plus')).toBeInTheDocument()
    })
  })

  it('filters medicines by search query', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Search />)
    
    const searchInput = screen.getByPlaceholderText('Search medicine name...')
    await user.type(searchInput, 'Paracetamol')
    
    const searchButton = screen.getByRole('button', { name: /search/i })
    await user.click(searchButton)
    
    await waitFor(() => {
      expect(screen.getByText('Paracetamol')).toBeInTheDocument()
      expect(screen.queryByText('Amoxicillin')).not.toBeInTheDocument()
    })
  })

  it('shows availability badges correctly', async () => {
    renderWithProviders(<Search />)
    
    await waitFor(() => {
      expect(screen.getByText('In Stock')).toBeInTheDocument()
      expect(screen.getByText('Low Stock')).toBeInTheDocument()
    })
  })

  it('shows no results message when no medicines match', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Search />)
    
    const searchInput = screen.getByPlaceholderText('Search medicine name...')
    await user.type(searchInput, 'NonexistentMedicine')
    
    const searchButton = screen.getByRole('button', { name: /search/i })
    await user.click(searchButton)
    
    await waitFor(() => {
      expect(screen.getByText('No medicines found')).toBeInTheDocument()
    })
  })

  it('validates empty search input', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Search />)
    
    const searchButton = screen.getByRole('button', { name: /search/i })
    await user.click(searchButton)
    
    // Should show validation error for empty search
    await waitFor(() => {
      expect(screen.getByText(/medicine name is required/i)).toBeInTheDocument()
    })
  })
})