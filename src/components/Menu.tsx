import {
	IonButton,
	IonContent,
	IonFooter,
	IonIcon,
	IonItem,
	IonLabel,
	IonList,
	IonListHeader,
	IonMenu,
	IonMenuButton,
	IonMenuToggle,
	IonNote,
} from "@ionic/react";
import { toastController } from "@ionic/core";

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
import { getAuth, signOut } from "firebase/auth";
import { useAuth } from "./AuthContext";

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
];

const Menu: React.FC = () => {
	const location = useLocation();
	const auth = getAuth();
	const { isAuthenticated } = useAuth();

	if (!isAuthenticated) {
		// If not authenticated, render nothing or null
		return null;
	}

	const handleLogout = async () => {
		try {
			await signOut(auth);
			console.log("User signed out");

			// Display a toast message
			const toast = await toastController.create({
				message: "You have successfully logged out.",
				duration: 2000, // Duration in milliseconds
				position: "bottom", // Position of the toast
				color: "success", // Color of the toast
			});
			toast.present();
		} catch (error) {
			console.error("Logout failed:", error);

			// Display an error toast
			const errorToast = await toastController.create({
				message: "Logout failed. Please try again.",
				duration: 2000,
				position: "bottom",
				color: "danger",
			});
			errorToast.present();
		}
	};

	return (
		<IonMenu contentId="main">
			<IonContent>
				<IonList id="nav-list">
					<IonListHeader className="ion-padding-bottom">Hi &nbsp; 👋</IonListHeader>
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
				<IonFooter className="ion-padding">
					<IonButton
						expand="full"
						onClick={handleLogout}
						color={"danger"}
						routerLink="/"
					>
						Logout
					</IonButton>
				</IonFooter>
			</IonContent>
		</IonMenu>
	);
};

export default Menu;
