import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../.env") });

const required = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
];

for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing env var: ${key}`);
    process.exit(1);
  }
}

const template = readFileSync(
  resolve(__dirname, "../public/firebase-messaging-sw.template.js"),
  "utf-8",
);

const output = required.reduce(
  (str, key) => str.replaceAll(`%%${key}%%`, process.env[key]),
  template,
);

writeFileSync(
  resolve(__dirname, "../public/firebase-messaging-sw.js"),
  output,
);

console.log("firebase-messaging-sw.js generated.");
