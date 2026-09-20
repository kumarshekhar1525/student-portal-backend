const express = require('express');
const router = express.Router();
const {
    createComplaint,
    getComplaints,
    getComplaintById,
    addComment,
    updateComplaintStatus,
    deleteComplaint,
    getComplaintStats
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Administrative Aggregation Pipeline Stats (Place before :id route)
router.get('/stats', protect, authorize('admin', 'staff'), getComplaintStats);

router.route('/')
    .post(protect, createComplaint)
    .get(protect, getComplaints);

router.route('/:id')
    .get(protect, getComplaintById)
    .delete(protect, authorize('admin'), deleteComplaint);

router.post('/:id/comments', protect, addComment);
router.put('/:id/status', protect, authorize('admin', 'staff'), updateComplaintStatus);

module.exports = router;
