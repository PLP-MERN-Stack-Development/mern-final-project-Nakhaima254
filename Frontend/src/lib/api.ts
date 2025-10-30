// API client for communicating with the backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('token');

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response;
  }

  async register(userData: { name: string; email: string; password: string; role?: string }) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response;
  }

  async getCurrentUser() {
    return await this.request('/auth/me');
  }

  async updateProfile(userData: { name?: string; email?: string }) {
    return await this.request('/auth/updatedetails', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async updatePassword(passwordData: { currentPassword: string; newPassword: string }) {
    return await this.request('/auth/updatepassword', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  // Pharmacy endpoints
  async getPharmacies(params?: { verified?: boolean; location?: string; page?: number; limit?: number }) {
    const queryParams = params ? new URLSearchParams(params as any).toString() : '';
    return await this.request(`/pharmacies${queryParams ? `?${queryParams}` : ''}`);
  }

  async getPharmacy(id: string) {
    return await this.request(`/pharmacies/${id}`);
  }

  async createPharmacy(pharmacyData: { name: string; location: string; license: string; contact: string }) {
    return await this.request('/pharmacies', {
      method: 'POST',
      body: JSON.stringify(pharmacyData),
    });
  }

  async updatePharmacy(id: string, pharmacyData: Partial<{ name: string; location: string; license: string; contact: string; verified: boolean }>) {
    return await this.request(`/pharmacies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pharmacyData),
    });
  }

  async deletePharmacy(id: string) {
    return await this.request(`/pharmacies/${id}`, {
      method: 'DELETE',
    });
  }

  async getMyPharmacy() {
    return await this.request('/pharmacies/mypharmacy');
  }

  // Medicine endpoints
  async getMedicines(params?: {
    pharmacy?: string;
    name?: string;
    availability?: boolean;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
  }) {
    const queryParams = params ? new URLSearchParams(params as any).toString() : '';
    return await this.request(`/medicines${queryParams ? `?${queryParams}` : ''}`);
  }

  async getMedicine(id: string) {
    return await this.request(`/medicines/${id}`);
  }

  async createMedicine(medicineData: { name: string; strength: string; price: number; pharmacy: string; availability?: boolean }) {
    return await this.request('/medicines', {
      method: 'POST',
      body: JSON.stringify(medicineData),
    });
  }

  async updateMedicine(id: string, medicineData: Partial<{ name: string; strength: string; price: number; availability: boolean }>) {
    return await this.request(`/medicines/${id}`, {
      method: 'PUT',
      body: JSON.stringify(medicineData),
    });
  }

  async deleteMedicine(id: string) {
    return await this.request(`/medicines/${id}`, {
      method: 'DELETE',
    });
  }

  async getMedicinesByPharmacy(pharmacyId: string, params?: { page?: number; limit?: number }) {
    const queryParams = params ? new URLSearchParams(params as any).toString() : '';
    return await this.request(`/medicines/pharmacy/${pharmacyId}${queryParams ? `?${queryParams}` : ''}`);
  }

  // Reservation endpoints
  async getReservations(params?: { status?: string; page?: number; limit?: number }) {
    const queryParams = params ? new URLSearchParams(params as any).toString() : '';
    return await this.request(`/reservations${queryParams ? `?${queryParams}` : ''}`);
  }

  async getReservation(id: string) {
    return await this.request(`/reservations/${id}`);
  }

  async createReservation(reservationData: { medicine: string }) {
    return await this.request('/reservations', {
      method: 'POST',
      body: JSON.stringify(reservationData),
    });
  }

  async updateReservationStatus(id: string, statusData: { status: 'pending' | 'confirmed' | 'cancelled' }) {
    return await this.request(`/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    });
  }

  async deleteReservation(id: string) {
    return await this.request(`/reservations/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);