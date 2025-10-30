const express = require('express');
const { body } = require('express-validator');
const {
  getPharmacies,
  getPharmacy,
  createPharmacy,
  updatePharmacy,
  deletePharmacy,
  getMyPharmacy
} = require('../controllers/pharmacyController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const pharmacyValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  body('license')
    .trim()
    .notEmpty()
    .withMessage('License number is required'),
  body('contact')
    .trim()
    .notEmpty()
    .withMessage('Contact information is required')
];

const updatePharmacyValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('location')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  body('license')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('License number is required'),
  body('contact')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Contact information is required'),
  body('verified')
    .optional()
    .isBoolean()
    .withMessage('Verified must be a boolean')
];

// Routes
router.route('/')
  .get(getPharmacies)
  .post(protect, authorize('pharmacy'), pharmacyValidation, createPharmacy);

router.route('/:id')
  .get(getPharmacy)
  .put(protect, updatePharmacyValidation, updatePharmacy)
  .delete(protect, deletePharmacy);

router.get('/mypharmacy', protect, authorize('pharmacy'), getMyPharmacy);

module.exports = router;