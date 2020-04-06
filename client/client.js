const dotenv = require("dotenv");
dotenv.config();

const publicVapidKey = process.env.publicVapidKey;

if ("serviceWorker" in navigator) {
  send().catch((err) => {
    console.error(err);
  });
}

//Register SW, Register Push, Send Push
async function send() {
  console.log("Registering servce worker...");
  const register = await navigator.serviceWorker.register("/worker.js", {
    //URL where this service worker will apply
    scope: "/",
  });
  console.log("Service Worker Registered");

  console.log("Registering Push");
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  });
  console.log("Push registered");

  console.log("Sending push notification");

  await fetch("/subscribe", {
    method: "POST",
    body: JSON.stringify(subscription),
    headers: {
      "content-type": "application/json",
    },
  });
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
