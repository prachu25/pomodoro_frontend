import React, { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../api";

const Login = () => {
    const navigate = useNavigate();

    // STATES
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    // LOGIN FUNCTION
    const handleLogin = async (e) => {
        e.preventDefault();

        //  Basic validation
        if (password.length < 6) {
            setIsError(true);
            setMessage("Password must be at least 6 characters");
            return;
        }

        try {
            const res = await axios.post(`${BASE_URL}/api/auth/login`, {
                email,
                password,
            });

            // Save user data
            localStorage.setItem("userId", res.data.id);
            localStorage.setItem("name", res.data.name);
            localStorage.setItem("email", res.data.email);

            setIsError(false);
            setMessage("Login successful");

            // Redirect after short delay
            setTimeout(() => {
                navigate("/dashboard");
            }, 800);

        } catch (err) {
            setIsError(true);
            setMessage("Login failed Invalid email or password");
        }
    };

    return (
        <div className="bg-black min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md p-6 md:p-8 rounded-2xl bg-black">

                <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4 text-center tracking-wider">
                    FocusKeeper <br /> Login
                </h2>

                <p className="text-gray-500 text-center mb-6 text-sm md:text-base">
                    Don't have an account? create account,
                    <br /> it take less than minute
                </p>

                <form className="space-y-4" onSubmit={handleLogin}>

                    {/* EMAIL */}
                    <div className="flex items-center rounded-full px-4 py-3 bg-white">
                        <FaEnvelope className="text-gray-400 mr-3" />
                        <input
                            type="email"
                            placeholder="youremail@gmail.com"
                            className="w-full outline-none text-sm md:text-base"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* PASSWORD */}
                    <div className="flex items-center rounded-full px-4 py-3 bg-white mb-2">
                        <FaLock className="text-gray-400 mr-3" />

                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="w-full outline-none text-sm md:text-base"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-500 ml-2"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {/* LOGIN BUTTON */}
                    <button
                        type="submit"
                        className="w-full mt-2 bg-blue-500 text-white py-3 rounded-full font-semibold hover:bg-blue-600 transition"
                    >
                        Login
                    </button>

                    {/* MESSAGE */}
                    {message && (
                        <p
                            className={`text-center text-sm mt-2 ${isError ? "text-red-500" : "text-green-500"
                                }`}
                        >
                            {message}
                        </p>
                    )}

                    <Link
                        to="/register"
                        className="block text-center text-gray-400 text-sm mt-4"
                    >
                        Don't have an account? Create one
                    </Link>

                </form>
            </div>
        </div>
    );
};

export default Login;
