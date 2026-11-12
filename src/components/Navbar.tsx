import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";

interface UserData {
	firstName: string;
	lastName: string;
	email: string;
}

export default function Navbar() {
	const navigate = useNavigate();
	const location = useLocation();
	const [userName, setUserName] = useState("");
	const token = localStorage.getItem("token");

	useEffect(() => {
		if (token) {
			api.get<UserData>("/users/current")
				.then((res) => {
					setUserName(`${res.data.firstName} ${res.data.lastName}`);
				})
				.catch(() => {});
		}
	}, [token]);

	function handleLogout() {
		localStorage.removeItem("token");
		setUserName("");
		navigate("/login");
	}

	const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
	if (!token || isAuthPage) {
		return null; 
	}

	return (
		<nav className="w-full bg-slate-800 text-white p-4 shadow-md mb-6">
			<div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
				
				<div className="flex flex-col md:flex-row items-center gap-6">
					<span className="text-2xl font-bold tracking-wider text-blue-400">Fly Away </span>
					
					<div className="flex gap-2">
						<Link 
							to="/flights/search" 
							className={`px-5 py-2 rounded-md font-semibold transition-colors ${
								location.pathname === "/flights/search" 
									? "bg-blue-600 text-white" 
									: "bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white"
							}`}
						>
							Searches
						</Link>
						<Link 
							to="/flights/book" 
							className={`px-5 py-2 rounded-md font-semibold transition-colors ${
								location.pathname === "/flights/book" 
									? "bg-blue-600 text-white" 
									: "bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white"
							}`}
						>
							Booking
						</Link>
						<Link 
							to="/bookings" 
							className={`px-5 py-2 rounded-md font-semibold transition-colors ${
								location.pathname.includes("/bookings") 
									? "bg-blue-600 text-white" 
									: "bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white"
							}`}
						>
							My Reserves
						</Link>
					</div>
				</div>

				<div className="flex items-center gap-4">
					<span className="text-sm text-slate-300">
						Hola, <strong className="text-white">{userName}</strong>
					</span>
					<button 
						onClick={handleLogout} 
						className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-bold transition-colors cursor-pointer"
					>
						Logout
					</button>
				</div>
			</div>
		</nav>
	);
}