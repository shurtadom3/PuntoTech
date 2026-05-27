import { Routes, Route } from "react-router-dom";
import Index from "./components/index";
import Products from "./pages/products";
import Combos from "./pages/combo";
import Login from "./pages/login";
import Guarantees from "./pages/guarantees";
import CartSidebar from "./components/CartSidebar";



export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/products" element={<Products />} />
        <Route path="/combo" element={<Combos/>} />
        <Route path="/garantias" element={<Guarantees />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <CartSidebar />
    </>

  )
}
