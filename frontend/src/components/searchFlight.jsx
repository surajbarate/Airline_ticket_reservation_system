import React, { useState, useEffect } from "react";
import axios from "axios";

const SearchFlight = ({ onSelectFlight }) => {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [date, setDate] = useState("");

    const [sources, setSources] = useState([]);
    const [destinations, setDestinations] = useState([]);

    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedFlight, setSelectedFlight] = useState(null);

    // 🔹 Fetch dropdown data when component loads
    useEffect(() => {
        axios.get("http://localhost:8080/flight/source")
            .then(res => setSources(res.data))
            .catch(err => console.error(err));

        axios.get("http://localhost:8080/flight/destination")
            .then(res => setDestinations(res.data))
            .catch(err => console.error(err));
    }, []);

    const searchFlights = () => {
        if (!from || !to || !date) {
            alert("Please select all fields");
            return;
        }

        setLoading(true);

        axios.get("http://localhost:8080/flight/search", {
            params: { source: from, destination: to, travelDate: date }
        })
            .then(res => {
                setFlights(res.data);
                setSelectedFlight(null);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    const selectFlight = (flight) => {
        setSelectedFlight(flight);
        onSelectFlight(flight);
    };

    const confirmBooking = async () => {
        if (!selectedFlight) {
            alert("Please select a flight first");
            return;
        }

        try {
            // ✅ get token (same as profile API)
            const token = localStorage.getItem("token");

            if (!token) {
                alert("Please login first");
                return;
            }

            const response = await axios.post(
                `http://localhost:8080/flight/booking/${selectedFlight.id}`,
                {}, // body not required
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const bookingId = response.data.id;

            // store bookingId for passenger step
            localStorage.setItem("bookingId", bookingId);

            alert("Booking created successfully");

            // navigate to passenger page
            window.location.href = "/add-passenger";

        } catch (error) {
            console.error(error);

            if (error.response?.status === 403) {
                alert("You are not authorized. Please login again.");
            } else {
                alert("Booking failed");
            }
        }
    };



    return (
        <div>
            <h2>Search Flight</h2>

            {/* SOURCE DROPDOWN */}
            <select value={from} onChange={e => setFrom(e.target.value)}>
                <option value="">Select Source</option>
                {sources.map((src, index) => (
                    <option key={index} value={src}>{src}</option>
                ))}
            </select>

            {/* DESTINATION DROPDOWN */}
            <select value={to} onChange={e => setTo(e.target.value)}>
                <option value="">Select Destination</option>
                {destinations.map((dest, index) => (
                    <option key={index} value={dest}>{dest}</option>
                ))}
            </select>

            {/* DATE */}
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />

            <button onClick={searchFlights}>Search</button>

            {loading && <p>Loading...</p>}

            {/* SEARCH RESULT TABLE */}
            {flights.length > 0 && (
                <table border="1" style={{ marginTop: "20px" }}>
                    <thead>
                        <tr>
                            <th>Flight Number</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Date</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {flights.map(flight => (
                            <tr key={flight.id}>
                                <td>{flight.flightNumber}</td>
                                <td>{flight.source}</td>
                                <td>{flight.destination}</td>
                                <td>{flight.travelDate}</td>
                                <td>{flight.price}</td>
                                <td>
                                    <button onClick={() => selectFlight(flight)}>Select</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* SELECTED FLIGHT */}
            {selectedFlight && (
                <div style={{ border: "1px solid #ccc", marginTop: "20px", padding: "15px" }}>
                    <h3>Selected Flight</h3>
                    <p><b>Flight:</b> {selectedFlight.flightNumber}</p>
                    <p><b>Route:</b> {selectedFlight.source} → {selectedFlight.destination}</p>
                    <p><b>Date:</b> {selectedFlight.travelDate}</p>
                    <p><b>Price:</b> ₹{selectedFlight.price}</p>

                    <button
                        onClick={confirmBooking}
                        style={{ background: "green", color: "white", padding: "8px" }}
                    >
                        Confirm Booking
                    </button>

                </div>
            )}
        </div>
    );
};

export default SearchFlight;
