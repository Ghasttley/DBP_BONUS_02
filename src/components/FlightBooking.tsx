import { useState } from "react";
import type { FormEvent } from "react";
import api, { errorMessage } from "../api";
import { useNavigate } from "react-router-dom";

interface Flight {
	id: number;
	flightNumber: string;
	airlineName: string;
	estDepartureTime: string;
	estArrivalTime: string;
	availableSeats: number;
}

const inputClass = "border-2 border-gray-500 rounded-full px-4 py-1 bg-white";

export default function FlightBooking() {
    const [id, setId] = useState("");
	const [flightNumber, setFlightNumber] = useState("");
	const [airlineName, setAirlineName] = useState("");
    const [bookingDate, setBookingDate] = useState("");
	const [estDepartureTime, setEstDepartureTime] = useState(""); 
    const [estArrivalTime, setEstArrivalTime] = useState(""); 
	const [flights, setFlights] = useState<Flight[]>([]);
    // const [sits, setSits] = useState<Sits[]>([]);
	
	const [error, setError] = useState("");
	const [successMsg, setSuccessMsg] = useState("");
	const [booking, setBooking] = useState(false);
	const [booked, setBooked] = useState(false);
	
	const navigate = useNavigate();
	const token = localStorage.getItem("token");

	async function handleBooking(e: FormEvent) {
		e.preventDefault();
		setError("");
		setSuccessMsg("");
		setBooking(true);
		setBooked(true);

		try {
			const { data } = await api.get("/flights/book", {
				params: {
                    id: id || undefined, 
                    bookingDate: bookingDate ? new Date(bookingDate).toISOString() : undefined,
                    airlineName: airlineName || undefined,
					flightNumber: flightNumber || undefined,
					estDepartureTime: estDepartureTime ? new Date(estDepartureTime).toISOString() : undefined,
                    estArrivalTime: estArrivalTime ? new Date(estArrivalTime).toISOString() : undefined,
				},
			});
			setFlights(data.items);
		} catch (err) {
			setError(errorMessage(err));
		} finally {
			setBooking(false);
		}
	}

	async function handleBook(flightId: number) {
		setError("");
		setSuccessMsg("");

		if (!token) {
			setError("You must log in to make a reservation.");
			return;
		}

		try {
			const { data } = await api.post("/flights/book", { flightId });

			const me = (await api.get("/users/current")).data;
			const key = `bookings:${me.email}`;
			const ids = JSON.parse(localStorage.getItem(key) ?? "[]");
			localStorage.setItem(key, JSON.stringify([...ids, data.id]));

			setSuccessMsg(`Vuelo reservado. ID de reserva: ${data.id}`);
		} catch (err) {
			setError(errorMessage(err)); 
		}
	}

	function formatDate(isoString: string) {
		return new Date(isoString).toLocaleString();
	}

	return (
		<div className="w-full max-w-5xl mx-auto p-4 flex flex-col items-center">
			<h1 className="text-2xl font-bold mb-4">Flight Search</h1>
			<form onSubmit={handleBooking} className="w-full flex flex-wrap gap-2 mb-6 justify-center">
				<input
					type="text"
					placeholder="id"
					className={inputClass}
					value={id}
					onChange={(e) => setId(e.target.value)}
				/>
                <input
					type="date"
					placeholder="id"
					className={inputClass}
					value={bookingDate}
					onChange={(e) => setBookingDate(e.target.value)}
				/>
				<input
					type="text"
					placeholder="Airline"
					className={inputClass}
					value={airlineName}
					onChange={(e) => setAirlineName(e.target.value)}
				/>
                <input
					type="text"
					placeholder="Flight number"
					className={inputClass}
					value={flightNumber}
					onChange={(e) => setFlightNumber(e.target.value)}
				/>
				<input
					type="datetime-local"
					className={inputClass}
					value={estDepartureTime}
					onChange={(e) => setEstDepartureTime(e.target.value)}
					title="Departure time"
				/>
                <input
					type="datetime-local"
					className={inputClass}
					value={estArrivalTime}
					onChange={(e) => setEstArrivalTime(e.target.value)}
					title="Arrival time"
				/>
				<button type="submit" disabled={booking} className="bg-gray-500 text-white font-bold px-6 py-1 rounded-full cursor-pointer hover:bg-gray-600">
					{booking ? "Booking..." : "Book"}
				</button>
			</form>

            

			{error && <p className="text-red-700 font-bold mb-4">{error}</p>}
			{successMsg && <p className="text-green-700 font-bold mb-4">{successMsg}</p>}

			{flights.length > 0 && (
				<div className="w-full overflow-x-auto">
					<table className="w-full text-left border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
						<thead className="bg-gray-200 text-gray-700">
							<tr>
								<th className="p-3">Number</th>
								<th className="p-3">Airline</th>
								<th className="p-3">Departure</th>
								<th className="p-3">Arrival</th>
								<th className="p-3">Sits</th>
								<th className="p-3">Action</th>
							</tr>
						</thead>
						<tbody>
							{flights.map((flight) => (
								<tr key={flight.id} className="border-b hover:bg-gray-50">
									<td className="p-3">{flight.flightNumber}</td>
									<td className="p-3">{flight.airlineName}</td>
									<td className="p-3">{formatDate(flight.estDepartureTime)}</td>
									<td className="p-3">{formatDate(flight.estArrivalTime)}</td>
									<td className="p-3">{flight.availableSeats}</td>
									<td className="p-3">
										{token ? (
											<button
												onClick={() => handleBook(flight.id)}
												className="bg-blue-600 text-white px-4 py-1 rounded cursor-pointer hover:bg-blue-700"
											>
												Book
											</button>
										) : (
											<span className="text-gray-500 text-sm italic">Log in to book</span>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}