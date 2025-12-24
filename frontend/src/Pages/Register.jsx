import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            await api.post("/auth/register", {
                name: name,
                email: email,
                password: password,
            });

            alert("Registration successful!");
            navigate("/login");
        } catch (error) {
            alert(error.response?.data || "Registration failed");
        }
    };

    return (
        <div style={styles.container}>
            <h2>Register</h2>

            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={styles.input}
                />

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
                    Register
                </button>
            </form>
        </div>
    );
}

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
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
    },
};

export default Register;
