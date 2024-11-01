// استيراد مكتبات Firebase الضرورية
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js";

// إعداد Firebase باستخدام الإعدادات التي قدمتها
const firebaseConfig = {
    apiKey: "AIzaSyAhn_98Cfaai7Et5H3qJwtZnJZPhOAnsLw",
    authDomain: "bible-app-7c4d2.firebaseapp.com",
    projectId: "bible-app-7c4d2",
    storageBucket: "bible-app-7c4d2.appspot.com",
    messagingSenderId: "127229574852",
    appId: "1:127229574852:web:bf2732e3f2ee4c27ced391",
    measurementId: "G-C8WF86ZSYY"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

// الحصول على إذن المستخدم للإشعارات بعد تسجيل الدخول
async function requestAndSaveToken(userId) {
    try {
        const currentToken = await getToken(messaging, { vapidKey: "BLhZGEBgFbz-BwYLlEfFq7SlHsE30d5rhK0-wL7dK86h2Zl5nPPwkdAHL0bLiU_LzZW9hVEjl5XVvdfWieJ_kL0" });
        if (currentToken) {
            console.log('تم الحصول على رمز التسجيل:', currentToken);

            // حفظ الرمز في Firestore
            await setDoc(doc(db, "tokens", userId), { token: currentToken });
            console.log("تم حفظ رمز التسجيل بنجاح في قاعدة البيانات");
        } else {
            console.warn('لم يتم توفير رمز التسجيل. تأكد من قبول المستخدم لتلقي الإشعارات.');
        }
    } catch (err) {
        console.error('خطأ في جلب رمز التسجيل:', err);
    }
}

// التعامل مع الإشعارات الواردة عندما يكون الموقع مفتوحًا
onMessage(messaging, (payload) => {
    console.log('تم تلقي إشعار:', payload);
    alert(`إشعار جديد: ${payload.notification.title} - ${payload.notification.body}`);
});

// تسجيل Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('firebase-messaging-sw.js')
    .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch((error) => {
        console.error('Service Worker registration failed:', error);
    });
}

// تحميل الأسماء من Firestore إلى القائمة المنسدلة (صفحة تسجيل الدخول)
async function loadUsernames() {
    const userSelect = document.getElementById("userSelect");
    const querySnapshot = await getDocs(collection(db, "users"));

    querySnapshot.forEach((doc) => {
        const option = document.createElement("option");
        option.value = doc.data().email; // استخدام البريد الإلكتروني لتسجيل الدخول
        option.textContent = doc.data().username;
        userSelect.appendChild(option);
    });
}

// إظهار حقل كلمة المرور بعد اختيار اسم المستخدم (صفحة تسجيل الدخول)
document.getElementById("userSelect").addEventListener("change", function() {
    document.getElementById("passwordDiv").style.display = "block";
});

// وظيفة لإظهار الرسالة الاحترافية (صفحة تسجيل الدخول)
function showToastMessage(message) {
    const toastBody = document.querySelector('#toastMessage .toast-body');
    toastBody.textContent = message;
    $('.toast').toast('show');
}

// معالجة عملية تسجيل الدخول (صفحة تسجيل الدخول)
document.getElementById("loginBtn").addEventListener("click", async function() {
    const email = document.getElementById("userSelect").value;
    const password = document.getElementById("passwordInput").value;

    if (email && password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;

            // طلب إذن الإشعارات وحفظ `Token` للمستخدم
            await requestAndSaveToken(userId);

            // بعد نجاح تسجيل الدخول، الانتقال إلى صفحة الإصحاح
            window.location.href = "chapter.html";
        } catch (error) {
            showToastMessage("فشل تسجيل الدخول: تحقق من الاسم وكلمة المرور.");
        }
    } else {
        showToastMessage("يرجى اختيار الاسم وإدخال كلمة المرور.");
    }
});

// استدعاء دالة تحميل الأسماء عند تحميل صفحة تسجيل الدخول
window.onload = loadUsernames;
