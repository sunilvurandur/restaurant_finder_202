
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = 3000;
// Azure Maps subscription key (replace with your actual key)
// Serve static files (HTML, CSS, JS) from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));
// Endpoint to handle location search
app.get('/search', async (req, res) => {
    const query = req.query.query;  // Get the search query from the request
    if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
    }
    // Azure Maps API URL to search for places
    const url = `https://atlas.microsoft.com/search/fuzzy/json?query=${encodeURIComponent(query)}&api-version=1.0&subscription-key=${azureMapsKey}`;
    try {
        const response = await axios.get(url);
        // Send the search results back to the client
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching data from Azure Maps API:', error);
        res.status(500).json({ error: 'Failed to fetch data from Azure Maps API' });
    }
});
// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
