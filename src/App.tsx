import React from "react";
import {
	IonApp,
	IonMenuButton,
	IonRouterOutlet,
	IonSplitPane,
	setupIonicReact,
	IonSpinner
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import Menu from "./components/Menu";
import { useEffect, useState } from "react";
import { AuthProvider } from "./components/AuthContext";
import useAuth from './useAuthHook';

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

/* Routing Linkes */
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import ErrorPage from "./pages/ErrorPage";
import BookingSuccessful from "./pages/BookingSuccessful";
import YourBookingsPage from "./pages/YourBookingsPage";
import ProfilePage from "./pages/ProfilePage";
import PasswordChangePage from "./components/PasswordChange";

setupIonicReact();

const App: React.FC = () => {
	return (
		<IonApp>
			<AuthProvider>
				<IonReactRouter>
					<AppContent />
				</IonReactRouter>
			</AuthProvider>
		</IonApp>
	);
};

const AppContent: React.FC = () => {
	const { isAuthenticated, isLoading } = useAuth();

	console.log("Is Authenticated: ", isAuthenticated); // Log the authentication state

	// If the authentication state is still being determined, show a loading indicator
	if (isLoading) {
		return (
			<IonApp>
				<IonSpinner />
			</IonApp>
		);
	}

	if (!isAuthenticated) {
		return <SignInPage />;
	}

	return (
		<IonSplitPane contentId="main">
			<Menu />
			<IonRouterOutlet id="main">
				<Route
					path="/home"
					exact={true}
				>
					<HomePage />
				</Route>
				<Route
					path=""
					exact={true}
				>
					<HomePage />
				</Route>
				<Route
					path="/error"
					exact={true}
				>
					<ErrorPage />
				</Route>
				<Route
					path="/booked"
					exact={true}
				>
					<BookingSuccessful />
				</Route>
				<Route
					path="/bookings"
					exact={true}
				>
					<YourBookingsPage />
				</Route>
				<Route
					path="/profile"
					exact={true}
				>
					<ProfilePage />
				</Route>
				<Route
					path="/change-password"
					exact={true}
				>
					<PasswordChangePage />
				</Route>
			</IonRouterOutlet>
		</IonSplitPane>
	);
};

export default App;
