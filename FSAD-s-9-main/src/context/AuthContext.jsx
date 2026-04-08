import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for existing session
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            if (response.ok) {
                const data = await response.json();
                setUser(data);
                localStorage.setItem('user', JSON.stringify(data));
                return true;
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Invalid credentials!");
                return false;
            }
        } catch (error) {
            console.error("Login Error:", error);
            alert("Login Request Failed: " + error.message);
            return false;
        }
    };

    const signup = async (name, email, password, role) => {
        try {
            const response = await fetch('http://localhost:8080/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role })
            });
            
            if (response.ok) {
                return true;
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Signup failed!");
                return false;
            }
        } catch (error) {
            console.error("Signup Error:", error);
            alert("Signup Request Failed: " + error.message);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
