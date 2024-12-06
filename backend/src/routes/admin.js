const express = require('express');
const router = express.Router();
const mapsHandler = require('../handlers/mapsHandler');
const maps = new mapsHandler();

const userHandler = require('../handlers/users_management_handler')
const users = new userHandler();


router.post('/duplicate', (req, res)=> users.checkDuplicateListings(req, res))
module.exports = router;   