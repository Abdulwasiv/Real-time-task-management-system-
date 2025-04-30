import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { DecodedToken, UserProfile } from "../utils/interfaces";


interface AuthContextType {
	user: DecodedToken | UserProfile; 
	setUser: (user: DecodedToken) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<DecodedToken|UserProfile>({
		name:"",
		exp: 0,
		iat: 0,
		id: 0,
		role: "user",
		email:""
	});

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			const decodedToken = jwtDecode<DecodedToken|UserProfile>(token);
			setUser(decodedToken);
		}
	}, []);

	return (
		<AuthContext.Provider value={{ user, setUser }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
