import { userLogin, userRegister } from "../redux/features/auth/authActions";
import store from "../redux/store";

export const handleLogin = async (e, email, password, role) => {
  e.preventDefault();
  try {
    if (!role || !email || !password) {
      toast.error("Please provide all fields");
      return;
    }
    await store.dispatch(userLogin({ email, password, role }));
  } catch (error) {
    console.error(error);
    toast.error(error.message || "Login failed");
  }
};

export const handleRegister = async (e, name, role, email, password, phone) => {
  e.preventDefault();
  try {
    if (!name || !email || !password || !phone || !role) {
      toast.error("Please provide all fields");
      return;
    }
    await store.dispatch(userRegister({ name, role, email, password, phone }));
  } catch (error) {
    console.error(error);
    toast.error(error.message || "Registration failed");
  }
};
