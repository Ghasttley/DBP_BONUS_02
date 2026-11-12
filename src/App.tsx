import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from "./components/Login";
import FlightList from "./components/FlightList";
import ReserveList from "./components/ReserveList";
import BookingDetail from "./components/BookingDetail";
import FlightBooking from "./components/FlightBooking";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const token = localStorage.getItem("token");
	if (!token) return <Navigate to="/login" replace />;
	return <>{children}</>;
}

export default function App() {
	return (
		<BrowserRouter>
			<Navbar />
			<Routes>
				<Route 
					path="/" 
					element={
						localStorage.getItem("token") 
							? <Navigate to="/flights/search" replace />
							: <Navigate to="/login" replace />
					} 
				/>
				
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				
				<Route path="/flights/search" element={<ProtectedRoute><FlightList /></ProtectedRoute>} />
				<Route path="/flights/book" element={<ProtectedRoute><FlightBooking /></ProtectedRoute>} />
				<Route path="/bookings" element={<ProtectedRoute><ReserveList /></ProtectedRoute>} />
				<Route path="/bookings/:id" element={<ProtectedRoute><BookingDetail /></ProtectedRoute>} />

				<Route path="*" element={<h1 className="text-2xl p-4 text-center">404 - Not Found</h1>} />
			</Routes>
		</BrowserRouter>
	);
}