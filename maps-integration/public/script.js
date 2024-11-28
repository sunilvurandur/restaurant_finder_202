// script.js

// Function to handle the search request
function searchRestaurants() {
    const query = document.getElementById('search-query').value; // Get the search query from the input field
  
    if (!query) {
      alert("Please enter a search term.");
      return;
    }
  
    // Sending the GET request to the backend API
    fetch(`/search?query=${encodeURIComponent(query)}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          document.getElementById('results').innerHTML = `<p>${data.error}</p>`;
        } else {
          // Display results
          displayResults(data);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        document.getElementById('results').innerHTML = "<p>Something went wrong. Please try again later.</p>";
      });
  }
  
  // Function to display search results
  function displayResults(data) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clear any previous results
  
    // Iterate over the data (assuming it's an array of restaurants)
    data.forEach(restaurant => {
      const resultItem = document.createElement('div');
      resultItem.classList.add('result-item');
      resultItem.innerHTML = `
        <h3>${restaurant.name}</h3>
        <p>Location: ${restaurant.location}</p>
        <p>Rating: ${restaurant.rating}</p>
        <p>Price: ${restaurant.price}</p>
      `;
      resultsContainer.appendChild(resultItem);
    });
  }
  