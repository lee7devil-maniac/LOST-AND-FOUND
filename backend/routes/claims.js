const express = require('express');
const { createClaim, getClaims, updateClaimStatus } = require('../controllers/claims');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', createClaim);
router.get('/', getClaims);
router.put('/:id', updateClaimStatus);

module.exports = router;
