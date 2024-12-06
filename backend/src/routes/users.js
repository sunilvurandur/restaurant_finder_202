const express = require('express');
const router = express.Router();
const mapsHandler = require('../handlers/mapsHandler');
const maps = new mapsHandler();

const userHandler = require('../handlers/users_management_handler')
const users = new userHandler();
router.post('/getRestaurants', (req, res) =>users.fetchRestaurants(req, res));
router.post('/search',(req, res)=>users.search(req, res))

module.exports = router;
