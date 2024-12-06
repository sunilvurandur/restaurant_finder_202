import  { useEffect, useState } from "react";


import RestaurantSearch from '../components/shared/RestaurantSearch';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to Restaurant Finder</h1>
      <RestaurantSearch />
    </div>
  );
};

export default HomePage;