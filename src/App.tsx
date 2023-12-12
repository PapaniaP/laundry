import {
	IonApp,
	IonMenuButton,
	IonRouterOutlet,
	IonSplitPane,
	setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import Menu from "./components/Menu";
import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./components/AuthContext";

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
	const { isAuthenticated } = useAuth();

	console.log("Is Authenticated: ", isAuthenticated); // Log the authentication state

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
			</IonRouterOutlet>
		</IonSplitPane>
	);
};

export default App;
