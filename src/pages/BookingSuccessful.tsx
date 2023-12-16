import { IonButton, IonContent, IonIcon, IonPage, IonText, IonTitle } from "@ionic/react";
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
							aria-label="Booking successful"
							icon={checkmarkCircle}
						></IonIcon>
						<IonText>
							<h1 className="ion-text-center titleheight">Congratulations!</h1>
							<p className="ion-text-center">
								You have created your booking successfully.
							</p>
						</IonText>
					</div>
				</div>
			</IonContent>
			<div className="ion-padding buttons">
				<IonButton
					fill="outline"
					expand="block"
					slot="end"
					routerLink="/home"
					aria-label="Book another time"
				>
					Book another time
				</IonButton>
				<IonButton
					expand="block"
					slot="end"
					routerLink="/bookings"
					aria-label="See your booked times"
				>
					See your booked times
				</IonButton>
			</div>
		</IonPage>
	);
};

export default BookingSuccessful;
