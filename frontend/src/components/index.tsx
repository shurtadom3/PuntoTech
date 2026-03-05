import Navbar from "../pages/navbar";
import Home from "../pages/home";
import Categories from "../pages/categories";
import Products from "../pages/products";
import Footer from "../pages/footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Home />
      <Categories />
      <Products />
      <Footer />
    </main>
  );
};

export default Index;