import { IonButton, IonContent, IonIcon, IonPage, IonText } from "@ionic/react";
import "./ErrorPage.css";
import { alertCircle } from "ionicons/icons";
// Samuel - This is just simple display of ionic components adjsuted by styling
const ErrorPage: React.FC = () => {
	return (
		<IonPage>
			<IonContent className="ion-padding ion-text-center">
				<div className="wrapper">
					<div className="container">
						<IonIcon
							color="secondary"
							size="large"
							className="label-icon"
							aria-label="Error Alert"
							icon={alertCircle}
						></IonIcon>
						<IonText>
							<h1 className="ion-text-center">You ran into error...</h1>
							<p className="ion-text-center">
								Please return to home page and try again. Contact us at
								eaasahl@students.eaaa.dk for help.
							</p>
						</IonText>
					</div>
				</div>
			</IonContent>
			<div className="buttons ion-padding">
				<IonButton
					expand="block"
					slot="end"
					routerLink="/home"
					aria-label="Go back to Home Page" // Descriptive label for the button
				>
					Home
				</IonButton>
			</div>
		</IonPage>
	);
};

export default ErrorPage;
