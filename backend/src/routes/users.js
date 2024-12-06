const express = require('express');
const router = express.Router();
const mapsHandler = require('../handlers/mapsHandler');
const maps = new mapsHandler();

const userHandler = require('../handlers/users_management_handler')
const users = new userHandler();
router.post('/getRestaurants', (req, res) =>users.fetchRestaurants(req, res));
router.post('/search',(req, res)=>users.search(req, res))

router.post('/searchAddress',(req, res)=>users.searchAddress(req, res))
router.post('/addReview', (req, res)=> users.addReview(req, res))

router.post('/login', (req, res)=> users.login(req, res));
router.post('/register', (req, res)=> users.register(req, res));

module.exports = router;