import axios from 'axios';
import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [userLoggedIn, setUserLoggedIn] = useState(!!token && !!user);

    useEffect(() => {
        if (token && user) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUserLoggedIn(true);
        }
    }, [token, user]);

    const loginSignUp = async (type, form) => {
        try {
            const response = await axios.post(`/api/user/${type}`, form);
            if (response.data.success) {
                const { user: userData, token: userToken } = response.data;
                setUser(userData);
                setToken(userToken);
                toast.success(response.data.message);
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

    const updateUser = async (updateData) => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.put('/api/user/update', updateData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log(response.data);
            if (response.data.success) {
                setUser(response.data.user);
                toast.success(response.data.message);
            }

            return response.data;
        } catch (error) {
            console.log(error.message);
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
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
