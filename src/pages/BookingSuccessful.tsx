import { IonButton, IonContent, IonIcon, IonPage, IonTitle } from "@ionic/react";
import "./ErrorPage.css";
import { checkmarkCircle } from "ionicons/icons";

const BookingSuccessful: React.FC = () => {
	return (
		<IonPage>
			<IonContent className="ion-padding ion-text-center">
				<div className="wrapper">
					<div className="container">
						<IonIcon
							color="secondary"
							size="large"
							className="label-icon"
							aria-hidden="true"
							icon={checkmarkCircle}
						></IonIcon>
						<IonTitle className="ion-text-center titleheight">Congratulations!</IonTitle>
						<p className="ion-text-center">You have created your booking successfully.</p>
					</div>
				</div>
			</IonContent>
			<div className="ion-padding buttons">
				<IonButton
					fill="outline"
					expand="block"
					slot="end"
					routerLink="/home"
				>
					Book another time
				</IonButton>
				<IonButton
					expand="block"
					slot="end"
					routerLink="/bookings"
				>
					See your booked times
				</IonButton>
			</div>
		</IonPage>
	);
};

export default BookingSuccessful;
