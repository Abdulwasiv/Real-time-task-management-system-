import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { buttonStyle, inputStyle, labelStyle } from "../../utils/formStyles";
import { loginUser, registerUser } from "../../api";
import { RegisterDetails } from "../../utils/interfaces";
import ThemeButton from "../ThemeButton";


const Register = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		watch,
	} = useForm<RegisterDetails>();

	const [responseMessage, setMessage] = useState({ error: false, message: "" });
	const [loading, setLoading] = useState<boolean>(false);

	const navigate = useNavigate();
	const onSubmit = async (data: RegisterDetails) => {
		setLoading(true);
		try {
			const response = await registerUser(data);
			if (response.data) {
				setMessage({ error: false, message: "Registration successful!" });
				const loginData = { email: data.email, password: data.password };
				await loginUser(loginData);
				setTimeout(() => {
					navigate("/"); 
				}, 1000);
			}
			else {
				setMessage({ error: true, message: "Registration failed. User already exists." });
				reset();
			}
			reset(); 
		} catch (error: unknown) {
			setMessage({
				error: true,
				message: (error as Error)?.message || "Registration failed. Please try again.",
			});
		} finally {
			setLoading(false);
		}
	};
	useEffect(()=>{
        const token = localStorage.getItem('token');
        if (token) {
            navigate("/");
        }
	},[])

	return (
		<div className="h-screen w-screen grid place-items-center gap-0 text-slate-900 dark:text-slate-100 select-none">
			<ThemeButton/>
			<form
				className="row-span-2 bg-slate-900/10 dark:bg-slate-300/10 px-20 py-12 flex flex-col items-center justify-center"
				onSubmit={handleSubmit(onSubmit)}>
				<label className="text-3xl font-bold mb-7 hover:text-blue-400 transition-colors duration-300">Register</label>
				<div className="relative z-0 w-full mb-10 group">
					<input
						type="text"
						{...register("name", {
							required: "Name is required",
							pattern: {
								value: /^[^\d].*$/,
								message: "Name cannot start with a number",
							},
						})}
						className={inputStyle(errors.name)}
						placeholder=" "
					/>
					<label htmlFor="name" className={labelStyle}>
						Name
					</label>
					{errors.name && (
						<span className="text-red-500 text-xs">{errors.name.message}</span>
					)}
				</div>

				{/* Email Input */}
				<div className="relative z-0 w-full mb-10 group">
					<input
						type="email"
						{...register("email", {
							required: "Email is required",
							pattern: {
								value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
								message: "Invalid email format",
							},
						})}
						className={inputStyle(errors.email)}
						placeholder=" "
					/>
					<label htmlFor="email" className={labelStyle}>
						Email address
					</label>
					{errors.email && (
						<span className="text-red-500 text-xs">{errors.email.message}</span>
					)}
				</div>

				{/* Password Input */}
				<div className="relative z-0 w-full mb-10 group">
					<input
						type="password"
						{...register("password", {
							required: "Password is required",
							minLength: {
								value: 6,
								message: "Password must be at least 6 characters",
							},
						})}
						className={inputStyle(errors.password)}
						placeholder=" "
					/>
					<label htmlFor="password" className={labelStyle}>
						Password
					</label>
					{errors.password && (
						<span className="text-red-500 text-xs">{errors.password.message}</span>
					)}
				</div>

				<div className="relative z-0 w-full mb-10 group">
					<input
						type="password"
						{...register("confirmPassword", {
							required: "Confirm Password is required",
							validate: (value) =>
								value === watch("password") || "Passwords do not match",
						})}
						className={inputStyle(errors.confirmPassword)}
						placeholder=" "
					/>
					<label htmlFor="confirmPassword" className={labelStyle}>
						Confirm Password
					</label>
					{errors.confirmPassword && (
						<span className="text-red-500 text-xs">
							{errors.confirmPassword.message}
						</span>
					)}
				</div>

				{responseMessage.message && (
					<p className={`${responseMessage.error ? "text-red-500" : "text-green-500"}`}>
						{responseMessage.message}
					</p>
				)}

				<button
					type="submit"
					className={buttonStyle}
					disabled={loading}>
					<span className="relative z-10">
						{loading ? "Registering..." : "Register"}
					</span>
				</button>

				<span className="text-center font-light">
					Already have an account?{" "}
					<Link to={"/signin"} className="font-bold">
						Login
					</Link>
				</span>
			</form>
		</div>
	);
};

export default Register;
