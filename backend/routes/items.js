const express = require('express');
const { getItems, getItem, createItem, updateItem, deleteItem, getMyItems } = require('../controllers/items');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getItems)
    .post(protect, createItem);

router.get('/me', protect, getMyItems);

router.route('/:id')
    .get(getItem)
    .put(protect, updateItem)
    .delete(protect, deleteItem);

module.exports = router;
