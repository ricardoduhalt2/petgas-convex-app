import { useState } from "react";
import { SignInForm } from "./SignInForm";
import { NewLeadForm } from "./components/NewLeadForm";
import { LeadsDashboard } from "./components/LeadsDashboard";
import { Navbar } from "./components/Navbar";

export default function App() {
  const [view, setView] = useState<"dashboard" | "newlead">("dashboard");
  const [loggedIn, setLoggedIn] = useState(false);

  // Simple login state: show login form if not logged in
  // You can improve this by lifting userId state up from SignInForm
  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div>
          <SignInForm />
          {/* 
            To make the dashboard protected, 
            you can lift userId state up and setLoggedIn(true) on login.
          */}
          <button
            className="mt-4 text-blue-600 underline"
            onClick={() => setLoggedIn(true)}
          >
            Continuar como admin demo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar current={view} onNavigate={v => setView(v as any)} />
      <div className="p-8">
        {view === "dashboard" && <LeadsDashboard />}
        {view === "newlead" && <NewLeadForm />}
      </div>
    </div>
  );
}
