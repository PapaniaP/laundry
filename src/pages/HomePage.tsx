import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonButtons,
	IonMenuButton,
	IonTitle,
	IonContent,
} from "@ionic/react";
import { useParams } from "react-router";
import ExploreContainer from "../components/ExploreContainer";
import "./HomePage.css";

import DatePicker from "../components/DatePicker";

function HomePage() {
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Hello</IonTitle>
				</IonToolbar>
			</IonHeader>

			<IonContent fullscreen>
				<DatePicker />
			</IonContent>
		</IonPage>
	);
}
export default HomePage;
