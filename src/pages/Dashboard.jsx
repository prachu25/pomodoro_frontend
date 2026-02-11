import React, { useState, useEffect } from "react";
import {
    FaClock,
    FaChartBar,
    FaSignOutAlt,
    FaBars,
    FaBookOpen,
    FaCoffee,
    FaCalendarAlt,
    FaFire
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../api";

const Dashboard = () => {
    const [open, setOpen] = useState(false);
    const [summary, setSummary] = useState(null);
    const [streak, setStreak] = useState(null);

    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        // TODAY SUMMARY
        axios
            .get(`${BASE_URL}/api/dashboard/today?userId=${userId}`)
            .then((res) => setSummary(res.data))
            .catch(() => { });

        // STREAK DATA
        axios
            .get(`${BASE_URL}/api/dashboard/streak/${userId}`)
            .then((res) => setStreak(res.data))
            .catch(() => { });
    }, [userId]);

    const handleLogout = () => {
        localStorage.removeItem("userId");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-black text-white flex relative">

            {/* OVERLAY */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <div
                className={`
          fixed md:static top-0 left-0 h-screen w-64 bg-gray-900 p-6 z-40
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
            >
                <h1 className="text-2xl font-bold text-blue-500 mb-10">
                    FocusKeeper
                </h1>

                <nav className="flex flex-col gap-6 text-gray-300">
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-3 hover:text-white"
                        onClick={() => setOpen(false)}
                    >
                        <FaChartBar /> Dashboard
                    </Link>

                    <Link
                        to="/timer"
                        className="flex items-center gap-3 hover:text-white"
                        onClick={() => setOpen(false)}
                    >
                        <FaClock /> Timer Session
                    </Link>
                </nav>

                <div className="absolute bottom-10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 text-red-400 hover:text-red-500"
                    >
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </div>

            {/* MAIN */}
            <div className="flex-1 w-full">

                {/* MOBILE BAR */}
                <div className="md:hidden flex items-center bg-gray-900 p-4">
                    <button onClick={() => setOpen(true)}>
                        <FaBars size={22} />
                    </button>
                    <h1 className="ml-4 text-lg font-bold text-blue-500">
                        FocusKeeper
                    </h1>
                </div>

                <div className="p-6 md:p-10">

                    <h2 className="text-2xl md:text-3xl font-bold mb-6">
                        Dashboard Summary
                    </h2>

                    {/* STREAK (DYNAMIC) */}
                    <div className="bg-gray-900 p-6 rounded-xl mb-8 text-center">
                        <h3 className="text-gray-400 mb-3 flex items-center justify-center gap-2">
                            <FaFire className="text-orange-400" />
                            Current Streak
                        </h3>

                        <div className="flex justify-center gap-10">
                            <div>
                                <p className="text-3xl font-bold text-blue-500">
                                    {streak?.currentStreak || 0}
                                </p>
                                <p className="text-sm text-gray-400">Days</p>
                            </div>

                            <div>
                                <p className="text-3xl font-bold text-green-500">
                                    {streak?.maxStreak || 0}
                                </p>
                                <p className="text-sm text-gray-400">Best</p>
                            </div>
                        </div>
                    </div>

                    {/* SUMMARY CARDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">

                        <div className="bg-gray-900 p-6 rounded-xl">
                            <p className="text-gray-400">Total Study</p>
                            <h3 className="text-3xl font-bold text-blue-500 mt-2">
                                {summary?.totalStudyMinutes || 0} min
                            </h3>
                        </div>

                        <div className="bg-gray-900 p-6 rounded-xl">
                            <p className="text-gray-400">Study Sessions</p>
                            <h3 className="text-3xl font-bold text-green-500 mt-2">
                                {summary?.studySessions || 0}
                            </h3>
                        </div>

                        <div className="bg-gray-900 p-6 rounded-xl">
                            <p className="text-gray-400">Break Sessions</p>
                            <h3 className="text-3xl font-bold text-yellow-500 mt-2">
                                {summary?.breakSessions || 0}
                            </h3>
                        </div>
                    </div>

                    {/* TODAY ACTIVITY */}
                    <div className="bg-gray-900 p-6 rounded-xl">
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <FaCalendarAlt className="text-blue-400" />
                            Today's Activity
                        </h3>

                        {summary?.sessions?.length > 0 ? (
                            summary.sessions.map((s) => (
                                <div
                                    key={s.id}
                                    className="flex justify-between items-center border-b border-gray-700 py-3"
                                >
                                    <span className="flex items-center gap-2">
                                        {s.sessionType === "STUDY" ? (
                                            <FaBookOpen className="text-blue-400" />
                                        ) : (
                                            <FaCoffee className="text-green-400" />
                                        )}
                                        {s.sessionType === "STUDY"
                                            ? "Study Session"
                                            : "Break Session"}
                                    </span>

                                    <span className="text-blue-400 font-semibold">
                                        {s.minutes} min
                                    </span>

                                    <span className="text-gray-400 text-sm">
                                        {s.sessionDate}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400">No sessions today</p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
