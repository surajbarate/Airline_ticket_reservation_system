import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();


        try {
            const response = await api.post("/auth/login", {
                email,
                password,
            });

            // store user data

            console.log("Login response:", response.data);
            console.log("Login response:", response.data.token);

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data));
            navigate("/"); // next page
        } catch (err) {
            setError("Invalid email or password");
        }
    };

    return (
        <div style={styles.container}>
            <h2>Login</h2>

            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                />

                <input
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                />

                <button type="submit" style={styles.button}>
                    Login
                </button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

const styles = {
    container: {
        width: "300px",
        margin: "100px auto",
        textAlign: "center",
    },
    input: {
        width: "100%",
        padding: "8px",
        margin: "8px 0",
    },
    button: {
        width: "100%",
        padding: "8px",
        backgroundColor: "#28a745",
        color: "white",
        border: "none",
    },
};

export default Login;
