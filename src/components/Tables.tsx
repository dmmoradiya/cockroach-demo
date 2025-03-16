"use client";

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";

const Tables = () => {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [schema, setSchema] = useState<any[]>([]);
  const [loadingTables, setLoadingTables] = useState(false);
  const [loadingSchema, setLoadingSchema] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchTables = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      setLoadingTables(true);
      setError("");
      try {
        const response = await fetch("/api/tables", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setLoadingTables(false);
        if (response.ok) {
          const data = await response.json();
          setTables(
            data.map((table: { table_name: string }) => table.table_name)
          );
        } else {
          const data = await response.json();
          setError(data.message || "Failed to retrieve tables");
        }
      } catch (error) {
        setLoadingTables(false);
        console.error("Error fetching tables:", error);
        setError("No tables exist!");
      }
    };

    fetchTables();
  }, [router]);

  const handleTableClick = async (table: string) => {
    setSelectedTable(table);
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    setLoadingSchema(true);
    setError("");
    try {
      const response = await fetch(`/api/schema/${table}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLoadingSchema(false);
      if (response.ok) {
        const data = await response.json();
        setSchema(data);
      } else {
        const data = await response.json();
        setError(data.message || "Failed to retrieve schema");
      }
    } catch (error) {
      setLoadingSchema(false);
      console.error("Error fetching schema:", error);
      setError("No schema exist!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="mb-6 text-2xl font-bold">Tables</h1>
      {loadingTables ? (
        <CircularProgress />
      ) : (
        <>
          {error ? (
            <div className="mb-4 text-red-500">{error}</div>
          ) : (
            <ul className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
              {tables.map((table) => (
                <li
                  key={table}
                  onClick={() => handleTableClick(table)}
                  className="cursor-pointer p-2 border-b border-gray-300 hover:bg-gray-200"
                >
                  {table}
                </li>
              ))}
            </ul>
          )}
          {selectedTable && (
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md w-full max-w-md">
              <h2 className="mb-4 text-xl font-bold">
                Schema for {selectedTable}
              </h2>
              {loadingSchema ? (
                <div className="flex justify-center items-center h-24">
                  <CircularProgress />
                </div>
              ) : (
                <ul>
                  {schema.map((column, index) => (
                    <li key={index} className="p-2 border-b border-gray-300">
                      {column.column_name} - {column.data_type}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Tables;
