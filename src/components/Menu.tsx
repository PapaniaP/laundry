import React from "react";
import {
	IonContent,
	IonIcon,
	IonItem,
	IonLabel,
	IonList,
	IonListHeader,
	IonMenu,
	IonMenuToggle,
} from "@ionic/react";

import { useLocation } from "react-router-dom";
import {
	calendarNumberOutline,
	calendarNumberSharp,
	homeOutline,
	homeSharp,
	personOutline,
	personSharp,
} from "ionicons/icons";
import "./Menu.css";
import { getAuth } from "firebase/auth";
import { useAuth } from "./AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase-config";

interface AppPage {
	url: string;
	iosIcon: string;
	mdIcon: string;
	title: string;
}

const appPages: AppPage[] = [
	{
		title: "Laundry booking",
		url: "/home",
		iosIcon: homeOutline,
		mdIcon: homeSharp,
	},
	{
		title: "Your Bookings",
		url: "/bookings",
		iosIcon: calendarNumberOutline,
		mdIcon: calendarNumberSharp,
	},
	{
		title: "Profile",
		url: "/profile",
		iosIcon: personOutline,
		mdIcon: personSharp,
	},
];

const Menu: React.FC = () => {
	const location = useLocation();
	const auth = getAuth();
	const { user, isAuthenticated } = useAuth();
	const [firstName, setFirstName] = useState("");

	if (!isAuthenticated) {
		// If not authenticated, render nothing or null
		return null;
	}

	useEffect(() => {
		if (user) {
			const userDocRef = doc(db, "users", user.uid);
			getDoc(userDocRef).then((docSnap) => {
				if (docSnap.exists()) {
					const userData = docSnap.data() as { name: string };

					const extractedFirstName = userData.name.split(" ")[0];
					setFirstName(extractedFirstName);
					console.log("Fetched name:", extractedFirstName); // Debugging
				}
			});
		}
	}, [user]);
	// const handleLogout = async () => {
	// 	try {
	// 		await signOut(auth);
	// 		console.log("User signed out");

	// 		// Display a toast message
	// 		const toast = await toastController.create({
	// 			message: "You have successfully logged out.",
	// 			duration: 2000, // Duration in milliseconds
	// 			position: "bottom", // Position of the toast
	// 			color: "success", // Color of the toast
	// 		});
	// 		toast.present();
	// 	} catch (error) {
	// 		console.error("Logout failed:", error);

	// 		// Display an error toast
	// 		const errorToast = await toastController.create({
	// 			message: "Logout failed. Please try again.",
	// 			duration: 2000,
	// 			position: "bottom",
	// 			color: "danger",
	// 		});
	// 		errorToast.present();
	// 	}
	// };

	return (
		<IonMenu contentId="main">
			<IonContent>
				<IonList id="nav-list">
					<IonListHeader className="ion-padding-bottom">
						Hi {firstName} &nbsp; 👋
					</IonListHeader>
					{appPages.map((appPage, index) => {
						return (
							<IonMenuToggle
								key={index}
								autoHide={false}
							>
								<IonItem
									className={location.pathname === appPage.url ? "selected" : ""}
									routerLink={appPage.url}
									routerDirection="none"
									lines="none"
									detail={false}
								>
									<IonIcon
										aria-hidden="true"
										slot="start"
										ios={appPage.iosIcon}
										md={appPage.mdIcon}
									/>
									<IonLabel>{appPage.title}</IonLabel>
								</IonItem>
							</IonMenuToggle>
						);
					})}
				</IonList>
			</IonContent>
		</IonMenu>
	);
};

export default Menu;
