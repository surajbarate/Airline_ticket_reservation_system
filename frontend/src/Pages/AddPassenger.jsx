import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";

const AddPassenger = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const flight = location.state?.flight;

    const [passengers, setPassengers] = useState([
        { name: "", age: "", gender: "" }
    ]);

    const [loading, setLoading] = useState(false);


    // ================= Auth Check =================
    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
        }

        if (!flight) {
            navigate("/dashboard");
        }

    }, [navigate, flight]);


    // ================= Add Passenger =================
    const addPassenger = () => {

        setPassengers([
            ...passengers,
            { name: "", age: "", gender: "" }
        ]);
    };


    // ================= Remove Passenger =================
    const removePassenger = (index) => {

        if (passengers.length === 1) return;

        const updated = passengers.filter((_, i) => i !== index);
        setPassengers(updated);
    };


    // ================= Handle Input =================
    const handleChange = (index, field, value) => {

        const updated = [...passengers];
        updated[index][field] = value;
        setPassengers(updated);
    };


    // ================= Total Price =================
    const totalPrice = flight
        ? flight.price * passengers.length
        : 0;


    // ================= Confirm Booking =================
    const handleConfirm = async () => {

        if (passengers.some(p => !p.name || !p.age || !p.gender)) {
            alert("Please fill all passenger details");
            return;
        }

        setLoading(true);

        try {

            await api.post(
                `http://localhost:8080/flight/booking/${flight.id}`,
                passengers,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            alert("Booking Successful! 🎉");
            navigate("/dashboard");

        } catch (err) {

            console.error(err);
            alert("Booking Failed ❌");

        } finally {
            setLoading(false);
        }
    };


    // ================= UI =================
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-rose-50 p-6">


            {/* HEADER */}
            <h1 className="text-3xl font-bold text-center mb-8">
                Passenger Details
            </h1>


            {/* FLIGHT DETAILS */}
            {flight && (

                <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow mb-8">

                    <h2 className="text-xl font-bold mb-3">
                        Flight Information
                    </h2>

                    <p><b>Flight:</b> {flight.flightNumber}</p>
                    <p><b>Route:</b> {flight.source} → {flight.destination}</p>
                    <p>
                        <b>Date:</b>{" "}
                        {new Date(flight.travelDate).toDateString()}
                    </p>

                    <p className="text-orange-600 font-bold text-lg">
                        Price per Passenger: ₹{flight.price}
                    </p>

                </div>
            )}


            {/* PASSENGER FORM */}
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">

                <h2 className="text-xl font-bold mb-4">
                    Passenger Information
                </h2>


                {passengers.map((passenger, index) => (

                    <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 border-b pb-4 items-center"
                    >

                        {/* Name */}
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={passenger.name}
                            onChange={(e) =>
                                handleChange(index, "name", e.target.value)
                            }
                            className="px-4 py-2 border rounded-lg"
                        />

                        {/* Age */}
                        <input
                            type="number"
                            placeholder="Age"
                            value={passenger.age}
                            onChange={(e) =>
                                handleChange(index, "age", e.target.value)
                            }
                            className="px-4 py-2 border rounded-lg"
                        />

                        {/* Gender */}
                        <select
                            value={passenger.gender}
                            onChange={(e) =>
                                handleChange(index, "gender", e.target.value)
                            }
                            className="px-4 py-2 border rounded-lg"
                        >
                            <option value="">Gender</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </select>

                        {/* Remove */}
                        <button
                            onClick={() => removePassenger(index)}
                            disabled={passengers.length === 1}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg disabled:opacity-50"
                        >
                            ❌
                        </button>

                    </div>
                ))}


                {/* ADD PASSENGER */}
                <button
                    onClick={addPassenger}
                    className="mb-6 px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                    + Add Passenger
                </button>


                {/* PRICE SUMMARY */}
                <div className="mb-6 p-4 bg-orange-50 border rounded-lg">

                    <h3 className="font-bold mb-2 text-lg">
                        💰 Price Summary
                    </h3>

                    <p>
                        Passengers: {passengers.length}
                    </p>

                    <p>
                        Price per Ticket: ₹{flight?.price}
                    </p>

                    <p className="text-xl font-bold text-green-600 mt-2">
                        Total Amount: ₹{totalPrice}
                    </p>

                </div>


                {/* CONFIRM */}
                <button
                    onClick={handleConfirm}
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold rounded-xl"
                >
                    {loading ? "Booking..." : `Confirm & Pay ₹${totalPrice}`}
                </button>

            </div>

        </div>
    );
};

export default AddPassenger;
