import { Routes, Route } from "react-router-dom";
import Index from "./components/index";
import Products from "./pages/products";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/products" element={<Products />} />
    </Routes>

  )
}