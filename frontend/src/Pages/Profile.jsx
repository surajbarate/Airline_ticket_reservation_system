// src/pages/Profile.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {

    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ---------------- AUTH + FETCH PROFILE ----------------
    useEffect(() => {

        const token = localStorage.getItem("token");

        // If token missing → Login
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchProfile = async () => {

            try {

                const res = await axios.get(
                    "http://localhost:8080/user/profile",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setProfile(res.data);

            } catch (err) {

                console.error("Profile error:", err);

                if (err.response?.status === 401) {
                    localStorage.clear();
                    navigate("/login");
                } else {
                    setError("Failed to load profile");
                }

            } finally {
                setLoading(false);
            }
        };

        fetchProfile();

    }, [navigate]);

    // ---------------- LOADING ----------------
    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center text-xl font-bold">
                Loading Profile...
            </div>
        );
    }

    // ---------------- ERROR ----------------
    if (error) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center">

                <p className="text-red-600 font-bold mb-4">
                    {error}
                </p>

                <button
                    onClick={() => navigate("/dashboard")}
                    className="px-5 py-2 bg-orange-500 text-white rounded-lg"
                >
                    Back
                </button>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-rose-50 p-6">

            <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg border">

                {/* HEADER */}
                <h1 className="text-3xl font-black text-center text-orange-600 mb-6">
                    👤 My Profile
                </h1>

                {/* PROFILE INFO */}
                <div className="space-y-5">

                    {/* NAME */}
                    <div className="flex justify-between border-b pb-2">
                        <span className="font-semibold text-gray-600">
                            Name
                        </span>

                        <span className="font-bold text-gray-900">
                            {profile?.name}
                        </span>
                    </div>

                    {/* EMAIL */}
                    <div className="flex justify-between border-b pb-2">
                        <span className="font-semibold text-gray-600">
                            Email
                        </span>

                        <span className="font-bold text-gray-900">
                            {profile?.email}
                        </span>
                    </div>

                </div>

                {/* BUTTONS */}
                <div className="mt-8 flex gap-4">

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="w-full py-3 bg-gray-200 rounded-lg font-semibold hover:bg-gray-300"
                    >
                        Back
                    </button>

                    <button
                        onClick={() => {
                            localStorage.clear();
                            navigate("/login");
                        }}
                        className="w-full py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold rounded-lg"
                    >
                        Logout
                    </button>

                </div>

            </div>

        </div>
    );
};

export default Profile;
