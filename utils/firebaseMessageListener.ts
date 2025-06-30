import { getMessaging, onMessage, MessagePayload } from "firebase/messaging";
import app from "services/firebase";
import { IPushNotification, NotificationData } from "interfaces";

type INotification = {
  notification?: IPushNotification;
  data?: NotificationData;
};

export const messageListener = (
  setNotification: (data?: IPushNotification) => void,
  setNotificationData?: (data?: NotificationData) => void
) => {
  if (typeof window !== 'undefined' && app) {
    const messaging = getMessaging(app);

    onMessage(messaging, (payload: MessagePayload) => {
      console.log("New foreground message received!", payload);
      const data: NotificationData | undefined = payload.data ? {
        id: Number(payload.data.id),
        status: payload.data.status,
        type: payload.data.type,
      } : undefined;

      !!setNotificationData && setNotificationData(data);
      setNotification(payload?.notification);
    });
  }
};
