const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');
const { getAllTables, addTable, updateTable, deleteTable } = require('../controllers/tableController');

router.get('/', protect, getAllTables);
router.post('/', protect, adminOnly, addTable);
router.patch('/:id', protect, adminOnly, updateTable);
router.delete('/:id', protect, adminOnly, deleteTable);

module.exports = router;