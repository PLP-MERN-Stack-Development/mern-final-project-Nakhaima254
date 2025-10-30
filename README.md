# Pharmacy Management System

A full-stack MERN (MongoDB, Express.js, React, Node.js) application for managing pharmacies, medicines, and reservations.

## Features

- **User Authentication**: Register and login as consumers, pharmacy owners, or admins
- **Pharmacy Management**: Pharmacy owners can manage their pharmacy information
- **Medicine Inventory**: Pharmacy owners can add and manage medicines
- **Medicine Search**: Consumers can search and browse available medicines
- **Reservation System**: Consumers can reserve medicines from pharmacies
- **Role-based Access Control**: Different permissions for different user types

## Project Structure

```
/
├── Backend/          # Express.js API server
│   ├── controllers/  # Route controllers
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   ├── middleware/   # Custom middleware
│   ├── utils/        # Utility functions
│   └── server.js     # Main server file
└── Frontend/         # React application
    ├── src/
    │   ├── components/  # React components
    │   ├── pages/       # Page components
    │   ├── hooks/       # Custom hooks
    │   └── lib/         # Utilities and API client
    └── public/          # Static assets
```

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- Express Validator for input validation

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- React Query (TanStack Query)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pharmacy-management-system
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   ```

   - Copy `.env` file and update MongoDB connection string
   - Start MongoDB service if running locally

3. **Frontend Setup**
   ```bash
   cd ../Frontend
   npm install
   ```

4. **Seed Database (Optional)**
   ```bash
   cd ../Backend
   npm run seed
   ```

### Running the Application

1. **Start Backend**
   ```bash
   cd Backend
   npm run dev
   ```
   Server will run on http://localhost:5000

2. **Start Frontend**
   ```bash
   cd Frontend
   npm run dev
   ```
   Application will run on http://localhost:5173

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user profile
- `PUT /api/auth/updatepassword` - Update password

### Pharmacies
- `GET /api/pharmacies` - Get all pharmacies
- `GET /api/pharmacies/:id` - Get pharmacy by ID
- `POST /api/pharmacies` - Create pharmacy (Pharmacy role)
- `PUT /api/pharmacies/:id` - Update pharmacy
- `DELETE /api/pharmacies/:id` - Delete pharmacy

### Medicines
- `GET /api/medicines` - Get all medicines
- `GET /api/medicines/:id` - Get medicine by ID
- `POST /api/medicines` - Create medicine (Pharmacy role)
- `PUT /api/medicines/:id` - Update medicine
- `DELETE /api/medicines/:id` - Delete medicine

### Reservations
- `GET /api/reservations` - Get user reservations
- `GET /api/reservations/:id` - Get reservation by ID
- `POST /api/reservations` - Create reservation (Consumer role)
- `PUT /api/reservations/:id` - Update reservation status
- `DELETE /api/reservations/:id` - Delete reservation

## User Roles

1. **Consumer**: Can search medicines, make reservations
2. **Pharmacy**: Can manage pharmacy and medicines, handle reservations
3. **Admin**: Full access to all features

## Default Users (after seeding)

- **Admin**: admin@pharmacy.com / admin123
- **Pharmacy**: Various pharmacy emails / password123
- **Consumer**: consumer@example.com / password123

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.