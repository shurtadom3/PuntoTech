import { Routes, Route } from "react-router-dom";
import Index from "./components/index";
import Products from "./pages/products";
import Combos from "./pages/combo";
import Guarantee from "./pages/garanties";
import Auth from "./components/Auth";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/cartContext";



export default function App() {
  return (
   <AuthProvider>
    <CartProvider>
      <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/products" element={<Products />} />
      <Route path="/combo" element={<Combos/>} />
      <Route path="/garanties" element={<Guarantee/>} />
      <Route path="/auth" element={<Auth/>} />
      </Routes>
    </CartProvider>
    </AuthProvider>

  )
}