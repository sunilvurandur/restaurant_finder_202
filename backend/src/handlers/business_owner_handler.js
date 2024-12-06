const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const uploadToGitHub = require('./githubHandler');


class businessOwnerHandler{
    constructor(){}
    async register(req, res){
        const { name, email, password, phone } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required.' });
          }
          try {
            // Check if the email is already registered
            const existingOwner = await req.app.get('models')['business_owners'].findOne({ where: { email } });
            if (existingOwner) {
              return res.status(409).json({ error: 'Email is already registered.' });
            }
        
            // Hash the password
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);
        
            // Create a new BusinessOwner
            const newOwner = await req.app.get('models')['business_owners'].create({
              name,
              email,
              password: passwordHash,
              phone
            });
        
            return res.status(201).json({
              message: 'Business owner registered successfully.',
              data: { id: newOwner.id, name: newOwner.name, email: newOwner.email, role:"businessOwner" },
            });
          } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error.' });
          }
    }

    async login(req, res){
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        try {
            // Find the business owner by email
            let BusinessOwner = req.app.get('models')['business_owners']
            const owner = await BusinessOwner.findOne({ where: { email } });
            if (!owner) {
            return res.status(404).json({ error: 'Invalid email or password.' });
            }

            // Compare the password with the stored hash
            const isPasswordValid = await bcrypt.compare(password, owner.password);
            if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password.' });
            }

            // Generate a JWT token
            const token = jwt.sign(
            { id: owner.owner_id, email: owner.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
            );

            return res.status(200).json({
            message: 'Login successful.',
            token,
            owner: { id: owner.owner_id, name: owner.name, email: owner.email},
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }

    async createRestaurant(req, res){
        try{
        const {
            name,
            address,
            latitude,
            longitude,
            category,
            cuisine_type,
            price_range,
            business_owner_id,
            hours,
            description
          } = req.body;
        
        //   try {
            // Validate required fields
            // if (!name || !address) {
            //   return res.status(400).json({ error: 'Name and address are required' });
            // }
        
            let BusinessOwner = req.app.get('models')['business_owners']
            const businessOwner = await BusinessOwner.findOne({ where: { id: business_owner_id} });
            if (!businessOwner) {
              return res.status(404).json({ error: 'Business owner not found' });
            }
            let photoUrl = null;

            // Upload photo to GitHub if provided
            if (req.file) {
            const fileName = `${Date.now()}_${req.file.originalname}`; // Unique filename
            photoUrl = await uploadToGitHub(req.file.buffer, fileName);
            }
            
            console.log(typeof(hours))
            // Create a new restaurant record
            const newRestaurant = await req.app.get('models')['restaurants'].create({
              name,
              address,
              latitude,
              longitude,
              category,
              cuisine_type,
              price_range,
              hours, 
              description, 
              coverPhoto:photoUrl
            });
            
            const updatedRestaurantIds = businessOwner.restaurant_ids
            ? [...businessOwner.restaurant_ids, newRestaurant.id] // Append if array exists
            : [newRestaurant.id]; // Initialize if array is null/undefined
      
          // Update the business owner's restaurant_ids column
            await businessOwner.update({ restaurant_ids: updatedRestaurantIds });

            res.status(201).json({ message: 'Restaurant created successfully', data: newRestaurant });
          } catch (error) {
            console.error('Error creating restaurant:', error);
            res.status(500).json({ error: 'Failed to create restaurant' });
          }
    }

    async getRestaurants(req, res){
        let BusinessOwner = req.app.get('models')['business_owners']

        const { business_owner_id } = req.params;

        try {
            // Fetch the business owner by ID
            const businessOwner = await BusinessOwner.findOne({ where: { id: business_owner_id} });

            // Check if the business owner exists
            if (!businessOwner) {
                return res.status(404).json({ error: 'Business owner not found' });
            }

            // Extract restaurant_ids array from the business owner
            const restaurantIds = businessOwner.restaurant_ids || [];

            if (restaurantIds.length === 0) {
                return res.status(200).json({
                message: `No restaurants found for Business Owner ID: ${business_owner_id}`,
                data: [],
                });
            }

            // Fetch all restaurants matching the IDs in the array
            const restaurants = await req.app.get('models')['restaurants'].findAll({
                where: {
                id: restaurantIds,
                },
            });

            res.status(200).json({
                message: `Restaurants for Business Owner ID: ${business_owner_id}`,
                data: restaurants,
            });
        } catch (error) {
            console.error('Error fetching restaurants:', error);
            res.status(500).json({ error: 'Failed to fetch restaurants' });
        }
    }

    async updatedRestaurant(req, res){
        const Restaurant = req.app.get('models')['restaurants'];
        const restaurantId = req.params.id;
        const { name, address, contact_info, hours, description } = req.body;
        let photoUrl = null;
      
        try {
          // Find restaurant by ID
          const restaurant = await Restaurant.findOne({
            where: { id: restaurantId },
            include: [{
              model: BusinessOwner,
              required: true,  // Ensures that the restaurant is linked to a business owner
              where: { id: req.user.id }, // Check if the logged-in user is the business owner
            }],
          });
      
          if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found or you are not the owner' });
          }
      
          // Check if a new photo is uploaded and upload it to GitHub (or a file storage service)
          if (req.file) {
            const fileName = `${Date.now()}_${req.file.originalname}`;
            photoUrl = await uploadToGitHub(req.file.buffer, fileName);
          }
      
          // Update restaurant details
          const updatedRestaurant = await restaurant.update({
            name: name || restaurant.name,
            address: address || restaurant.address,
            contact_info: contact_info || restaurant.contact_info,
            hours: hours || restaurant.hours,
            description: description || restaurant.description,
            photos: photoUrl || restaurant.photo, // Only update if a new photo was uploaded
          });
      
          res.status(200).json({
            message: 'Restaurant updated successfully',
            restaurant: updatedRestaurant,
          });
        } catch (error) {
          console.error('Error updating restaurant:', error);
          res.status(500).json({ error: 'Failed to update restaurant' });
        } 
}
}
module.exports = businessOwnerHandler;