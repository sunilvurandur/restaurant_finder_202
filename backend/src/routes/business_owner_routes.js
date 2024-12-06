// /routes/business_routes.js
const express = require('express');
const BusinessHandler = require('../handlers/business_owner_handler');
const upload = require('../middlewares/upload');  // Import the multer middleware

const router = express.Router();
const businessHandler = new BusinessHandler();

router.post('/login', (req, res) =>businessHandler.login(req, res));
router.post('/register', (req, res) => businessHandler.register(req, res));

router.post('/createRestaurant',upload.single('photo'), (req, res) =>{
    businessHandler.createRestaurant(req, res);
})

businessroutes
router.get('/getRestaurants/:business_owner_id', (req, res) =>{
    businessHandler.getRestaurants(req, res);
})


module.exports = router;
