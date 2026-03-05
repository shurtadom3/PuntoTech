import { useState } from "react";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart } from "lucide-react";
import Navbar from "./navbar";

import productPhone from "../assets/productPhone.jpg";
import productLaptop from "../assets/productLaptop.jpg";
import productHeadphones from "../assets/productHeadphones.jpg";
import productSpeaker from "../assets/productSpeaker.jpg";

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string; // 👈 NUEVO
  price: number;
  oldPrice: number | null;
  rating: number;
  image: string;
  tag: string | null;
  inStock: boolean;
}

const products: Product[] = [
  {
    id: 1,
    name: "Galaxy S24 Ultra",
    brand: "Samsung",
    category: "Celulares",
    price: 4299000,
    oldPrice: 4899000,
    rating: 4.8,
    image: productPhone,
    tag: "Más vendido",
    inStock: true,
  },
  {
    id: 2,
    name: "MacBook Pro M3",
    brand: "Apple",
    category: "Laptops",
    price: 8999000,
    oldPrice: null,
    rating: 4.9,
    image: productLaptop,
    tag: "Nuevo",
    inStock: true,
  },
  {
    id: 3,
    name: "WH-1000XM5",
    brand: "Sony",
    category: "Audífonos",
    price: 1499000,
    oldPrice: 1799000,
    rating: 4.7,
    image: productHeadphones,
    tag: "-17%",
    inStock: true,
  },
  {
    id: 4,
    name: "JBL Charge 5",
    brand: "JBL",
    category: "Bafles",
    price: 649000,
    oldPrice: null,
    rating: 4.6,
    image: productSpeaker,
    tag: null,
    inStock: false,
  },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);

const Products = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [onlyInStock, setOnlyInStock] = useState(false);

  // Obtener categorías dinámicamente
  const categories = [...new Set(products.map((p) => p.category))];

  // FILTRO
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);

    const matchesPrice =
      product.price >= priceRange[0] &&
      product.price <= priceRange[1];

    const matchesStock = !onlyInStock || product.inStock;

    return matchesCategory && matchesPrice && matchesStock;
  });

  const resetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 10000000]);
    setOnlyInStock(false);
  };

  return (
    <>
      <Navbar />
      
      <section className="py-20 md:py-28 bg-secondary/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* ================= FILTROS ================= */}
            <aside className="lg:col-span-1 glass p-6 rounded-2xl space-y-6 h-fit">
              <h3 className="font-heading font-semibold text-lg">
                Filtros
              </h3>

              {/* CATEGORÍA */}
              <div>
                <p className="text-sm font-medium mb-3">
                  Categoría
                </p>

                {categories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-2 mb-2 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => {
                        if (selectedCategories.includes(category)) {
                          setSelectedCategories(
                            selectedCategories.filter((c) => c !== category)
                          );
                        } else {
                          setSelectedCategories([
                            ...selectedCategories,
                            category,
                          ]);
                        }
                      }}
                    />
                    {category}
                  </label>
                ))}
              </div>

              {/* PRECIO */}
              <div>
                <p className="text-sm font-medium mb-3">
                  Precio máximo
                </p>

                <input
                  type="range"
                  min={0}
                  max={10000000}
                  step={500000}
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([0, Number(e.target.value)])
                  }
                  className="w-full"
                />

                <p className="text-xs mt-2 text-muted-foreground">
                  Hasta {formatPrice(priceRange[1])}
                </p>
              </div>

              {/* STOCK */}
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={() => setOnlyInStock(!onlyInStock)}
                />
                Solo productos en stock
              </label>

              <button
                onClick={resetFilters}
                className="text-sm text-primary hover:underline"
              >
                Limpiar filtros
              </button>
            </aside>

            {/* ================= PRODUCTOS ================= */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -6 }}
                  className="group glass rounded-2xl overflow-hidden"
                >
                  <div className="relative aspect-square bg-muted/30 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {!product.inStock && (
                      <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                        <span className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-medium">
                          Agotado
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">
                      {product.category}
                    </p>

                    <h3 className="font-heading font-semibold mb-2">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-1 mb-3">
                      <Star size={14} className="fill-primary text-primary" />
                      <span className="text-sm">
                        {product.rating}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-lg">
                        {formatPrice(product.price)}
                      </span>

                      {product.inStock && (
                        <button className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity">
                          <ShoppingCart size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {filteredProducts.length === 0 && (
                <p className="col-span-full text-center text-muted-foreground">
                  No hay productos con esa categoría.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Products;