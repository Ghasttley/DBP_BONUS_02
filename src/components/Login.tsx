import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { errorMessage } from "../api";

interface LoginData {
	email: string;
	password: string;
}

const inputClass =
	"w-full border-2 border-gray-500 rounded-full px-4 py-1 mb-2 bg-white";

export default function Login() {
	const [loginData, setLoginData] = useState<LoginData>({
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);
	
	const [userName, setUserName] = useState(""); 
	
	const navigate = useNavigate();

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError("");
		setSuccess(false);

		const { email, password } = loginData;
		if (!email || !password) {
			setError("All parameters must be filled...");
			return;
		}

		setLoading(true);
		try {
			const { data } = await api.post("/auth/login", loginData);
			localStorage.setItem("token", data.token);

			const me = (await api.get("/users/current")).data;
			setUserName(me.firstName);

			setSuccess(true);
			
			setTimeout(() => navigate("/flights/search"), 1500); 
		} catch (err) {
			setError(errorMessage(err));
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="size-full flex justify-center items-center">
			<article className="w-full sm:w-4/5 md:w-3/5 lg:w-2/5 bg-stone-700 sm:rounded-xl sm:my-5 px-10 py-4 flex flex-col items-center">
				<h1 className="text-2xl font-bold mb-3">Login Form</h1>

				<form onSubmit={handleSubmit} className="w-full">
					<section className="w-full flex flex-col mt-2">
						<label htmlFor="email" className="font-bold">
							Email:
						</label>
						<input
							type="email"
							id="email"
							name="email"
							required
							className={inputClass}
							onChange={(e) =>
								setLoginData({ ...loginData, email: e.target.value })
							}
						/>
					</section>

					<section className="w-full flex flex-col">
						<label htmlFor="password" className="font-bold">
							Password:
						</label>
						<input
							type="password"
							id="password"
							name="password"
							required
							className={inputClass}
							onChange={(e) =>
								setLoginData({ ...loginData, password: e.target.value })
							}
						/>
					</section>

					<section className="w-full flex justify-center mt-2">
						<button
							type="submit"
							disabled={loading}
							className="bg-gray-500 px-10 mt-1 py-1 rounded-full text-white font-bold cursor-pointer disabled:opacity-50 hover:bg-gray-600 transition"
						>
							{loading ? "Loading..." : "Entrar"}
						</button>
					</section>

					<section className="text-center text-sm mt-3">
						Don't have an account?{" "}
						<Link
							to="/register"
							className="font-medium text-blue-300 underline"
						>
							Register
						</Link>
					</section>
				</form>

				{error && (
					<p className="mt-4 font-bold text-red-400 bg-red-900/50 px-4 py-2 rounded" role="alert">
						{error}
					</p>
				)}

				{success && (
					<p className="mt-4 font-bold text-green-400 bg-green-900/50 px-4 py-2 rounded" role="status">
						Welcome, {userName}! Redirecting...
					</p>
				)}
			</article>
		</div>
	);
}