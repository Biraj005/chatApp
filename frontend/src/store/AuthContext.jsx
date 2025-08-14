import axios from "axios";
import { createContext, useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "./StoreContext";

export const AuthContext = createContext(null);

const backend_url = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backend_url;

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const { setUsers } = useContext(StoreContext);

  const [otpVerified, setOtpverified] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [userId, setUserId] = useState(() => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user)._id : null;
  });

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [userLoggedIn, setUserLoggedIn] = useState(!!token && !!user);

  useEffect(() => {
    console.log(userId);
    if (token && user) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUserLoggedIn(true);
    }
  }, [token, user, userId]);

  const getUsers = async () => {
    try {
      const response = await axios.get("api/user/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);
      setUsers(response.data.users);
    } catch (error) {
      console.error(error.message);
    }
  };

  const loginSignUp = async (type, form) => {
    try {
      let response;

      if (type === "Login") {
        response = await axios.post("/api/user/login", form);
      } else {
        response = await axios.post("/api/user/signup", form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (response.data.success) {
        const { user: userData, token: userToken } = response.data;
        setUser(userData);
        setToken(userToken);
        toast.success(response.data.message);
        setUserId(userData._id);
        navigate("/");
      } else {
        toast.error(response.data.message);
      }

      return response.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || `Error during ${type}`
      );
      return error.response?.data;
    }
  };

  const logoutCleanup = () => {
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    setUserLoggedIn(false);
  };

  const Logout = async () => {
    try {
      await axios.post("/api/user/logout", { user });
      logoutCleanup();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed.");
    }
  };

  const updateUser = async (formData) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put("/api/user/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response);

      if (response.data.success) {
        setUser(response.data.user);
        toast.success(response.data.message);
      }

      return response.data;
    } catch (error) {
      console.error(error.message);
      toast.error("Update failed");
      return error.response?.data;
    }
  };
  const getMessages = async (from, to) => {
    try {
      console.log(from, to)
      const response = await axios.get("/api/message/getmessages", {
        params: {
          from: from,
          to: to,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        return response.data;
      } else {
        toast.error(response.data.message || "Failed to fetch messages");
        return null;
      }
    } catch (error) {
      toast.error("Error while fetching messages");
      console.error(error.message);
      return [];
    }
  };
  const sendMessages = async (data) => {
    console.log(data)
    try {
      const response = await axios.post("/api/message/send", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success("Message sent");
        return response.data;
      } else {
        toast.error(response.data.message || "Failed to send message");
        return null;
      }
    } catch (error) {
      toast.error("Error while sending message");
      console.error(error.message);
      return null;
    }
  };

  const getOtp = async (email) => {
    try {
      const response = await axios.post("/api/user/forgotpassword", { email });
      if (response.data.success) {
        return response.data;
      } else {
        toast.error(response.data.message);
        return null;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return null;
    }

  };

  const verifyOtp = async (email, otp) => {
  try {
    const response = await axios.post("api/user/verify-otp", { otp, email });

    if (response.data.success) {
       setOtpverified(true);
      return response.data; 
    } else {
      toast.error(response.data.message);
      return null;
    }

  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
    return null;
  }
};

const Resetpassword = async (password, email) => {
  try {
    const response = await axios.post("/api/user/reset-password", {
      password,
      email
    });

    if (response.data.success) {
      return response.data;
    } else {
      toast.error(response.data.message || "Password is not updated");
      return null;
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
    return null;
  }
};

  const value = {
    user,
    token,
    userLoggedIn,
    loginSignUp,
    Logout,
    updateUser,
    getUsers,
    userId,
    getMessages,
    sendMessages,
    getOtp,
    verifyOtp,
    otpVerified,
    Resetpassword,
    setOtpverified
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
