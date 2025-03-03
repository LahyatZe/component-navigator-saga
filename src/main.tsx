
import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./index.css";

// Use the key exactly as provided by the user
const PUBLISHABLE_KEY = "pk_test_c3RlYWR5LXN0YXJsaW5nLTgzLmNsZXJrLmFjY291bnRzLmRldiQ";

// Debug the key to identify any issues
console.log("Using Clerk Key:", PUBLISHABLE_KEY);

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

// Get the current origin for the redirect URL
const redirectUrl = window.location.origin;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      redirectUrl={redirectUrl}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
