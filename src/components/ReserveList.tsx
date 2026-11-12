import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

interface Booking {
	id: number;
	flightNumber: string;
	airlineName: string;
	estDepartureTime: string;
}

export default function ReserveList() {
	const [bookings, setBookings] = useState<Booking[]>([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		async function fetchBookings() {
			try {
				const me = (await api.get("/users/current")).data;
				const key = `bookings:${me.email}`;
				const savedIds: number[] = JSON.parse(localStorage.getItem(key) ?? "[]");
				
				if (savedIds.length === 0) {
					setLoading(false); return;
				}

				const results = await Promise.allSettled(
					savedIds.map((id) => api.get(`/flights/book/${id}`))
				);

				const validBookings = results
					.filter((r) => r.status === "fulfilled")
					.map((r: any) => r.value.data);
				
				setBookings(validBookings);
			} catch (err) {
				console.error("Error al cargar reservas", err);
			} finally {
				setLoading(false);
			}
		}

		fetchBookings();
	}, []);

	if (loading) return <p className="text-center mt-10">Cargando reservas...</p>;

	return (
		<div className="w-full max-w-4xl mx-auto p-4 flex flex-col items-center">
			<h1 className="text-2xl font-bold mb-4">My Reserves</h1>
			
			{bookings.length === 0 ? (
				<p>You don't have saved reserves.</p>
			) : (
				<div className="w-full overflow-x-auto">
					<table className="w-full text-left border-collapse bg-white rounded-lg overflow-hidden shadow-md">
						<thead className="bg-slate-200">
							<tr>
								<th className="p-3">ID Reserva</th>
								<th className="p-3">Vuelo</th>
								<th className="p-3">Aerolínea</th>
								<th className="p-3">Salida</th>
								<th className="p-3">Acción</th>
							</tr>
						</thead>
						<tbody>
							{bookings.map((b) => (
								<tr key={b.id} className="border-b">
									<td className="p-3">{b.id}</td>
									<td className="p-3">{b.flightNumber}</td>
									<td className="p-3">{b.airlineName}</td>
									<td className="p-3">{new Date(b.estDepartureTime).toLocaleString()}</td>
									<td className="p-3">
										<button 
											onClick={() => navigate(`/bookings/${b.id}`)}
											className="text-blue-600 underline"
										>
											Ver detalle
										</button>
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