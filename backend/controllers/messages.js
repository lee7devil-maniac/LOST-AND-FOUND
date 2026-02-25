const Message = require('../models/Message');
const Item = require('../models/Item');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res, next) => {
    try {
        const { receiverId, itemId, text } = req.body;

        if (req.user.id === receiverId) {
            return res.status(400).json({ success: false, message: 'You cannot message yourself' });
        }

        const message = await Message.create({
            sender: req.user.id,
            receiver: receiverId,
            item: itemId,
            text
        });

        console.log(`Message sent from ${req.user.id} to ${receiverId} for item ${itemId}`);
        res.status(201).json({ success: true, data: message });
    } catch (err) {
        next(err);
    }
};

// @desc    Get chat history for an item between current user and another user
// @route   GET /api/messages/:itemId/:otherUserId
// @access  Private
exports.getMessages = async (req, res, next) => {
    try {
        const { itemId, otherUserId } = req.params;

        // Fetch messages where:
        // (sender is current user AND receiver is other user) OR (sender is other user AND receiver is current user)
        // AND item is the specific item
        const messages = await Message.find({
            item: itemId,
            $or: [
                { sender: req.user.id.toString(), receiver: otherUserId.toString() },
                { sender: otherUserId.toString(), receiver: req.user.id.toString() }
            ]
        }).sort({ createdAt: 1 });

        console.log(`Fetched ${messages.length} messages between ${req.user.id} and ${otherUserId} for item ${itemId}`);

        // Mark messages as read if receiver is current user
        await Message.updateMany(
            { item: itemId, sender: otherUserId, receiver: req.user.id, read: false },
            { read: true }
        );

        res.status(200).json({ success: true, data: messages });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all chat threads for current user
// @route   GET /api/messages/threads
// @access  Private
exports.getChatThreads = async (req, res, next) => {
    try {
        // Find all messages involving the current user
        const messages = await Message.find({
            $or: [{ sender: req.user.id }, { receiver: req.user.id }]
        })
            .populate('sender', 'name username')
            .populate('receiver', 'name username')
            .populate('item', 'title')
            .sort({ createdAt: -1 });

        // Group by Item + Other User
        const threads = {};
        messages.forEach(msg => {
            // Safety checks for populated fields
            if (!msg.item || !msg.sender || !msg.receiver) return;

            const senderId = msg.sender._id.toString();
            const receiverId = msg.receiver._id.toString();
            const currentId = req.user.id.toString();

            const otherUser = senderId === currentId ? msg.receiver : msg.sender;
            const threadId = `${msg.item._id}_${otherUser._id}`;

            if (!threads[threadId]) {
                threads[threadId] = {
                    item: msg.item,
                    otherUser: otherUser,
                    lastMessage: msg.text,
                    timestamp: msg.createdAt,
                    unread: !msg.read && receiverId === currentId
                };
            }
        });

        console.log(`Fetched ${Object.keys(threads).length} chat threads for user ${req.user.id}`);
        res.status(200).json({ success: true, data: Object.values(threads) });
    } catch (err) {
        next(err);
    }
};
