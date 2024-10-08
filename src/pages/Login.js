import React, { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, error } = useLogin();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const success = await login(email, password);
        if (success) {
            navigate('/home');
        }
    };

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <h3>Log In</h3>

            <label>Email:</label>
            <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
            />

            <label>Password:</label>
            <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
            />

            <div className="ref">
                <a className="ref_link" href="/signup">Don't have an account? Sign up here</a>
            </div>

            <div>
                <button disabled={isLoading}>Log In</button>
                {error && <div className="error-message">{error}</div>}
            </div>
        </form>
    );
}

export default Login;

