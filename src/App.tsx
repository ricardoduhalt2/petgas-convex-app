import { useState } from "react";
import { SignInForm } from "./SignInForm";
import { NewLeadForm } from "./components/NewLeadForm";
import { LeadsDashboard } from "./components/LeadsDashboard";
import { Navbar } from "./components/Navbar";
import WhatsAppLeadDialog from "./components/WhatsAppLeadDialog";
import WhatsAppChatWidget from "./components/WhatsAppChatWidget";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  const [view, setView] = useState<"dashboard" | "newlead" | "whatsapp">("dashboard");
  const [loggedIn, setLoggedIn] = useState(false);

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div>
          <SignInForm />
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
    <BrowserRouter>
      <WhatsAppChatWidget />
      <Routes>
        <Route path="/whatsapp-lead-dialog" element={<WhatsAppLeadDialog />} />
        <Route
          path="*"
          element={
            <div>
              <Navbar current={view} onNavigate={v => setView(v as any)} />
              <div className="p-8">
                {view === "dashboard" && <LeadsDashboard />}
                {view === "newlead" && <NewLeadForm />}
                {view === "whatsapp" && <WhatsAppLeadDialog />}
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
