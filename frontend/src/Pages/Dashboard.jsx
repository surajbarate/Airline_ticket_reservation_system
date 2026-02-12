// src/pages/Dashboard.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
    const navigate = useNavigate();

    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");
    const [travelDate, setTravelDate] = useState("");

    const [sources, setSources] = useState([]);
    const [destinations, setDestinations] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [flights, setFlights] = useState([]);

    // Profile menu state
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    // ---------------- AUTH CHECK ----------------
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    // ---------------- FETCH AIRPORTS ----------------
    useEffect(() => {
        const fetchAirports = async () => {
            try {
                const [srcRes, destRes] = await Promise.all([
                    axios.get("http://localhost:8080/flight/source"),
                    axios.get("http://localhost:8080/flight/destination"),
                ]);

                setSources(srcRes.data);
                setDestinations(destRes.data);
            } catch (err) {
                console.error("Failed to load airports", err);
            }
        };

        fetchAirports();
    }, []);

    // ---------------- SEARCH ----------------
    const handleSearch = async (e) => {
        e.preventDefault();

        setError("");
        setFlights([]);

        if (!source || !destination || !travelDate) {
            setError("Please select source, destination and date");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.get(
                "http://localhost:8080/flight/search",
                {
                    params: { source, destination, travelDate },
                }
            );

            setFlights(res.data);
        } catch (err) {
            setError("Search failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    // ---------------- LOGOUT ----------------
    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    // ---------------- BOOKING ----------------
    const handleBook = (flight) => {
        navigate("/add-passenger", {
            state: { flight }
        });
    };

    // ---------------- SHOW TICKET ----------------
    const handleShowTicket = () => {
        const token = localStorage.getItem("token");

        if (!token || token === "undefined") {
            alert("Please login first");
            navigate("/login");
            return;
        }

        navigate("/ticket");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-rose-50">

            {/* NAVBAR */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center h-20">

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

                        {/* Buttons */}
                        <div className="flex items-center gap-3 relative">

                            {/* Show Ticket */}
                            <button
                                onClick={handleShowTicket}
                                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-rose-600 text-sm md:text-base"
                            >
                                Show Ticket
                            </button>

                            {/* Profile Button */}
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="w-10 h-10 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center hover:bg-orange-600"
                            >
                                👤
                            </button>

                            {/* Profile Dropdown */}
                            {showProfileMenu && (
                                <div className="absolute right-0 top-14 bg-white shadow-lg rounded-lg w-40 border z-50">

                                    <button
                                        onClick={() => {
                                            navigate("/profile");
                                            setShowProfileMenu(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                        My Profile
                                    </button>

                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                                    >
                                        Logout
                                    </button>

                                </div>
                            )}

                        </div>

                    </div>
                </div>
            </nav>

            {/* MAIN */}
            <div className="max-w-7xl mx-auto px-4 py-12">

                {/* Heading */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black text-gray-900 mb-3">
                        Welcome to Dashboard
                    </h1>

                    <p className="text-lg text-gray-600">
                        Search and book your flights easily
                    </p>
                </div>

                {/* SEARCH CARD */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="bg-white rounded-2xl shadow-lg border p-6">

                        <form
                            onSubmit={handleSearch}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                {/* FROM */}
                                <select
                                    value={source}
                                    onChange={(e) => setSource(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl bg-orange-50"
                                >
                                    <option value="">From</option>
                                    {sources.map((city) => (
                                        <option key={city}>{city}</option>
                                    ))}
                                </select>

                                {/* TO */}
                                <select
                                    value={destination}
                                    onChange={(e) =>
                                        setDestination(e.target.value)
                                    }
                                    className="w-full px-4 py-3 border-2 border-rose-200 rounded-xl bg-rose-50"
                                >
                                    <option value="">To</option>
                                    {destinations.map((city) => (
                                        <option key={city}>{city}</option>
                                    ))}
                                </select>

                                {/* DATE */}
                                <input
                                    type="date"
                                    value={travelDate}
                                    min={
                                        new Date()
                                            .toISOString()
                                            .split("T")[0]
                                    }
                                    onChange={(e) =>
                                        setTravelDate(e.target.value)
                                    }
                                    className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl bg-amber-50"
                                />

                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold rounded-xl"
                            >
                                {loading ? "Searching..." : "Search Flights"}
                            </button>

                            {error && (
                                <div className="text-red-600 font-semibold text-center">
                                    {error}
                                </div>
                            )}

                        </form>

                    </div>
                </div>

                {/* RESULTS */}
                {flights.length > 0 && (
                    <div className="space-y-6">

                        {flights.map((flight) => (
                            <div
                                key={flight.id}
                                className="bg-white p-6 rounded-xl shadow border flex justify-between items-center"
                            >
                                <div>
                                    <h3 className="text-xl font-bold">
                                        {flight.flightNumber}
                                    </h3>

                                    <p className="text-gray-600">
                                        {flight.source} → {flight.destination}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        {new Date(
                                            flight.travelDate
                                        ).toDateString()}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-2xl font-black text-orange-600">
                                        {flight.price}.00
                                    </p>

                                    <button
                                        onClick={() => handleBook(flight)}
                                        className="mt-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-lg"
                                    >
                                        Book
                                    </button>
                                </div>

                            </div>
                        ))}

                    </div>
                )}

            </div>
        </div>
    );
};

export default Dashboard;
