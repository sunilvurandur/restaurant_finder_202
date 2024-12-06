import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import RestaurantSearch from "./RestaurantSearch"; // Assuming you have this component

const HomePage = () => {
  // const navigate = useNavigate();

  // Get the current user info from the Redux store
  // const currentUser = useSelector((state) => state.user); // Assuming user is in state.user

  // useEffect(() => {
  //   // Check if user is logged in and handle navigation
  //   if (currentUser) {
  //     if (currentUser.role === "admin") {
  //       navigate("/admin-dashboard"); // Redirect to admin dashboard
  //     } else if (currentUser.role === "businessOwner") {
  //       navigate("/business-owner-dashboard"); // Redirect to business owner dashboard
  //     }
  //   }
  // }, [currentUser, navigate]); // Dependency array ensures the effect runs when currentUser changes

  // If currentUser is not available yet, you can render a loading spinner or simply the search component
  // if (!currentUser) {
    // return <RestaurantSearch />;
  // }

  return (<>This is Hoome Page</>); // Since the user will be redirected, this component won't render anything here
};

export default HomePage;
