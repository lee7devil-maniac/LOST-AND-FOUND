const Item = require('../models/Item');

exports.getItems = async (req, res, next) => {
    try {
        let query;
        const reqQuery = { ...req.query };
        const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
        removeFields.forEach(param => delete reqQuery[param]);

        let queryStr = JSON.stringify(reqQuery);
        query = Item.find(JSON.parse(queryStr)).populate('postedBy', 'name registerNumber');

        if (req.query.search) {
            query = query.find({
                $or: [
                    { title: { $regex: req.query.search, $options: 'i' } },
                    { description: { $regex: req.query.search, $options: 'i' } }
                ]
            });
        }

        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        const items = await query;
        res.status(200).json({ success: true, count: items.length, data: items });
    } catch (err) {
        next(err);
    }
};

exports.getItem = async (req, res, next) => {
    try {
        const item = await Item.findById(req.params.id).populate('postedBy', 'name registerNumber');
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.status(200).json({ success: true, data: item });
    } catch (err) {
        next(err);
    }
};

exports.createItem = async (req, res, next) => {
    try {
        req.body.postedBy = req.user.id;
        const item = await Item.create(req.body);
        res.status(201).json({ success: true, data: item });
    } catch (err) {
        next(err);
    }
};

exports.updateItem = async (req, res, next) => {
    try {
        let item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        if (item.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized to update this item' });
        }

        item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, data: item });
    } catch (err) {
        next(err);
    }
};

exports.deleteItem = async (req, res, next) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        if (item.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized to delete this item' });
        }

        await item.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
