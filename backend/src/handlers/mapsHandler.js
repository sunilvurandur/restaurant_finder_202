// module.exports = ()=>{
// const nearbySearch = 
// }

const axios = require('axios');

const AZURE_MAPS_KEY = 'BONxG1YLyar4VokhBnTC5Rq0slEmh5ZhXNukOPW9SPmWgxSeMz52JQQJ99AKAC8vTInPp8evAAAgAZMP1C2u';



class mapsHandler{
    constructor(){}

async searchNearbyAzureMaps(latitude, longitude, radius){
    try {
        // const {latitude, longitude, radius} =  req.body
    const url = `https://atlas.microsoft.com/search/nearby/json?api-version=1.0&subscription-key=${AZURE_MAPS_KEY}&lat=${latitude}&lon=${longitude}&radius=${radius}&categorySet=7315`;
    const response = await axios.get(url);
    const results = response.data.results.map((item) => {
        const restaurant = {
            id: item.id, // Generate a unique ID for each restaurant
            name: item.poi.name,
            address: item.address.freeformAddress || 'Unknown Address',
            latitude: item.position.lat.toString(),
            longitude: item.position.lon.toString(),
            category: item.poi.categories || ['Restaurant'], // Default to 'Restaurant' if no category
            price_range: item.poi.priceCategory || 'Medium', // Default to 'Medium' if no price category
            hours: item.openingHours ? item.openingHours : null, // Default to 'Not Available' if no hours are available
            description: item.poi.name, // Using the name as a placeholder description
            coverPhoto: null, // No cover photo in Azure Maps response by default
            updatedAt: new Date().toISOString(), // Current timestamp for updatedAt
            createdAt: new Date().toISOString(), // Current timestamp for createdAt
            photos: null // No photos in Azure Maps by default
        };
        return restaurant;
    });
    return results;
    //  res.status(200).send({"data":results})
    } catch (error) {
        console.log(error.response);
        throw error;
    }
    
};

    
}

module.exports = mapsHandler;