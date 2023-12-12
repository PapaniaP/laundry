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
	const { isAuthenticated } = useAuth();

	if (!isAuthenticated) {
		// If not authenticated, render nothing or null
		return null;
	}

	const handleLogout = async () => {
		try {
			await signOut(auth);
			console.log("User signed out");
			// Redirect to sign-in page or handle the logout view update
		} catch (error) {
			console.error("Logout failed:", error);
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
