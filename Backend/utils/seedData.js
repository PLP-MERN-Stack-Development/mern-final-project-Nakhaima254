const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Pharmacy = require('../models/Pharmacy');
const Medicine = require('../models/Medicine');
const Reservation = require('../models/Reservation');
const mockData = require('../../Frontend/src/data/mockData.json');

// Load environment variables
dotenv.config();

// Connect to MongoDB first
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();

    console.log('Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Pharmacy.deleteMany({});
    await Medicine.deleteMany({});
    await Reservation.deleteMany({});

    console.log('Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@pharmacy.com',
      password: 'admin123',
      role: 'admin'
    });

    // Create pharmacy users from mock data
    const pharmacyUsers = [];
    const uniquePharmacies = [...new Set(mockData.medicines.map(m => m.pharmacyId))];

    for (let i = 0; i < uniquePharmacies.length; i++) {
      const pharmacyData = mockData.pharmacies.find(p => p.id === uniquePharmacies[i]);
      if (pharmacyData) {
        const user = await User.create({
          name: `${pharmacyData.name} Owner`,
          email: pharmacyData.email,
          password: 'password123',
          role: 'pharmacy'
        });
        pharmacyUsers.push({ user, data: pharmacyData });
      }
    }

    // Create pharmacies
    const pharmacies = [];
    for (const { user, data } of pharmacyUsers) {
      const pharmacy = await Pharmacy.create({
        name: data.name,
        location: data.location,
        license: data.licenseNumber,
        contact: data.phone,
        verified: data.status === 'Verified',
        user: user._id
      });
      pharmacies.push(pharmacy);
    }

    // Create medicines
    const medicines = [];
    for (const medicineData of mockData.medicines) {
      const pharmacy = pharmacies.find(p => p.name === medicineData.pharmacyName);
      if (pharmacy) {
        const medicine = await Medicine.create({
          name: medicineData.name,
          strength: medicineData.strength,
          price: medicineData.price,
          availability: medicineData.availability === 'In Stock',
          pharmacy: pharmacy._id
        });
        medicines.push(medicine);
      }
    }

    // Create a consumer user
    const consumerUser = await User.create({
      name: 'John Consumer',
      email: 'consumer@example.com',
      password: 'password123',
      role: 'consumer'
    });

    // Create some sample reservations
    if (medicines.length > 0) {
      const sampleReservations = [
        {
          user: consumerUser._id,
          medicine: medicines[0]._id,
          pharmacy: medicines[0].pharmacy,
          status: 'pending'
        },
        {
          user: consumerUser._id,
          medicine: medicines[1]._id,
          pharmacy: medicines[1].pharmacy,
          status: 'confirmed'
        }
      ];

      await Reservation.insertMany(sampleReservations);
    }

    console.log('Database seeded successfully!');
    console.log(`Created:`);
    console.log(`- ${1} admin user`);
    console.log(`- ${pharmacyUsers.length} pharmacy users`);
    console.log(`- ${pharmacies.length} pharmacies`);
    console.log(`- ${medicines.length} medicines`);
    console.log(`- ${1} consumer user`);
    console.log(`- ${2} sample reservations`);

    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed.');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

module.exports = seedDatabase;