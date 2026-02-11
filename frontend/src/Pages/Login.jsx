// src/pages/login.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Login = () => {
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);

    // Common
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Register only
    const [name, setName] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // ---------------- LOGIN ----------------
    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await api.post("/auth/login", {
                email,
                password,
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data));

            navigate("/dashboard");
        } catch (err) {
            setError("Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    // ---------------- REGISTER ----------------
    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await api.post("/auth/register", {
                name,
                email,
                password,
            });

            alert("Registration Successful!");
            setIsLogin(true);
        } catch (err) {
            setError(err.response?.data || "Registration Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-rose-50">

            {/* Navbar */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center h-20">

                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-rose-500 rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-white"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                                </svg>
                            </div>

                            <span className="text-xl font-bold text-gray-900">
                                SkyBook Airways
                            </span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main */}
            <div className="flex justify-center items-center py-16 px-4">

                {/* Card */}
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-8">

                    {/* Title */}
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-black text-gray-900 mb-2">
                            {isLogin ? "Welcome Back" : "Create Account"}
                        </h2>

                        <p className="text-gray-600">
                            {isLogin
                                ? "Login to continue booking"
                                : "Register to start your journey"}
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-semibold">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form
                        onSubmit={isLogin ? handleLogin : handleRegister}
                        className="space-y-4"
                    >
                        {/* Name (Register only) */}
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="w-full px-4 py-3 bg-orange-50 border-2 border-orange-200 rounded-xl focus:outline-none focus:border-orange-500"
                                />
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Email
                            </label>

                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 bg-orange-50 border-2 border-orange-200 rounded-xl focus:outline-none focus:border-orange-500"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Password
                            </label>

                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 bg-rose-50 border-2 border-rose-200 rounded-xl focus:outline-none focus:border-rose-500"
                            />
                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-60"
                        >
                            {loading
                                ? "Please wait..."
                                : isLogin
                                    ? "Login"
                                    : "Register"}
                        </button>
                    </form>

                    {/* Toggle */}
                    <div className="mt-6 text-center text-gray-600">

                        {isLogin ? (
                            <>
                                Don't have an account?{" "}
                                <button
                                    onClick={() => {
                                        setIsLogin(false);
                                        setError("");
                                    }}
                                    className="font-bold text-orange-600 hover:underline"
                                >
                                    Sign Up
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <button
                                    onClick={() => {
                                        setIsLogin(true);
                                        setError("");
                                    }}
                                    className="font-bold text-orange-600 hover:underline"
                                >
                                    Login
                                </button>
                            </>
                        )}

                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;
