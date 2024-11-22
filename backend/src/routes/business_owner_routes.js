// /routes/business_routes.js
const express = require('express');
const BusinessHandler = require('../handlers/business_owner_handler');

const router = express.Router();
const businessHandler = new BusinessHandler();

router.get('/login', (req, res) =>businessHandler.login(req, res));
router.post('/business_owner', (req, res) => businessHandler.createBusinessOwner(req, res));

module.exports = router;
