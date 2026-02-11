import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlay, FaPause, FaRedo, FaCoffee } from "react-icons/fa";
import { BASE_URL } from "../api";

const Timer = () => {
    const [studyMinutes, setStudyMinutes] = useState(25);
    const [breakMinutes, setBreakMinutes] = useState(5);
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [mode, setMode] = useState("study");

    const userId = localStorage.getItem("userId");

    // BELL SOUND
    const playBell = () => {
        const audio = new Audio("/bell.mp3");
        audio.play();
    };

    // END-BELL SOUND
    const playEndBell = () => {
        const audio = new Audio("/endbell.mp3");
        audio.play();
    };

    // TIMER LOGIC
    useEffect(() => {
        let interval = null;

        if (isRunning && time > 0) {
            interval = setInterval(() => {
                setTime((prev) => prev - 1);
            }, 1000);
        }

        // SESSION END
        if (time === 0 && isRunning) {
            setIsRunning(false);
            playEndBell(); // end sound

            if (mode === "study") {
                axios.post(`${BASE_URL}/api/pomodoro/study`, {
                    userId,
                    minutes: studyMinutes,
                });
            }

            if (mode === "break") {
                axios.post(`${BASE_URL}/api/pomodoro/break`, {
                    userId,
                    minutes: breakMinutes,
                });
            }
        }

        return () => clearInterval(interval);
    }, [isRunning, time]);

    // FORMAT TIME
    const formatTime = () => {
        const mins = Math.floor(time / 60);
        const secs = time % 60;
        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    // PLAY / PAUSE
    const toggleTimer = () => {
        if (time === 0) {
            playBell(); // start sound
            setMode("study");
            setTime(studyMinutes * 60);
            setIsRunning(true);
        } else {
            setIsRunning(!isRunning);
        }
    };

    // START BREAK
    const startBreak = () => {
        playBell();
        setMode("break");
        setTime(breakMinutes * 60);
        setIsRunning(true);
    };

    // RESET
    const resetTimer = () => {
        setIsRunning(false);
        setTime(0);
        setMode("study");
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">

            <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wider font-bold mb-8 whitespace-nowrap"
                style={{ fontFamily: "Orbitron" }}
            >
                Pomodoro Timer
            </h1>

            {/* INPUTS */}
            <div className="flex gap-6 mb-8">
                <div className="text-center">
                    <p className="text-white mb-1">Study Minutes</p>
                    <input
                        type="number"
                        value={studyMinutes}
                        onChange={(e) => setStudyMinutes(e.target.value)}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg w-24 text-center"
                    />
                </div>

                <div className="text-center">
                    <p className="text-white mb-1">Break Minutes</p>
                    <input
                        type="number"
                        value={breakMinutes}
                        onChange={(e) => setBreakMinutes(e.target.value)}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg w-24 text-center"
                    />
                </div>
            </div>

            {/* TIMER */}
            <div
                className="text-7xl md:text-9xl mb-10 tracking-wider text-green-400"
                style={{
                    fontFamily: "Orbitron",
                    textShadow: "0 0 8px #22c55e, 0 0 18px #22c55e",
                }}
            >
                {formatTime()}
            </div>

            {/* BUTTONS */}
            <div className="flex gap-5 mt-6">

                {/* PLAY / PAUSE */}
                <button
                    onClick={toggleTimer}
                    className="bg-blue-600 p-4 rounded-full hover:bg-blue-700"
                >
                    {isRunning ? <FaPause size={18} /> : <FaPlay size={18} />}
                </button>

                {/* BREAK */}
                <button
                    onClick={startBreak}
                    className="bg-green-600 p-4 rounded-full hover:bg-green-700"
                >
                    <FaCoffee size={18} />
                </button>

                {/* RESET */}
                <button
                    onClick={resetTimer}
                    className="bg-red-600 p-4 rounded-full hover:bg-red-700"
                >
                    <FaRedo size={18} />
                </button>
            </div>
        </div>
    );
};

export default Timer;
