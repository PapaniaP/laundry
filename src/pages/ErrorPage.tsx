import { IonButton, IonContent, IonFooter, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from "@ionic/react";
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
                            aria-hidden="true"
                            icon={alertCircle}
                        ></IonIcon>
                        <IonTitle className="ion-text-center">You ran into error...</IonTitle>
                        <p className="ion-text-center">Please return to home page and try again. Contact us at eaasahl@students.eaaa.dk for help.</p>
                    </div></div>
            </IonContent>
            <div className="buttons ion-padding">
                <IonButton expand="block" slot="end" routerLink="/home">
                    Home
                </IonButton></div>
        </IonPage >
    );
};

export default ErrorPage;