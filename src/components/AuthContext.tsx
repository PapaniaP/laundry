import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
}

interface AuthProviderProps {
	children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
			console.log("Auth State Changed: ", !!user);
		});

		return () => unsubscribe();
	}, []);

	return (
		<AuthContext.Provider value={{ user, isAuthenticated: !!user }}>
			{children}
		</AuthContext.Provider>
	);
};
