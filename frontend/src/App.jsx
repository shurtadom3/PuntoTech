import { Routes, Route } from "react-router-dom";
import Index from "./components/index";
import Products from "./pages/products";
import Combos from "./pages/combo";



export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/products" element={<Products />} />
      <Route path="/combo" element={<Combos/>} />
    </Routes>

  )
}