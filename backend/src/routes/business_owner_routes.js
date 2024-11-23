// /routes/business_routes.js
const express = require('express');
const BusinessHandler = require('../handlers/business_owner_handler');

const router = express.Router();
const businessHandler = new BusinessHandler();

router.post('/login', (req, res) =>businessHandler.login(req, res));
router.post('/register', (req, res) => businessHandler.register(req, res));

module.exports = router;
