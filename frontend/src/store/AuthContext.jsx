import axios from 'axios';
import  { createContext, useState, useEffect } from 'react';
import { useContext } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from './StoreContext';



export const AuthContext = createContext(null);

const backend_url = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backend_url;
export const AuthProvider = ({ children }) => {

    const navigate = useNavigate();
    const {setUsers} = useContext(StoreContext);
    const [token, setToken] = useState(() => localStorage.getItem('token'));
   const [userId, setUserId] = useState(() => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user)._id : null;
        });


    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [userLoggedIn, setUserLoggedIn] = useState(!!token && !!user);

    useEffect(() => {
        console.log(userId)
        if (token && user) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUserLoggedIn(true);
        }
    }, [token, user]);
    const getUsers = async ()=>{

        try {
            const response =await axios.get("api/user/users"
                ,{headers: {
                    'Authorization': `Bearer ${token}`,
                },}
            )

            console.log(response.data);
            setUsers(response.data.users);

            
        } catch (error) {
            
        }


    }
    const loginSignUp = async (type, form) => {
        try {
            let response;

            if (type === "Login") {
                response = await axios.post('/api/user/login', form);
                
            } else {
                response = await axios.post('/api/user/signup', form, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }

            if (response.data.success) {
                const { user: userData, token: userToken } = response.data;
                setUser(userData);
                setToken(userToken);
                toast.success(response.data.message);
                setUserId(response.data.user._id);
                navigate('/');
            } else {
                toast.error(response.data.message);
            }

            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || `Error during ${type}`);
            return error.response?.data;
        }
    };


    const logoutCleanup = () => {
        delete axios.defaults.headers.common['Authorization'];
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
        setUserLoggedIn(false);
    };

    const Logout = async () => {
        try {
            await axios.post('/api/user/logout', { user });
            logoutCleanup();
            toast.success("Logged out successfully");
            navigate('/login');
        } catch (error) {
            toast.error("Logout failed.");
        }
    };

    const updateUser = async (formData) => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.put('/api/user/update', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log(response);

            if (response.data.success) {
                setUser(response.data.user);
                toast.success(response.data.message);
            }

            return response.data;
        } catch (error) {
            console.log(error.message);
            toast.error("Update failed");
            return error.response?.data;
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
        userId
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
