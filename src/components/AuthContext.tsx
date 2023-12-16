import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

interface AuthContextType {
	user: User | null; // Represents the currently authenticated Firebase user or null if no user is logged in.
	isAuthenticated: boolean; // A boolean value indicating whether a user is authenticated.
}

interface AuthProviderProps {
	children: ReactNode; // Children elements wrapped by the AuthProvider component.
}

const AuthContext = createContext<AuthContextType>({
	// Creates a React context for authentication with default values for user (null) and isAuthenticated (false).
	user: null,
	isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);
// Custom hook that provides easy access to the AuthContext values throughout the application.

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null); // State to hold the current authenticated user object or null if no user is authenticated.

	useEffect(() => {
		const auth = getAuth(); // Initialize Firebase authentication.

		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user); // Listener that updates the user state whenever the authentication state changes.

			console.log("Auth State Changed: ", !!user);
		});

		return () => unsubscribe(); // Cleanup function to unsubscribe from the auth listener when the component unmounts.
	}, []);

	return (
		<AuthContext.Provider value={{ user, isAuthenticated: !!user }}>
			{children}
		</AuthContext.Provider>
	);
};
