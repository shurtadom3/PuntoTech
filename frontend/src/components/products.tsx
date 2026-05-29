import Navbar from "../pages/navbar";
import Products from "../pages/products";
import Footer from "../pages/footer";

const ProductsComponent = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Products showNavbar={false} />
      <Footer />
    </main>
  );
};

export default ProductsComponent;
