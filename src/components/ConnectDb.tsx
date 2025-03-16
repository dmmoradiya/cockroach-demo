"use client";
import React, { useState } from "react";
import { useRouter } from "next/router";
import CircularProgress from "@mui/material/CircularProgress";

const ConnectDb = () => {
  const [host, setHost] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [dbName, setDbName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ host, username, password, dbName }),
      });

      setLoading(false);
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        router.push("/tables");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to connect to the database");
      }
    } catch (error) {
      setLoading(false);
      setError("An error occurred while connecting to the database");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-100">
      <h1 className="mb-6 text-2xl font-bold">Connect to Database</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
        style={{ width: "400px" }}
      >
        <div className="mb-4">
          <label className="block mb-2">Host:</label>
          <input
            type="text"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Database Name:</label>
          <input
            type="text"
            value={dbName}
            onChange={(e) => setDbName(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-700 flex items-center justify-center"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Connect"}
        </button>
      </form>
    </div>
  );
};

export default ConnectDb;
