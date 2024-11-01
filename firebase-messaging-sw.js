// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyAhn_98Cfaai7Et5H3qJwtZnJZPhOAnsLw",
    authDomain: "bible-app-7c4d2.firebaseapp.com",
    projectId: "bible-app-7c4d2",
    storageBucket: "bible-app-7c4d2.appspot.com",
    messagingSenderId: "127229574852",
    appId: "1:127229574852:web:bf2732e3f2ee4c27ced391",
    measurementId: "G-C8WF86ZSYY"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('تم تلقي إشعار في الخلفية:', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: 'logo.png'  // يمكنك تخصيص الأيقونة
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// service-worker.js
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
