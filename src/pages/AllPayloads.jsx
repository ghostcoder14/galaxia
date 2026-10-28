import { useEffect, useState } from "react";
import PayloadCard from "../components/Payloads/PayloadCard";

 const AllPayloads = () => {
  const [payloads, setPayloads] = useState([]);

  useEffect(() => {
    fetch("https://api.spacexdata.com/v4/payloads")
      .then((res) => res.json())
      .then((data) => setPayloads(data))
      .catch((err) => console.error("Error fetching payloads:", err));
  }, []);

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white py-10">
      <h1 className="text-3xl font-bold">🚀 All SpaceX Payloads</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {payloads.map((payload) => (
          <PayloadCard key={payload.id} payload={payload} showNationalities={true} />
        ))}
      </div>
    </div>
  );
};



export default AllPayloads;
