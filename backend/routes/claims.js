const express = require('express');
const { createClaim, getClaims, updateClaimStatus, deleteClaim } = require('../controllers/claims');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', createClaim);
router.get('/', getClaims);
router.put('/:id', updateClaimStatus);
router.delete('/:id', authorize('admin'), deleteClaim);

module.exports = router;
