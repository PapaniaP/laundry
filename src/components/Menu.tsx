import {
	IonContent,
	IonIcon,
	IonItem,
	IonLabel,
	IonList,
	IonListHeader,
	IonMenu,
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

interface AppPage {
	url: string;
	iosIcon: string;
	mdIcon: string;
	title: string;
}

const appPages: AppPage[] = [
	{
		title: "Home",
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

	return (
		<IonMenu contentId="main">
			<IonContent>
				<IonList id="nav-list">
					<IonListHeader className="ion-padding-bottom">Hi, 'name' </IonListHeader>
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
