const Complaint = require('../models/Complaint');
const User = require('../models/User');

// @route   POST /api/complaints
// @desc    Create a new complaint ticket
// @access  Private (Student)
exports.createComplaint = async (req, res, next) => {
    try {
        const { title, description, category, priority } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: 'Title and description are required'
            });
        }

        const complaint = await Complaint.create({
            title,
            description,
            category: category || 'General',
            priority: priority || 'Medium',
            student: req.user.id
        });

        res.status(201).json({
            success: true,
            data: complaint
        });
    } catch (error) {
        next(error);
    }
};

// @route   GET /api/complaints
// @desc    Fetch paginated, filterable list of student complaints
// @access  Private
exports.getComplaints = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        const { status, category, priority, search } = req.query;
        let query = {};

        // If user is a student, only show their complaints. Admin and Staff can view all.
        if (req.user.role === 'student') {
            query.student = req.user.id;
        }

        if (status) query.status = status;
        if (category) query.category = category;
        if (priority) query.priority = priority;

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const total = await Complaint.countDocuments(query);
        const complaints = await Complaint.find(query)
            .populate('student', 'name email rollNo')
            .populate('assignedTo', 'name email role')
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(limit);

        res.status(200).json({
            success: true,
            count: complaints.length,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            },
            data: complaints
        });
    } catch (error) {
        next(error);
    }
};

// @route   GET /api/complaints/:id
// @desc    Get single complaint details
// @access  Private
exports.getComplaintById = async (req, res, next) => {
    try {
        const complaint = await Complaint.findById(req.params.id)
            .populate('student', 'name email rollNo phoneNo')
            .populate('assignedTo', 'name email role')
            .populate('comments.user', 'name role');

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint ticket not found'
            });
        }

        // Students can only access their own complaint
        if (req.user.role === 'student' && complaint.student._id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this complaint'
            });
        }

        res.status(200).json({
            success: true,
            data: complaint
        });
    } catch (error) {
        next(error);
    }
};

// @route   POST /api/complaints/:id/comments
// @desc    Add a timestamped comment/reply to a specific complaint ticket
// @access  Private
exports.addComment = async (req, res, next) => {
    try {
        const { comment } = req.body;

        if (!comment || comment.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Comment content cannot be empty'
            });
        }

        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint ticket not found'
            });
        }

        // Validate access
        if (req.user.role === 'student' && complaint.student.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to comment on this complaint'
            });
        }

        const newComment = {
            user: req.user.id,
            userName: req.user.name,
            userRole: req.user.role,
            comment: comment.trim()
        };

        complaint.comments.push(newComment);
        await complaint.save();

        res.status(200).json({
            success: true,
            message: 'Comment added successfully',
            data: complaint.comments
        });
    } catch (error) {
        next(error);
    }
};

// @route   PUT /api/complaints/:id/status
// @desc    Updates priority level or status, and assigns ticket to a staff member
// @access  Private (Admin & Staff)
exports.updateComplaintStatus = async (req, res, next) => {
    try {
        const { status, priority, assignedTo } = req.body;

        let complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint ticket not found'
            });
        }

        if (status) complaint.status = status;
        if (priority) complaint.priority = priority;

        if (assignedTo) {
            const staffUser = await User.findById(assignedTo);
            if (!staffUser) {
                return res.status(404).json({
                    success: false,
                    message: 'Assigned staff user not found'
                });
            }
            complaint.assignedTo = assignedTo;
        }

        await complaint.save();

        res.status(200).json({
            success: true,
            message: 'Complaint updated successfully',
            data: complaint
        });
    } catch (error) {
        next(error);
    }
};

// @route   DELETE /api/complaints/:id
// @desc    Removes a complaint ticket from the database
// @access  Private (Admin only)
exports.deleteComplaint = async (req, res, next) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint ticket not found'
            });
        }

        await complaint.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Complaint ticket deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @route   GET /api/complaints/stats
// @desc    Aggregates database metrics (total complaints, counts by category, counts by status) via MongoDB Aggregation Pipeline
// @access  Private (Admin & Staff)
exports.getComplaintStats = async (req, res, next) => {
    try {
        const totalComplaints = await Complaint.countDocuments();

        const statusStats = await Complaint.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const categoryStats = await Complaint.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        const priorityStats = await Complaint.aggregate([
            { $group: { _id: '$priority', count: { $sum: 1 } } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalComplaints,
                byStatus: statusStats.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {}),
                byCategory: categoryStats.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {}),
                byPriority: priorityStats.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {})
            }
        });
    } catch (error) {
        next(error);
    }
};
