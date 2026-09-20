const Item = require('../models/Item');

// @route   POST /api/items
// @desc    Create a new lost & found item post
// @access  Private
exports.createItem = async (req, res, next) => {
    try {
        const { title, description, category, status, location, contactPhone } = req.body;

        if (!title || !description || !location) {
            return res.status(400).json({
                success: false,
                message: 'Title, description, and location are required'
            });
        }

        let imageUrl = '';
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        const item = await Item.create({
            title,
            description,
            category: category || 'Other',
            status: status || 'Lost',
            location,
            contactPhone,
            imageUrl,
            postedBy: req.user.id
        });

        res.status(201).json({
            success: true,
            data: item
        });
    } catch (error) {
        next(error);
    }
};

// @route   GET /api/items
// @desc    Get list of lost & found items with filter & search
// @access  Public
exports.getItems = async (req, res, next) => {
    try {
        const { status, category, search } = req.query;
        let query = {};

        if (status) query.status = status;
        if (category) query.category = category;

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }

        const items = await Item.find(query)
            .populate('postedBy', 'name email phoneNo')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: items.length,
            data: items
        });
    } catch (error) {
        next(error);
    }
};

// @route   GET /api/items/:id
// @desc    Get single item details
// @access  Public
exports.getItemById = async (req, res, next) => {
    try {
        const item = await Item.findById(req.params.id)
            .populate('postedBy', 'name email phoneNo');

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        res.status(200).json({
            success: true,
            data: item
        });
    } catch (error) {
        next(error);
    }
};

// @route   PUT /api/items/:id
// @desc    Update item status or details
// @access  Private
exports.updateItem = async (req, res, next) => {
    try {
        let item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        // Only creator or Admin/Staff can update item
        if (item.postedBy.toString() !== req.user.id && req.user.role === 'student') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this item'
            });
        }

        const { title, description, category, status, location, contactPhone } = req.body;

        if (title) item.title = title;
        if (description) item.description = description;
        if (category) item.category = category;
        if (status) item.status = status;
        if (location) item.location = location;
        if (contactPhone) item.contactPhone = contactPhone;

        if (req.file) {
            item.imageUrl = `/uploads/${req.file.filename}`;
        }

        await item.save();

        res.status(200).json({
            success: true,
            message: 'Item updated successfully',
            data: item
        });
    } catch (error) {
        next(error);
    }
};

// @route   DELETE /api/items/:id
// @desc    Delete item post
// @access  Private
exports.deleteItem = async (req, res, next) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        // Only creator or Admin can delete
        if (item.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this item'
            });
        }

        await item.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Item post deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
