// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
    const navigate = useNavigate();

    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [travelDate, setTravelDate] = useState('');
    const [sources, setSources] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [flights, setFlights] = useState([]);

    useEffect(() => {
        const fetchAirports = async () => {
            try {
                const [srcRes, destRes] = await Promise.all([
                    axios.get('http://localhost:8080/flight/source'),
                    axios.get('http://localhost:8080/flight/destination'),
                ]);

                setSources(srcRes.data);
                setDestinations(destRes.data);
            } catch (err) {
                console.error('Failed to load airports', err);
            }
        };

        fetchAirports();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        setError('');
        setFlights([]);

        if (!source || !destination || !travelDate) {
            setError('Please select source, destination and travel date');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/flight/search', {
                params: { source, destination, travelDate },
            });
            setFlights(response.data);
        } catch (err) {
            setError('Failed to search flights. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-rose-50">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 sm:h-20">
                        {/* Logo */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-rose-500 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                                </svg>
                            </div>
                            <span className="text-lg sm:text-xl font-bold text-gray-900">SkyBook Airways</span>
                        </div>

                        {/* Auth Buttons */}
                        <div className="flex gap-2 sm:gap-3">
                            <button
                                onClick={() => navigate('/login')}
                                className="px-3 py-2 sm:px-5 sm:py-2 text-sm sm:text-base text-gray-700 hover:text-orange-600 font-semibold transition-colors"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="px-3 py-2 sm:px-5 sm:py-2 text-sm sm:text-base bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-semibold rounded-lg transition-all"
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-16">
                {/* Hero Section */}
                <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-orange-100 border border-orange-200 rounded-full mb-4 sm:mb-6">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs sm:text-sm font-bold text-orange-700">Book Your Next Adventure</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-3 sm:mb-4 lg:mb-6 leading-tight px-4">
                        Discover Your
                        <span className="block bg-gradient-to-r from-orange-600 via-rose-600 to-pink-600 bg-clip-text text-transparent mt-1 sm:mt-2">
                            Dream Destination
                        </span>
                    </h1>
                    <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
                        Compare flights from top airlines and find the best deals
                    </p>
                </div>

                {/* Search Card */}
                <div className="max-w-5xl mx-auto mb-8 sm:mb-12 lg:mb-16">
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-8">
                        <form onSubmit={handleSearch} className="space-y-4 sm:space-y-6">
                            {/* Input Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                                {/* From */}
                                <div className="w-full">
                                    <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                        From
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={source}
                                            onChange={(e) => setSource(e.target.value)}
                                            className="w-full px-3 py-3 sm:px-4 sm:py-3.5 bg-orange-50 border-2 border-orange-200 rounded-xl text-gray-800 text-sm sm:text-base font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition-all appearance-none cursor-pointer"
                                            required
                                        >
                                            <option value="">Choose city</option>
                                            {sources.map((city) => (
                                                <option key={city} value={city}>
                                                    {city}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* To */}
                                <div className="w-full">
                                    <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                        To
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={destination}
                                            onChange={(e) => setDestination(e.target.value)}
                                            className="w-full px-3 py-3 sm:px-4 sm:py-3.5 bg-rose-50 border-2 border-rose-200 rounded-xl text-gray-800 text-sm sm:text-base font-medium focus:outline-none focus:border-rose-500 focus:bg-white transition-all appearance-none cursor-pointer"
                                            required
                                        >
                                            <option value="">Choose destination</option>
                                            {destinations.map((city) => (
                                                <option key={city} value={city}>
                                                    {city}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Date */}
                                <div className="w-full sm:col-span-2 lg:col-span-1">
                                    <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={travelDate}
                                        onChange={(e) => setTravelDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-3 py-3 sm:px-4 sm:py-3.5 bg-amber-50 border-2 border-amber-200 rounded-xl text-gray-800 text-sm sm:text-base font-medium focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Search Button */}
                            <div className="flex justify-center pt-2 sm:pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full sm:w-auto px-8 sm:px-12 lg:px-16 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold text-base sm:text-lg rounded-xl shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Searching...' : 'Search Flights'}
                                </button>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="flex items-center justify-center gap-2 bg-red-50 border-2 border-red-200 rounded-xl px-4 py-3">
                                    <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-red-700 font-semibold text-sm sm:text-base">{error}</span>
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                {/* Flight Results */}
                {flights.length > 0 && (
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-6 sm:mb-8 text-center">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-2">Available Flights</h2>
                            <p className="text-base sm:text-lg text-gray-600">
                                Found {flights.length} flight{flights.length !== 1 ? 's' : ''} for you
                            </p>
                        </div>

                        <div className="space-y-4 sm:space-y-6">
                            {flights.map((flight) => (
                                <div
                                    key={flight.id}
                                    className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-shadow"
                                >
                                    {/* Mobile & Tablet Layout */}
                                    <div className="block lg:hidden">
                                        {/* Flight Number */}
                                        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-rose-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-orange-600 uppercase">Flight</div>
                                                <div className="text-xl font-black text-gray-900">{flight.flightNumber}</div>
                                            </div>
                                        </div>

                                        {/* Route */}
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="text-center flex-1">
                                                    <div className="text-xs font-bold text-gray-500 mb-1">FROM</div>
                                                    <div className="text-2xl sm:text-3xl font-black text-gray-900">{flight.source}</div>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    <svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                                                    </svg>
                                                </div>
                                                <div className="text-center flex-1">
                                                    <div className="text-xs font-bold text-gray-500 mb-1">TO</div>
                                                    <div className="text-2xl sm:text-3xl font-black text-gray-900">{flight.destination}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Date */}
                                        <div className="mb-4 flex items-center gap-2 text-gray-600">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-sm font-semibold">
                                                {new Date(flight.travelDate).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>

                                        {/* Price & CTA */}
                                        <div className="pt-4 border-t border-gray-200">
                                            <div className="flex items-center justify-between gap-4">
                                                <div>
                                                    <div className="text-xs font-bold text-gray-500 uppercase mb-1">Price</div>
                                                    <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                                                        ${flight.price}
                                                    </div>
                                                </div>
                                                <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold rounded-lg transition-all"
                                                    onClick={() => navigate('/login')}
                                                >
                                                    Book Now
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Desktop Layout */}
                                    <div className="hidden lg:flex items-center justify-between gap-8">
                                        {/* Flight Info */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-rose-500 rounded-lg flex items-center justify-center">
                                                    <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-orange-600 uppercase">Flight</div>
                                                    <div className="text-2xl font-black text-gray-900">{flight.flightNumber}</div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between gap-6">
                                                <div className="text-center">
                                                    <div className="text-sm font-bold text-gray-500 mb-2">FROM</div>
                                                    <div className="text-3xl font-black text-gray-900">{flight.source}</div>
                                                </div>

                                                <div className="flex-1 max-w-xs">
                                                    <div className="h-1 bg-gradient-to-r from-orange-400 to-rose-400 rounded-full"></div>
                                                </div>

                                                <div className="text-center">
                                                    <div className="text-sm font-bold text-gray-500 mb-2">TO</div>
                                                    <div className="text-3xl font-black text-gray-900">{flight.destination}</div>
                                                </div>
                                            </div>

                                            <div className="mt-6 flex items-center gap-2 text-gray-600">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="font-semibold">
                                                    {new Date(flight.travelDate).toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Price & CTA */}
                                        <div className="flex flex-col items-center gap-4 border-l-2 border-gray-200 pl-8">
                                            <div className="text-center">
                                                <div className="text-sm font-bold text-gray-500 uppercase mb-2">Price</div>
                                                <div className="text-5xl font-black bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                                                    ${flight.price}
                                                </div>
                                            </div>
                                            <button className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold text-lg rounded-lg transition-all"
                                                onClick={() => navigate('/login')}
                                            >
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Features Section - Only show when no flights */}
                {flights.length === 0 && (
                    <div className="mt-12 sm:mt-16 lg:mt-20">
                        <h3 className="text-2xl sm:text-3xl font-black text-gray-900 text-center mb-8 sm:mb-12">Why Choose Us?</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            <div className="text-center p-4">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h4 className="text-lg sm:text-xl font-black text-gray-900 mb-2 sm:mb-3">Best Prices</h4>
                                <p className="text-sm sm:text-base text-gray-600">Get the lowest fares guaranteed</p>
                            </div>

                            <div className="text-center p-4">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h4 className="text-lg sm:text-xl font-black text-gray-900 mb-2 sm:mb-3">Instant Booking</h4>
                                <p className="text-sm sm:text-base text-gray-600">Quick and secure confirmation</p>
                            </div>

                            <div className="text-center p-4 sm:col-span-2 lg:col-span-1">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <h4 className="text-lg sm:text-xl font-black text-gray-900 mb-2 sm:mb-3">24/7 Support</h4>
                                <p className="text-sm sm:text-base text-gray-600">Always here to help you</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;