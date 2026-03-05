import { useEffect, useState } from "react";
 
export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/")
      .then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(setData)
      .catch((e) => setError(e.message)); 
  }, []);
 
  return (
 <div className="min-h-screen flex items-center justify-center bg-gray-100">
  <h1 className="text-4xl font-bold text-blue-600">PuntoTech</h1>
 
  </div>
  );
}