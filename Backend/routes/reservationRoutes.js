const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');
const {
  createReservation,
  getMyReservations,
  cancelMyReservation,
  getAllReservations,
  updateReservation,
  cancelAnyReservation
} = require('../controllers/reservationController');

// customer routes
router.post('/', protect, createReservation);
router.get('/my', protect, getMyReservations);
router.patch('/my/:id/cancel', protect, cancelMyReservation);

// admin routes
router.get('/', protect, adminOnly, getAllReservations);
router.patch('/:id', protect, adminOnly, updateReservation);
router.patch('/:id/cancel', protect, adminOnly, cancelAnyReservation);

module.exports = router;