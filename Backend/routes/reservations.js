const express = require('express');
const { body } = require('express-validator');
const {
  getReservations,
  getReservation,
  createReservation,
  updateReservationStatus,
  deleteReservation
} = require('../controllers/reservationController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createReservationValidation = [
  body('medicine')
    .isMongoId()
    .withMessage('Valid medicine ID is required')
];

const updateStatusValidation = [
  body('status')
    .isIn(['pending', 'confirmed', 'cancelled'])
    .withMessage('Status must be pending, confirmed, or cancelled')
];

// Routes
router.route('/')
  .get(protect, getReservations)
  .post(protect, authorize('consumer'), createReservationValidation, createReservation);

router.route('/:id')
  .get(protect, getReservation)
  .put(protect, updateStatusValidation, updateReservationStatus)
  .delete(protect, deleteReservation);

module.exports = router;