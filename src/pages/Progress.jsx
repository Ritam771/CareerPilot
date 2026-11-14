import React, { useState, useEffect } from "react";
import { FiTrendingUp, FiTarget, FiClock, FiActivity } from "react-icons/fi";

const Progress = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- API FETCH ---
  useEffect(() => {
    const fetchProgressStats = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        
        // Ensure this endpoint returns a JSON object matching the expected structure below
        const response = await fetch("http://localhost:8080/api/user/progress", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch progress data from the server.");
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Unable to load progress data at this time.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgressStats();
  }, []);

  // --- UI RENDERING ---
  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Performance Analytics</h1>
          <p className="text-gray-400">Track your accuracy and overall progress.</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20 text-gray-400">Loading your stats...</div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/50 text-red-400 p-4 rounded-lg text-center mb-8 border border-red-700">
            {error}
          </div>
        )}

        {/* Dashboard Content (Only renders if stats are available) */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* KPI 1: Overall Accuracy */}
            <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 flex items-center gap-4">
              <div className="text-teal-400 bg-teal-900/30 p-3 rounded-full">
                <FiTarget size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Overall Accuracy</p>
                <p className="text-2xl font-bold">{stats.overallAccuracy}%</p>
              </div>
            </div>

            {/* KPI 2: Total Questions Attempted */}
            <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 flex items-center gap-4">
              <div className="text-blue-400 bg-blue-900/30 p-3 rounded-full">
                <FiActivity size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Questions Solved</p>
                <p className="text-2xl font-bold">{stats.totalAttempted}</p>
              </div>
            </div>

            {/* KPI 3: Time Spent */}
            <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 flex items-center gap-4">
              <div className="text-indigo-400 bg-indigo-900/30 p-3 rounded-full">
                <FiClock size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Time Practicing</p>
                <p className="text-2xl font-bold">{stats.timeSpentHours} hrs</p>
              </div>
            </div>

            {/* KPI 4: Current Streak */}
            <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 flex items-center gap-4">
              <div className="text-orange-400 bg-orange-900/30 p-3 rounded-full">
                <FiTrendingUp size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Current Streak</p>
                <p className="text-2xl font-bold">{stats.currentStreak} days</p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;