import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { CheckCircle2, X } from "lucide-react";
import Index from "./components/index";
import Products from "./pages/products";
import Combos from "./pages/combo";
import Login from "./pages/login";
import Guarantees from "./pages/guarantees";
import CartSidebar from "./components/CartSidebar";

export default function App() {
  const [purchaseMessage, setPurchaseMessage] = useState("");
  const [authMessage, setAuthMessage] = useState("");

  useEffect(() => {
    if (!purchaseMessage) return;
    const timeoutId = window.setTimeout(() => setPurchaseMessage(""), 9000);
    return () => window.clearTimeout(timeoutId);
  }, [purchaseMessage]);

  useEffect(() => {
    const handleAuthMessage = (event) => {
      setAuthMessage(event.detail || "");
    };

    window.addEventListener("puntotech_auth_message", handleAuthMessage);
    return () => window.removeEventListener("puntotech_auth_message", handleAuthMessage);
  }, []);

  useEffect(() => {
    if (!authMessage) return;
    const timeoutId = window.setTimeout(() => setAuthMessage(""), 5000);
    return () => window.clearTimeout(timeoutId);
  }, [authMessage]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/products" element={<Products />} />
        <Route path="/combo" element={<Combos/>} />
        <Route path="/garantias" element={<Guarantees />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <CartSidebar onCheckoutSuccess={setPurchaseMessage} />
      {authMessage && (
        <div className="fixed left-1/2 top-5 z-[10000] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-lg border border-primary/20 bg-white p-4 text-foreground shadow-2xl">
          <div className="flex items-start gap-3">
            <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-primary" />
            <p className="text-sm font-medium">{authMessage}</p>
            <button
              type="button"
              aria-label="Cerrar mensaje"
              onClick={() => setAuthMessage("")}
              className="ml-auto rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-primary"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
      {purchaseMessage && (
        <div className="fixed left-1/2 top-5 z-[10000] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-lg border border-emerald-200 bg-white p-4 text-emerald-900 shadow-2xl">
          <div className="flex items-start gap-3">
            <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-emerald-600" />
            <p className="text-sm font-medium">{purchaseMessage}</p>
            <button
              type="button"
              aria-label="Cerrar mensaje"
              onClick={() => setPurchaseMessage("")}
              className="ml-auto rounded-lg p-1 text-emerald-700 hover:bg-emerald-50"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </>

  )
}
