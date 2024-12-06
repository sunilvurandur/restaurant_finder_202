//UsersManagement Handler
const mapsHandler = require('../handlers/mapsHandler');
const maps = new mapsHandler();
const { Op } = require('sequelize');

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

        // console.log(mapRestaurants);
        // Merge Data: Combine data from both sources
        // const combinedData = mapRestaurants.map(mapRestaurant => {
        //     // Check if restaurant already exists in the database
        //     const dbRestaurant = dbRestaurants.find(db => 
        //         db?.name?.toLowerCase() === mapRestaurant.poi?.name?.toLowerCase()
        //     );
        //     // Combine data from both sources
        //     return {
        //         id: dbRestaurant.id || mapRestaurant.id, // Use DB id or generate a new UUID if not found
        //         name: mapRestaurant.name,
        //         address: mapRestaurant.address.freeformAddress || dbRestaurant?.address || 'Unknown Address',
        //         latitude: mapRestaurant.position.lat.toString(),
        //         longitude: mapRestaurant.position.lon.toString(),
        //         category: mapRestaurant.poi.categories || dbRestaurant?.category || ['Restaurant'],
        //         price_range: mapRestaurant.poi.priceCategory || dbRestaurant?.price_range || 'Medium',
        //         hours: mapRestaurant.openingHours ? mapRestaurant.openingHours : dbRestaurant?.hours || {},
        //         description: mapRestaurant.poi.name || dbRestaurant?.description || 'No Description',
        //         coverPhoto: dbRestaurant?.coverPhoto || null,
        //         photos: dbRestaurant?.photos || null,
        //         createdAt: dbRestaurant?.createdAt || new Date().toISOString(),
        //         updatedAt: dbRestaurant?.updatedAt || new Date().toISOString(),
        //     };
        // });
        const combinedData = [...dbRestaurants, ...mapRestaurants];

        combinedData.forEach(restaurant => {
            const lat = parseFloat(restaurant.latitude);
            const lon = parseFloat(restaurant.longitude);
            restaurant.distance = this.haversineDistance(latitude, longitude, lat, lon);
        });

        combinedData.sort((a, b) => a.distance - b.distance);

        return { data: combinedData };
    
        return { data: combinedData };
    }
        catch(error){console.log(error)}

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
        const { name, category, price_range, rating, latitude, longitude, radius } = query;

    
        try {
            // Step 1: Fetch data from the database
            const dbRestaurants = await req.app.get('models')['restaurants'].findAll({
                where: {
                    ...(name && { name: { [Op.iLike]: %${name}% } }),
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
    const { name, category, price_range, rating, latitude, longitude, radius } = req.query;

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





}

module.exports = UsersManagementHander;