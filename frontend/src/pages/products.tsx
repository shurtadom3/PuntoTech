import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown, Check, Search, SlidersHorizontal, Star, ShoppingCart } from "lucide-react";
import Navbar from "./navbar";
import { listarProductos } from "../api";
import { CartProduct, useCart } from "../context/CartContext";

import productPhone from "../assets/productPhone.jpg";
import productLaptop from "../assets/productLaptop.jpg";
import productHeadphones from "../assets/productHeadphones.jpg";
import productSpeaker from "../assets/productSpeaker.jpg";
import productAccessories from "../assets/productAccessories.jpg";

interface ApiProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: string | number;
  description: string;
  available_stock: number | null;
}

const imageByCategory: Record<string, string> = {
  Celulares: productPhone,
  Computadores: productLaptop,
  Laptops: productLaptop,
  Audifonos: productHeadphones,
  "Audífonos": productHeadphones,
  Bafles: productSpeaker,
  Accesorios: productAccessories,
};

const fallbackProducts: CartProduct[] = [
  { id: "demo-phone", name: "Galaxy S24 Ultra", brand: "Samsung", category: "Celulares", price: 4299000, image: productPhone, available_stock: 12 },
  { id: "demo-laptop", name: "MacBook Pro M3", brand: "Apple", category: "Computadores", price: 8999000, image: productLaptop, available_stock: 8 },
  { id: "demo-headphones", name: "WH-1000XM5", brand: "Sony", category: "Audífonos", price: 1499000, image: productHeadphones, available_stock: 15 },
  { id: "demo-speaker", name: "JBL Charge 5", brand: "JBL", category: "Bafles", price: 649000, image: productSpeaker, available_stock: 0 },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);

const normalizeProduct = (product: ApiProduct): CartProduct => ({
  id: product.id,
  name: product.name,
  brand: product.brand,
  category: product.category,
  price: Number(product.price),
  image: imageByCategory[product.category] || productAccessories,
  available_stock: product.available_stock ?? 0,
});

const Products = ({ showNavbar = true }: { showNavbar?: boolean }) => {
  const { addItem, openCart } = useCart();
  const [products, setProducts] = useState<CartProduct[]>(fallbackProducts);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [priceBand, setPriceBand] = useState("todos");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState("relevancia");
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    listarProductos()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data.map(normalizeProduct));
        }
      })
      .catch(() => {
        setProducts(fallbackProducts);
      });
  }, []);

  const categories = useMemo(
    () => ["Todas", ...Array.from(new Set(products.map((product) => product.category)))],
    [products]
  );

  const priceBands = [
    { label: "Todos", value: "todos", min: 0, max: Infinity },
    { label: "Menos de $500k", value: "bajo", min: 0, max: 500000 },
    { label: "$500k - $2M", value: "medio", min: 500000, max: 2000000 },
    { label: "Mas de $2M", value: "alto", min: 2000000, max: Infinity },
  ];

  const filteredProducts = useMemo(() => {
    const selectedBand = priceBands.find((band) => band.value === priceBand) || priceBands[0];
    const normalizedQuery = query.trim().toLowerCase();

    return products
      .filter((product) => {
        const matchesSearch =
          normalizedQuery.length === 0 ||
          `${product.name} ${product.brand} ${product.category}`.toLowerCase().includes(normalizedQuery);
        const matchesCategory = selectedCategory === "Todas" || product.category === selectedCategory;
        const matchesPrice = product.price >= selectedBand.min && product.price <= selectedBand.max;
        const matchesStock = !onlyInStock || product.available_stock > 0;
        return matchesSearch && matchesCategory && matchesPrice && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === "precio-menor") return a.price - b.price;
        if (sortBy === "precio-mayor") return b.price - a.price;
        if (sortBy === "stock") return b.available_stock - a.available_stock;
        return a.name.localeCompare(b.name);
      });
  }, [onlyInStock, priceBand, products, query, selectedCategory, sortBy]);

  const handleAdd = (product: CartProduct) => {
    addItem(product);
    openCart();
    setAddedId(product.id);
    window.setTimeout(() => setAddedId(null), 1200);
  };

  return (
    <>
      {showNavbar && <Navbar />}

      <section className={`bg-background pb-16 ${showNavbar ? "min-h-screen pt-24 md:pt-28" : "py-16 md:py-20"}`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8 text-left">
            <p className="text-sm font-semibold text-primary mb-2">Catalogo PuntoTech</p>
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-foreground">Productos</h1>
          </div>

          <div className="mb-8 rounded-lg border border-border bg-card p-4 shadow-sm md:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-primary" />
                <h2 className="font-heading font-semibold">Encontrar productos</h2>
              </div>
              <span className="text-sm text-muted-foreground">{filteredProducts.length} resultados</span>
            </div>

            <div className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr_0.9fr_0.8fr]">
              <label className="block text-sm font-medium">
                Buscar
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-border bg-background px-3">
                  <Search size={16} className="text-muted-foreground" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Nombre, marca o categoria"
                    className="h-11 w-full bg-transparent text-sm outline-none"
                  />
                </div>
              </label>

              <label className="block text-sm font-medium">
                Categoria
                <select
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                  className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                >
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium">
                Precio
                <select
                  value={priceBand}
                  onChange={(event) => setPriceBand(event.target.value)}
                  className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                >
                  {priceBands.map((band) => (
                    <option key={band.value} value={band.value}>{band.label}</option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium">
                Ordenar
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-border bg-background px-3">
                  <ArrowUpDown size={16} className="text-muted-foreground" />
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    className="h-11 w-full bg-transparent text-sm outline-none"
                  >
                    <option value="relevancia">Nombre</option>
                    <option value="precio-menor">Menor precio</option>
                    <option value="precio-mayor">Mayor precio</option>
                    <option value="stock">Mayor stock</option>
                  </select>
                </div>
              </label>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setOnlyInStock((value) => !value)}
                className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                  onlyInStock
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                Disponibles ahora
              </button>
              <button
                onClick={() => {
                  setQuery("");
                  setSelectedCategory("Todas");
                  setPriceBand("todos");
                  setOnlyInStock(false);
                  setSortBy("relevancia");
                }}
                className="text-sm font-semibold text-primary hover:underline"
              >
                Limpiar busqueda
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, i) => {
              const inStock = product.available_stock > 0;
              const justAdded = addedId === product.id;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -5 }}
                  className="group glass rounded-lg overflow-hidden"
                >
                  <div className="relative aspect-square bg-muted overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {!inStock && (
                      <div className="absolute inset-0 bg-white/75 flex items-center justify-center">
                        <span className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-medium">
                          Agotado
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 text-left">
                    <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
                    <h3 className="font-heading font-semibold text-lg mb-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{product.brand}</p>

                    <div className="flex items-center gap-1 mb-4">
                      <Star size={14} className="fill-primary text-primary" />
                      <span className="text-sm">4.8</span>
                      <span className="text-xs text-muted-foreground">Stock: {product.available_stock}</span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="font-heading font-bold text-lg">{formatPrice(product.price)}</span>
                      <button
                        disabled={!inStock}
                        onClick={() => handleAdd(product)}
                        className="inline-flex h-10 min-w-10 items-center justify-center gap-2 rounded-lg bg-primary px-3 text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
                      >
                        {justAdded ? <Check size={18} /> : <ShoppingCart size={18} />}
                        <span className="hidden md:inline text-sm">{justAdded ? "Listo" : "Agregar"}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <p className="mt-12 text-center text-muted-foreground">No hay productos con esos filtros.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default Products;
