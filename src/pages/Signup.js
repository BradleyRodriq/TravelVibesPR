import React, { useState } from "react";
import { useSignup } from "../hooks/useSignup";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signup, isLoading, error } = useSignup();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const success = await signup(email, password);
        if (success) {
            navigate('/signupthanks');
        }
    };

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <h3>Sign up</h3>

            <label>Email:</label>
            <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}/>
                <div className="help">
                <small className="helper-text">Enter your email address.</small>
                </div>

            <label>Password:</label>
            <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
            />
            <div className="help">
            <small className="helper-text">Password must be at least 8 characters long, and must contain one of the following: uppercase, lowercase, symbol, and a number. </small>
            </div>
            <div className="ref">
            <a className="ref_link" href="/login">Already have an account? Login here</a>
            </div>
            <div>
                <button disabled={isLoading}>Sign Up</button>
                {error && <div className="error-message">{error}</div>}
            </div>
        </form>
    );
};

export default Signup;
