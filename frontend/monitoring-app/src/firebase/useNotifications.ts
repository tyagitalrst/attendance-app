import { useEffect } from "react";
import { getMessagingIfSupported, VAPID_KEY } from "./config";
import { getToken, onMessage } from "firebase/messaging";
import toast from "react-hot-toast";
import { monitorClient } from "../api/client";

export function useNotifications() {
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function setup() {
      const messaging = await getMessagingIfSupported();
      if (!messaging) {
        console.warn("Firebase messaging not supported in this browser");
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.warn("Notification permission not granted");
        return;
      }

      try {
        const serviceWorkerRegistration =
          await navigator.serviceWorker.register("/firebase-messaging-sw.js");

        const token = await getToken(messaging, {
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration: serviceWorkerRegistration,
        });

        if (token) {
          await subscribeToAdminTopic(token);
        }
      } catch (err) {
        console.log("Error setting up FCM: ", err);
      }

      unsubscribe = onMessage(messaging, (payload) => {
        toast.success(
          `${payload.notification?.title}\n${payload.notification?.body}`,
          {
            duration: 5000,
            position: "top-right",
          },
        );
      });
    }

    setup();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);
}

async function subscribeToAdminTopic(token: string) {
  try {
    await monitorClient.post("notifications/subscribe", { token });
    console.log(`Subscribed to admin-notifications topic`);
  } catch (err) {
    console.error("Failed to subscribe to topic", err);
  }
}
