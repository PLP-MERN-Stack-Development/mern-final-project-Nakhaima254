const express = require('express');
const { body } = require('express-validator');
const {
  getMedicines,
  getMedicine,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  getMedicinesByPharmacy
} = require('../controllers/medicineController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const medicineValidation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
  body('strength')
    .trim()
    .notEmpty()
    .withMessage('Strength is required'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('pharmacy')
    .isMongoId()
    .withMessage('Valid pharmacy ID is required')
];

const updateMedicineValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
  body('strength')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Strength is required'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('availability')
    .optional()
    .isBoolean()
    .withMessage('Availability must be a boolean')
];

// Routes
router.route('/')
  .get(getMedicines)
  .post(protect, authorize('pharmacy'), medicineValidation, createMedicine);

router.route('/:id')
  .get(getMedicine)
  .put(protect, updateMedicineValidation, updateMedicine)
  .delete(protect, deleteMedicine);

router.get('/pharmacy/:pharmacyId', getMedicinesByPharmacy);

module.exports = router;