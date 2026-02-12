import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

const Ticket = () => {

    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("ALL"); // ALL | CONFIRMED | CANCELLED


    // ================= On Page Load =================
    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        loadTickets("ALL", token);

    }, [navigate]);


    // ================= Load Tickets By Filter =================
    const loadTickets = async (type, token) => {

        setLoading(true);
        setError("");

        let url = "";

        // Select API based on filter
        if (type === "CANCELLED") {
            url = "http://localhost:8080/user/showticket/cancel";
        } else {
            url = "http://localhost:8080/user/showticket";
        }

        try {

            const res = await api.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            let data = res.data || [];

            // For CONFIRMED → filter locally
            if (type === "CONFIRMED") {
                data = data.filter(b => b.status === "CONFIRMED");
            }

            setBookings(data);

            if (data.length === 0) {
                setError("No tickets found");
            }

        } catch (err) {

            console.error(err);
            setError("Failed to load tickets");

        } finally {
            setLoading(false);
        }
    };


    // ================= Cancel Ticket =================
    const cancelTicket = async (bookingId) => {

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this ticket?"
        );

        if (!confirmCancel) return;

        try {

            await api.put(
                `http://localhost:8080/flight/booking/${bookingId}/cancel`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Ticket cancelled successfully ✅");

            // Reload current filter
            loadTickets(filter, token);

        } catch (err) {

            console.error(err);

            if (err.response?.status === 403) {
                alert("Not authorized ❌");
            } else {
                alert("Cancel failed ❌");
            }
        }
    };


    // ================= Handle Filter Click =================
    const handleFilter = (type) => {

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        setFilter(type);
        loadTickets(type, token);
    };


    // ================= Loading =================
    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <h2 className="text-xl font-bold">Loading Tickets...</h2>
            </div>
        );
    }


    // ================= Error =================
    if (error) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center gap-4">

                <h2 className="text-2xl font-bold text-red-500">
                    {error}
                </h2>

                <button
                    onClick={() => navigate("/dashboard")}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg"
                >
                    Back to Dashboard
                </button>

            </div>
        );
    }


    // ================= UI =================
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-rose-50 p-6">


            {/* Heading */}
            <h1 className="text-3xl font-black text-center mb-4 text-green-600">
                🎫 My Tickets
            </h1>


            {/* Filters */}
            <div className="flex justify-center gap-4 mb-6">

                {/* <button
                    onClick={() => handleFilter("ALL")}
                    className={`px-4 py-2 rounded-lg font-bold ${filter === "ALL"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200"
                        }`}
                >
                    All
                </button> */}

                <button
                    onClick={() => handleFilter("CONFIRMED")}
                    className={`px-4 py-2 rounded-lg font-bold ${filter === "CONFIRMED"
                        ? "bg-green-600 text-white"
                        : "bg-gray-200"
                        }`}
                >
                    Confirmed
                </button>

                <button
                    onClick={() => handleFilter("CANCELLED")}
                    className={`px-4 py-2 rounded-lg font-bold ${filter === "CANCELLED"
                        ? "bg-red-600 text-white"
                        : "bg-gray-200"
                        }`}
                >
                    Cancelled
                </button>

            </div>


            <div className="max-w-4xl mx-auto space-y-6">


                {/* Tickets */}
                {bookings.map((booking) => (

                    <div
                        key={booking.id}
                        className="bg-white p-6 rounded-xl shadow border"
                    >

                        {/* Booking Info */}
                        <div className="border-b pb-3 mb-3">

                            <p><b>ID:</b> {booking.id}</p>

                            <p>
                                <b>Status:</b>{" "}
                                <span
                                    className={
                                        booking.status === "CANCELLED"
                                            ? "text-red-500 font-bold"
                                            : "text-green-600 font-bold"
                                    }
                                >
                                    {booking.status}
                                </span>
                            </p>

                            <p>
                                <b>Time:</b>{" "}
                                {new Date(booking.bookingTime).toLocaleString()}
                            </p>

                        </div>


                        {/* Flight Info */}
                        <div className="border-b pb-3 mb-3">

                            <h2 className="text-lg font-bold mb-2">
                                ✈️ Flight
                            </h2>

                            <p><b>No:</b> {booking.flight?.flightNumber}</p>

                            <p>
                                <b>Route:</b>{" "}
                                {booking.flight?.source} →
                                {booking.flight?.destination}
                            </p>

                            <p>
                                <b>Date:</b>{" "}
                                {new Date(
                                    booking.flight?.travelDate
                                ).toDateString()}
                            </p>

                            <p className="text-orange-600 font-bold">
                                ₹{booking.price}
                            </p>

                        </div>


                        {/* Passengers */}
                        <div className="mb-4">

                            <h2 className="text-lg font-bold mb-2">
                                👥 Passengers
                            </h2>

                            {booking.passengers?.length ? (

                                booking.passengers.map((p) => (

                                    <div
                                        key={p.id}
                                        className="flex justify-between border p-2 rounded mb-2"
                                    >
                                        <span>{p.name}</span>
                                        <span>{p.age}</span>
                                        <span>{p.gender}</span>
                                    </div>

                                ))

                            ) : (
                                <p className="text-gray-500">
                                    No passengers
                                </p>
                            )}

                        </div>


                        {/* Cancel */}
                        {booking.status !== "CANCELLED" && (

                            <button
                                onClick={() => cancelTicket(booking.id)}
                                className="w-full py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg"
                            >
                                ❌ Cancel Ticket
                            </button>

                        )}

                    </div>

                ))}


                {/* Back */}
                <button
                    onClick={() => navigate("/dashboard")}
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold rounded-xl mt-6"
                >
                    Back to Dashboard
                </button>

            </div>

        </div>
    );
};

export default Ticket;
