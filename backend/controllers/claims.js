const Claim = require('../models/Claim');
const Item = require('../models/Item');
const Notification = require('../models/Notification');

exports.createClaim = async (req, res, next) => {
    try {
        const { itemId, description } = req.body;
        const item = await Item.findById(itemId);

        if (!item) return res.status(404).json({ message: 'Item not found' });

        const claim = await Claim.create({
            item: itemId,
            claimant: req.user.id,
            description
        });

        // Notify the item owner
        await Notification.create({
            recipient: item.postedBy,
            message: `Someone is claiming your item: ${item.title}`,
            relatedItem: item._id
        });

        res.status(201).json({ success: true, data: claim });
    } catch (err) {
        next(err);
    }
};

exports.getClaims = async (req, res, next) => {
    try {
        // Find items posted by user
        const items = await Item.find({ postedBy: req.user.id });
        const itemIds = items.map(item => item._id);

        // Get claims for those items
        const claims = await Claim.find({ item: { $in: itemIds } })
            .populate('claimant', 'name email username')
            .populate('item', 'title type');

        res.status(200).json({ success: true, data: claims });
    } catch (err) {
        next(err);
    }
};

exports.updateClaimStatus = async (req, res, next) => {
    try {
        const { status, messageFromOwner } = req.body;
        const claim = await Claim.findById(req.params.id).populate('item');

        if (!claim) return res.status(404).json({ message: 'Claim not found' });

        if (!claim.item) {
            return res.status(400).json({ message: 'Associated item no longer exists' });
        }

        if (claim.item.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        claim.status = status;
        claim.messageFromOwner = messageFromOwner;
        await claim.save();

        // Notify the claimant
        await Notification.create({
            recipient: claim.claimant,
            message: `Your claim for ${claim.item.title} has been ${status}.`,
            relatedItem: claim.item._id
        });

        // If approved, mark item as claimed
        if (status === 'approved') {
            await Item.findByIdAndUpdate(claim.item._id, { status: 'claimed' });
        }

        res.status(200).json({ success: true, data: claim });
    } catch (err) {
        next(err);
    }
};

exports.deleteClaim = async (req, res, next) => {
    try {
        const claim = await Claim.findById(req.params.id);

        if (!claim) return res.status(404).json({ message: 'Claim not found' });

        await claim.deleteOne();

        res.status(200).json({ success: true, message: 'Claim removed successfully' });
    } catch (err) {
        next(err);
    }
};
