import Navbar from "../pages/navbar";
import Home from "../pages/home";
import Categories from "../pages/categories";
import Footer from "../pages/footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Home />
      <Categories />
      <Footer />
    </main>
  );
};

export default Index;
