import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

// Create the authentication context
export const AuthContext = createContext();

// Create a custom hook to use the context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // If we have a token, fetch the user profile
        if (token) {
            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            const fetchUser = async () => {
                try {
                    const res = await api.get('/auth/me');
                    setUser(res.data);
                } catch (error) {
                    console.error("Failed to authenticate token", error);
                    logout();
                } finally {
                    setLoading(false);
                }
            };

            fetchUser();
        } else {
            setLoading(false);
            delete api.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
        }
    }, [token]);

    // Handle token updates from the URL (after Google OAuth redirect)
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get('token');

        if (urlToken) {
            setToken(urlToken);
            // Clean up the URL to prevent token shoulder surfing
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    const login = (jwtToken) => {
        setToken(jwtToken);
    };

    const logout = async () => {
        try {
            await api.get('/auth/logout');
        } catch (err) {
            console.error(err);
        } finally {
            setToken(null);
            setUser(null);
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, token, loading, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
