import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import SearchFlight from "../components/searchFlight";
import Profile from "../components/Profile";
import ShowTickets from "../components/ShowTickets";

const Home = () => {
    const [activePage, setActivePage] = useState("search");
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (activePage === "profile") {
            const token = localStorage.getItem("token");
            axios.get("http://localhost:8080/user/profile", {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => setUser(res.data))
                .catch(() => alert("Unauthorized"));
        }
    }, [activePage]);

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div>
            <nav style={styles.nav}>
                <h3>✈ Airline Management</h3>
                <div>
                    <button onClick={() => setActivePage("search")}>Search Flight</button>
                    <button onClick={() => setActivePage("profile")}>Profile</button>
                    <button onClick={() => setActivePage("tickets")}>Show Tickets</button>
                    <button onClick={logout} style={{ background: "red", color: "white" }}>Logout</button>
                </div>
            </nav>

            <div style={{ padding: "20px" }}>
                {activePage === "search" && <SearchFlight />}
                {activePage === "profile" && <Profile user={user} />}
                {activePage === "tickets" && <ShowTickets />}
            </div>
        </div>
    );
};

const styles = {
    nav: {
        display: "flex",
        justifyContent: "space-between",
        padding: "15px",
        background: "#1e293b",
        color: "white"
    }
};

export default Home;
