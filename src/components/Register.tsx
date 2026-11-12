import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { errorMessage } from "../api";

interface RegisterData {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

const inputClass =
	"w-full border-2 border-gray-500 rounded-full px-4 py-1 mb-2 bg-white";

export default function Register() {
	const [registerData, setRegisterData] = useState<RegisterData>({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError("");
		setSuccess(false);

		const { firstName, lastName, email, password } = registerData;
			if (!firstName || !lastName || !email || !password) {
			setError("Todos los campos son obligatorios");
				return;
			}

			setLoading(true);
			try { // Envía al backend
				await api.post("/users/register", registerData);
				setSuccess(true);
				setTimeout(() => navigate("/login"), 1500); // redirige al login
			} catch (err) {
				setError(errorMessage(err));
			} finally {
				setLoading(false);
			}
	}

	return (
		<div className="size-full flex justify-center items-center">
			<article className="w-full sm:w-4/5 md:w-3/5 lg:w-2/5 bg-stone-700 sm:rounded-xl sm:my-5 px-10 py-4 flex flex-col items-center">
				<h1 className="text-2xl font-bold mb-3">Register Form</h1>

				<form onSubmit={handleSubmit} className="w-full">
					<section className="w-full sm:flex justify-between">
						<div className="w-full sm:mr-2 flex flex-col">
							<label htmlFor="firstname" className="font-bold">
								Firstname:
							</label>
							<input
								type="text"
								id="firstname"
								name="firstname"
								required
								className={inputClass}
								onChange={(e) =>
									setRegisterData({ ...registerData, firstName: e.target.value })
								}
							/>
						</div>
						<div className="w-full flex flex-col">
							<label htmlFor="lastname" className="font-bold">
								Lastname:
							</label>
							<input
								type="text"
								id="lastname"
								name="lastname"
								required
								className={inputClass}
								onChange={(e) =>
									setRegisterData({ ...registerData, lastName: e.target.value })
								}
							/>
						</div>
					</section>

					<section className="w-full flex flex-col">
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
								setRegisterData({ ...registerData, email: e.target.value })
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
								setRegisterData({ ...registerData, password: e.target.value })
							}
						/>
					</section>

					<section className="w-full flex justify-center">
						<button
							type="submit"
							className="bg-gray-500 px-10 mt-1 py-1 rounded-full text-white font-bold cursor-pointer"
						>
							Submit
						</button>
					</section>

					<section>
						Already have an account?{" "}
						<Link
							to="/login"
							className="font-medium text-foreground underline"
						>
						Login
						</Link>
					</section>
				</form>

				{error && (
					<p className="mt-4 font-bold text-red-700" role="alert">
						{error}
					</p>
					)}


				{success && (
					<p className="mt-4 font-bold text-green-700" role="status">
						Formulario registrado, {registerData.firstName || "estudiante"}.
					</p>
				)}
			</article>
		</div>
	);
}
