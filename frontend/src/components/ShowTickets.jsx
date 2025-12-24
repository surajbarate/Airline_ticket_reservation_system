import React, { useEffect, useState } from "react";
import axios from "axios";

const ShowTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [showType, setShowType] = useState("CONFIRMED");

    useEffect(() => {
        fetchTickets("CONFIRMED");
    }, []);

    const fetchTickets = async (type) => {
        const token = localStorage.getItem("token");

        let url = "http://localhost:8080/user/showticket";

        if (type === "CANCELLED") {
            url = "http://localhost:8080/user/showticket/cancel";
        }

        try {
            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTickets(res.data);
            setShowType(type);
        } catch (err) {
            console.error(err);
            alert("Failed to load tickets");
        }
    };

    const cancelTicket = async (bookingId) => {
        const token = localStorage.getItem("token");

        if (!window.confirm("Are you sure you want to cancel this ticket?")) {
            return;
        }

        try {
            await axios.put(
                `http://localhost:8080/flight/booking/${bookingId}/cancel`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            alert("Ticket cancelled successfully");
            fetchTickets("CONFIRMED"); // refresh confirmed tickets
        } catch (error) {
            console.error(error);
            alert("Failed to cancel ticket");
        }
    };

    return (
        <div>
            <h2>🎟 My Tickets</h2>

            {/* Toggle Buttons */}
            <div style={{ marginBottom: "15px" }}>
                <button
                    onClick={() => fetchTickets("CONFIRMED")}
                    style={{
                        marginRight: "10px",
                        background: showType === "CONFIRMED" ? "green" : "gray",
                        color: "white",
                        padding: "8px",
                        border: "none"
                    }}
                >
                    Confirmed Tickets
                </button>

                <button
                    onClick={() => fetchTickets("CANCELLED")}
                    style={{
                        background: showType === "CANCELLED" ? "red" : "gray",
                        color: "white",
                        padding: "8px",
                        border: "none"
                    }}
                >
                    Cancelled Tickets
                </button>
            </div>

            {tickets.length === 0 ? (
                <p>No {showType.toLowerCase()} tickets</p>
            ) : (
                <table border="1" width="100%">
                    <thead>
                        <tr>
                            <th>Booking ID</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Date</th>
                            <th>Status</th>
                            {showType === "CONFIRMED" && <th>Action</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map(ticket => (
                            <tr key={ticket.id}>
                                <td>{ticket.id}</td>
                                <td>{ticket.flight.source}</td>
                                <td>{ticket.flight.destination}</td>
                                <td>{ticket.flight.travelDate}</td>
                                <td>{ticket.status}</td>

                                {showType === "CONFIRMED" && (
                                    <td>
                                        <button
                                            onClick={() => cancelTicket(ticket.id)}
                                            style={{
                                                background: "red",
                                                color: "white",
                                                border: "none",
                                                padding: "6px 10px",
                                                cursor: "pointer"
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ShowTickets;
