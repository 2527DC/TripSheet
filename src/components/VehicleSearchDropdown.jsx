import { useState, useEffect } from "react";
import axios from "axios";

function VehicleSearchDropdown({ onSelect }) {
  const [search, setSearch] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (search.length < 2) {
      setVehicles([]);
      return;
    }

    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`http://0.0.0.0:3000/api/vehicles?search=${search}`);
        setVehicles(data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
      setLoading(false);
    };

    const delayDebounce = setTimeout(fetchVehicles, 300); // 🔥 Debounce API calls

    return () => clearTimeout(delayDebounce);
  }, [search]);

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search Vehicle No..."
        className="border p-2 w-full"
      />
      {loading && <p>Loading...</p>}
      {vehicles.length > 0 && (
        <ul className="border mt-2 p-2">
          {vehicles.map((vehicle) => (
            <li
              key={vehicle.id}
              onClick={() => {
                onSelect(vehicle);
                setSearch(vehicle.vehicleNo); // Update input field
                setVehicles([]); // Hide suggestions
              }}
              className="cursor-pointer p-2 hover:bg-gray-200"
            >
              {vehicle.vehicleNo} - {vehicle.vehicleType}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default VehicleSearchDropdown;
