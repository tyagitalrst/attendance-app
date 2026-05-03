importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "%%VITE_FIREBASE_API_KEY%%",
  authDomain: "%%VITE_FIREBASE_AUTH_DOMAIN%%",
  projectId: "%%VITE_FIREBASE_PROJECT_ID%%",
  storageBucket: "%%VITE_FIREBASE_STORAGE_BUCKET%%",
  messagingSenderId: "%%VITE_FIREBASE_MESSAGING_SENDER_ID%%",
  appId: "%%VITE_FIREBASE_APP_ID%%",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Background message:", payload);

  const notificationTitle = payload.notification?.title ?? "Notification";
  const notificationOptions = {
    body: payload.notification?.body,
    icon: "/notification-icon.png",
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
