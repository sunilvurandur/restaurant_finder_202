//UsersManagement Handler
const mapsHandler = require('../handlers/mapsHandler');
const maps = new mapsHandler();
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const { users } = require('../models');
const sequelize = require('sequelize')

class UsersManagementHander{
    constructor(){}

        // Haversine formula to calculate distance between two lat/lon points
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of Earth in kilometers
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in kilometers
    }

    toRad(degrees) {
        return degrees * Math.PI / 180;
    }


    async fetchRestaurantsWithinRadius(req, latitude, longitude, radius){
        // Fetch all restaurants from the database
        try{
        const restaurants = await req.app.get('models')['restaurants'].findAll();
    
        // Filter restaurants within the radius
        const filteredRestaurants = restaurants.filter(restaurant => {
            // If latitude and longitude are available, calculate the distance
            if (restaurant.latitude && restaurant.longitude) {
                const distance = this.calculateDistance(
                    latitude,
                    longitude,
                    parseFloat(restaurant.latitude),
                    parseFloat(restaurant.longitude)
                );
    
                // Check if the distance is within the given radius
                return distance <= radius;
            }
            return false;
        });
    
        return filteredRestaurants;}
        catch(error){console.log(error)}
    };

     haversineDistance(lat1, lon1, lat2, lon2){
        const toRadians = degree => (degree * Math.PI) / 180;
        const R = 6371; // Earth's radius in kilometers
    
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);
    
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) *
                Math.cos(toRadians(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
    
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in kilometers
    };

    async combineRestaurantData(req, latitude, longitude, radius){
        // Fetch nearby restaurants from Azure Maps API
        try{
        const mapRestaurants = await maps.searchNearbyAzureMaps(latitude, longitude, radius);
    
        // Fetch restaurant data from the database within the specified radius
        const dbRestaurants = await this.fetchRestaurantsWithinRadius(req, latitude, longitude, radius);

        const combinedData = [...dbRestaurants, ...mapRestaurants];

        // Fetch reviews for database restaurants
        const restaurantIds = combinedData.map(restaurant => restaurant.id);
        console.log(restaurantIds)
        const reviews = await req.app.get('models')['reviews'].findAll({
            where: { restaurant_id: restaurantIds }
        });

        

        // Group reviews by restaurant_id
        const reviewsByRestaurantId = reviews.reduce((acc, review) => {
            const { restaurant_id } = review;
            if (!acc[restaurant_id]) acc[restaurant_id] = [];
            acc[restaurant_id].push(review);
            return acc;
        }, {});

        // console.log(reviewsByRestaurantId)
        // Attach reviews and calculate average rating for dbRestaurants
        combinedData.forEach(restaurant => {
            const restaurantReviews = reviewsByRestaurantId[restaurant.id] || [];
            restaurant.reviews = restaurantReviews;
            restaurant.averageRating = this.calculateAverageRating(restaurantReviews);
        });




        // _____

        combinedData.forEach(restaurant => {
            const lat = parseFloat(restaurant.latitude);
            const lon = parseFloat(restaurant.longitude);
            restaurant.distance = this.haversineDistance(latitude, longitude, lat, lon);
        });

        combinedData.sort((a, b) => a.distance - b.distance);

        return { data: combinedData };
    
    }
        catch(error){console.log(error)}

    };
    
    
// Helper function to calculate average rating
calculateAverageRating(reviews){
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRating / reviews.length;
};

    async fetchRestaurants(req, res){
        try{
        console.log(req.body)
        const { latitude, longitude, radius} = req.body; // Default radius: 5000 meters (5 km)

        if (!latitude || !longitude) {
            return res.status(400).json({ error: 'Latitude and Longitude are required.' });
        }
    
        try {
            const restaurants = await this.combineRestaurantData(req, latitude, longitude, radius);
            res.json(restaurants);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }   catch(error){console.log(error)}
    }

    async searchRestaurants(req,query){
        const { name, category, price_range, rating, latitude, longitude, radius } = req.body;

    
        try {
            // Step 1: Fetch data from the database
            const dbRestaurants = await req.app.get('models')['restaurants'].findAll({
                where: {
                    ...(name && { name: { [Op.iLike]: `%${name}%` } }),
                    ...(category && { category: { [Op.contains]: [category] } }),
                    ...(price_range && { price_range }),
                    ...(rating && { rating: { [Op.gte]: rating } }),
                }
            });
            console.log(dbRestaurants)
    
            // Step 2: Fetch data from Azure Maps API
            const mapRestaurants = await maps.searchNearbyAzureMaps(latitude, longitude, radius || 5000);
    
            
            // Filter Azure Maps results based on the provided criteria
            const filteredMapRestaurants = mapRestaurants.filter((restaurant) => {
                const matchesName = !name || restaurant.poi?.name?.toLowerCase().includes(name.toLowerCase());
                const matchesCategory = !category || restaurant.poi?.categories?.includes(category);
                const matchesPrice = !price_range || restaurant.poi?.priceCategory === price_range;
    
                // Combine all filters
                return matchesName && matchesCategory && matchesPrice;
            });
    
            // Step 3: Combine results from both sources
            const combinedData = [...dbRestaurants, ...filteredMapRestaurants];
    
            return { data: combinedData };
        } catch (error) {
            console.error('Error searching restaurants:', error);
            throw new Error('Failed to search restaurants.');
        }
    }
    
    async search(req, res){
    const { name, category, price_range, rating, latitude, longitude, radius } = req.body;

    try {
        const results = await this.searchRestaurants(req,{
            name,
            category,
            price_range,
            rating: parseFloat(rating),
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            radius: parseFloat(radius),
        });
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }}


    async searchAddress(req, res){
        try {
            const {address} = req.body;
            if(!address) return res.status(400).send({msg:"Invalid request"});
            const results = await maps.searchAddressAzureMaps(address);
            res.json({ data: results });
        } catch (error) {
            console.log(error);
        }
    }


    async addReview(req, res){
        const { username, user_id, review, rating, restaurant_id } = req.body;
    
        // Validate input
        if (!username || !user_id || !review || !rating || !restaurant_id) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
    
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
        }
    
        try {
            // Check if the restaurant exists
            // const restaurant = await req.app.get('models')['restaurants'].findByPk(restaurant_id);
            // if (!restaurant) {
            //     return res.status(404).json({ error: 'Restaurant not found.' });
            // }
    
            // Add the review
            const newReview = await req.app.get('models')['reviews'].create({
                username,
                user_id,
                review,
                rating,
                restaurant_id,
            });
    
            res.status(201).json({ message: 'Review added successfully.', data: newReview });
        } catch (error) {
            console.error('Error adding review:', error);
            res.status(500).json({ error: 'Failed to add review.' });
        }
    };
    


    
    async register(req, res) {
        const { firstname, lastname, email, password } = req.body;
    
        try {
            // Check if the email already exists
            const existingUser = await req.app.get('models')['users'].findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ error: 'Email already exists' });
            }
    
            // Hash the password
            const saltRounds = 10;
            const password_hash = await bcrypt.hash(password, saltRounds);
    
            // Create new user
            const newUser = await req.app.get('models')['users'].create({
                firstname,
                lastname,
                email,
                password_hash,
            });
    
            return res.status(201).json({ message: 'User registered successfully', user: { id: newUser.id, email: newUser.email } });
        } catch (error) {
            console.error('Error during registration:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    

    async login(req, res) {
        const { email, password } = req.body;
    
        try {
            // Check if the user exists
            const user = await req.app.get('models')['users'].findOne({ where: { email } });
            if (!user) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }
    
            // Compare the password
            const isPasswordValid = await bcrypt.compare(password, user.password_hash);
            if (!isPasswordValid) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }


    
            return res.status(200).json({ message: 'Login successful', user });
        } catch (error) {
            console.error('Error during login:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }




    /**
     * Admin functionality
     */

    async shutdownBusinessOwner(req, res) {
        const { id } = req.body;
    
        try {
            const owner = await req.app.get('models')['business_owners'].findOne({ where: { id } });
    
            if (!owner) {
                return res.status(404).json({ error: 'Business owner not found' });
            }
    
            // Update status to false
            owner.status = false;
            await req.app.get('models')['business_owners'].update(
                { status: false }, // Update object
                { where: { id: id } } // Condition
            );
    
            return res.status(200).json({ message: 'Business owner status updated to false' });
        } catch (error) {
            console.error('Error shutting down business owner:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }




    //duplicate listing
    async checkDuplicateListings(req, res) {
        try {
            const duplicates = await req.app.get('models')['restaurants'].findAll({
                attributes: ['name', 'address', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
                group: ['name', 'address'],
                having: sequelize.literal('COUNT(id) > 1'),
            });
    
            if (!duplicates.length) {
                return res.status(200).json({ message: 'No duplicate listings found' });
            }
    
            return res.status(200).json({ duplicates });
        } catch (error) {
            console.error('Error checking duplicate listings:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }


    async removeRestaurantsByOwner(req, res) {
        const { ownerId } = req.body;
    
        try {
            // Check if business owner exists
            const owner = await business_owners.findByPk(ownerId);
    
            if (!owner) {
                return res.status(404).json({ error: 'Business owner not found' });
            }
    
            // Check if the owner's status is false
            if (owner.status !== false) {
                return res.status(400).json({ error: 'Cannot remove restaurants. Business owner is still active.' });
            }
    
            // Remove all restaurants owned by this business owner
            await restaurants.destroy({ where: { ownerId } });
    
            return res.status(200).json({ message: 'All restaurants for the business owner have been removed' });
        } catch (error) {
            console.error('Error removing restaurants:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = UsersManagementHander;