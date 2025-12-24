import React, { useState, useEffect } from "react";
import axios from "axios";

const AddPassenger = () => {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [passengers, setPassengers] = useState([]); // Initialize as empty array
    const [showPayment, setShowPayment] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("");


    const bookingId = localStorage.getItem("bookingId");
    const token = localStorage.getItem("token");

    // Fetch passengers on page load
    useEffect(() => {
        if (bookingId && token) {
            fetchPassengers();
        } else {
            console.warn("Missing bookingId or token");
        }
    }, []);

    const fetchPassengers = async () => {
        const currentToken = localStorage.getItem('token'); // Fresh read

        if (!currentToken || !bookingId) {
            alert("Please login and select a booking.");
            return;
        }

        try {
            const res = await axios.get(
                `http://localhost:8080/flight/booking/${bookingId}/passenger`,
                {
                    headers: {
                        Authorization: `Bearer ${currentToken}`
                    }
                }
            );

            // Ensure data is an array
            const data = res.data;
            if (Array.isArray(data)) {
                setPassengers(data);
            } else if (data === null || data === undefined) {
                setPassengers([]); // Treat null/undefined as empty list
            } else {
                console.error("Unexpected data format from backend:", data);
                setPassengers([]); // Fallback
            }
        } catch (error) {
            console.error("Error fetching passengers:", error);
            setPassengers([]); // Reset to empty on error
            if (error.response?.status === 403) {
                alert("Session expired or unauthorized. Please login again.");
            } else {
                alert("Failed to load passengers");
            }
        }
    };

    const addPassenger = async () => {
        if (!name || !age || !gender) {
            alert("Please fill all fields");
            return;
        }

        const currentToken = localStorage.getItem('token');
        if (!currentToken || !bookingId) {
            alert("Please login and select a booking.");
            return;
        }

        try {
            await axios.post(
                `http://localhost:8080/flight/booking/${bookingId}/passenger`,
                { name, age, gender },
                {
                    headers: {
                        Authorization: `Bearer ${currentToken}`
                    }
                }
            );

            alert("Passenger added successfully!");
            setName("");
            setAge("");
            setGender("");
            fetchPassengers(); // Refresh
        } catch (error) {
            console.error("Error adding passenger:", error);
            if (error.response?.status === 403) {
                alert("Unauthorized. Please login again.");
            } else {
                alert("Failed to add passenger");
            }
        }
    };

    return (
        <div style={{ width: "500px", margin: "40px auto" }}>
            <h2>Add Passenger</h2>

            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
            />

            <input
                type="number"
                placeholder="Age"
                value={age}
                onChange={e => setAge(e.target.value)}
                style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
            />

            <select
                value={gender}
                onChange={e => setGender(e.target.value)}
                style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
            >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
            </select>

            <button
                onClick={addPassenger}
                style={{ width: "100%", background: "green", color: "white", padding: "12px", border: "none", fontSize: "16px" }}
            >
                Add Passenger
            </button>

            {/* Passenger List - Safe rendering */}
            <h3 style={{ marginTop: "30px" }}>Passenger List</h3>
            {Array.isArray(passengers) && passengers.length > 0 ? (
                <table border="1" width="100%" style={{ marginTop: "10px" }}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Gender</th>
                        </tr>
                    </thead>
                    <tbody>
                        {passengers.map((p, index) => (
                            <React.Fragment key={p.id || index}>
                                <tr>
                                    <td>{p.name}</td>
                                    <td>{p.age}</td>
                                    <td>{p.gender}</td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No passengers added yet.</p>
            )}

            {Array.isArray(passengers) && passengers.length > 0 && (
                <button
                    onClick={() => setShowPayment(true)}
                    style={{
                        width: "100%",
                        background: "blue",
                        color: "white",
                        padding: "12px",
                        marginTop: "20px",
                        border: "none",
                        fontSize: "16px"
                    }}
                >
                    Proceed to Payment
                </button>
            )}

            {showPayment && (
                <div style={{ marginTop: "30px", border: "1px solid #ccc", padding: "15px" }}>
                    <h3>Payment Summary</h3>

                    <p>
                        <b>Total Passengers:</b> {passengers.length}
                    </p>

                    <p>
                        <b>Price per Passenger:</b> ₹4500
                    </p>

                    <p>
                        <b>Total Amount:</b> ₹{passengers.length * 4500}
                    </p>

                    <select
                        value={paymentMethod}
                        onChange={e => setPaymentMethod(e.target.value)}
                        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
                    >
                        <option value="">Select Payment Method</option>
                        <option value="UPI">UPI</option>
                        <option value="CARD">Credit / Debit Card</option>
                        <option value="NETBANKING">Net Banking</option>
                    </select>

                    <button
                        onClick={async () => {
                            if (!paymentMethod) {
                                alert("Please select payment method");
                                return;
                            }

                            try {
                                await axios.put(
                                    `http://localhost:8080/flight/booking/${bookingId}/confirm`,
                                    {},
                                    {
                                        headers: {
                                            Authorization: `Bearer ${token}`
                                        }
                                    }
                                );

                                alert("Payment successful! Booking confirmed ✈️");
                            } catch (err) {
                                alert("Payment failed or booking confirmation error");
                            }
                        }}
                    >
                        Pay Now
                    </button>
                </div>
            )}

        </div>
    );
};

export default AddPassenger;