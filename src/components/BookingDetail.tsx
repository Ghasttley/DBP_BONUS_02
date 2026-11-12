import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../fly-away-frontend/src/api";

interface UserData {
	firstName: string;
	lastName: string;
	email: string;
}

export default function BookingDetail() {
	const { id } = useParams();
	const [booking, setBooking] = useState<any>(null);
	const navigate = useNavigate();

	useEffect(() => {
		api.get(`/flights/book/${id}`)
			.then((res) => setBooking(res.data))
			.catch(() => navigate("/bookings"));
	}, [id, navigate]);

	if (!booking) return <p className="text-center mt-10">Cargando...</p>;

	return (
		<div className="max-w-md mx-auto mt-10 bg-slate-200 p-6 rounded-xl">
			<h2 className="text-xl font-bold mb-4">Reserve's details #{booking.id}</h2>
			<p><strong>Vuelo:</strong> {booking.flightNumber}</p>
			<p><strong>Aerolínea:</strong> {booking.airlineName}</p>
			<p><strong>Salida:</strong> {new Date(booking.estDepartureTime).toLocaleString()}</p>
			<p><strong>Llegada:</strong> {new Date(booking.estArrivalTime).toLocaleString()}</p>
			<p><strong>Pasajero:</strong> {booking.customerFirstName} {booking.customerLastName}</p>
			<button onClick={() => navigate(-1)} className="mt-4 bg-gray-500 text-white px-4 py-2 rounded">
				Back
			</button>
		</div>
	);
}