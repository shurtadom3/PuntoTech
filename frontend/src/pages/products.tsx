import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpDown,
  Cable,
  Check,
  Info,
  Rotate3D,
  Search,
  SlidersHorizontal,
  Star,
  ShoppingCart,
  WalletCards,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Navbar from "./navbar";
import { listarProductos, obtenerCatalogoAliado, obtenerTasaCambio } from "../api";
import type { ApiProduct, AlliedCatalog, ExchangeRate } from "../api";
import { useCart, type CartProduct } from "../context/CartContext";
import { getProductImage } from "../utils/productImages";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);

const formatUsd = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(price);

const normalizeProduct = (product: ApiProduct): CartProduct => ({
  id: product.id,
  name: product.name,
  brand: product.brand,
  category: product.category,
  price: Number(product.price),
  description:
    product.description ||
    "Producto seleccionado por PuntoTech con garantia y soporte para que compres con confianza.",
  image: getProductImage(product.name, product.category),
  available_stock: product.available_stock ?? 0,
});

const Products = ({ showNavbar = true }: { showNavbar?: boolean }) => {
  const { addItem, openCart } = useCart();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [alliedProducts, setAlliedProducts] = useState<CartProduct[]>([]);
  const [alliedMessage, setAlliedMessage] = useState("");
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [exchangeInfo, setExchangeInfo] = useState<ExchangeRate | null>(null);
  const [exchangeStatus, setExchangeStatus] = useState<"loading" | "ready" | "error">("loading");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [priceBand, setPriceBand] = useState("todos");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState("relevancia");
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "Todas";

    setQuery(search);
    setSelectedCategory(category);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    listarProductos()
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data.map(normalizeProduct).filter((product) => product.category !== "Combos"));
          setLoadError("");
        } else {
          setProducts([]);
          setLoadError("No se pudieron leer los productos de la base de datos.");
        }
      })
      .catch(() => {
        setProducts([]);
        setLoadError("No se pudo conectar con la base de datos. Revisa que el backend este activo.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    obtenerCatalogoAliado()
      .then((data: AlliedCatalog) => {
        setAlliedProducts((data.items ?? []).map(normalizeProduct));
        setAlliedMessage(data.message || "");
      })
      .catch(() => {
        setAlliedProducts([]);
        setAlliedMessage("No se pudo cargar el catalogo aliado.");
      });

    setExchangeStatus("loading");
    obtenerTasaCambio()
      .then((data: ExchangeRate) => {
        const rate = Number(data.rate);
        setExchangeRate(Number.isFinite(rate) && rate > 0 ? rate : null);
        setExchangeInfo(data);
        setExchangeStatus(Number.isFinite(rate) && rate > 0 ? "ready" : "error");
      })
      .catch(() => {
        setExchangeRate(null);
        setExchangeInfo(null);
        setExchangeStatus("error");
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

          <section className="mb-8 rounded-lg border border-border bg-card p-4 shadow-sm md:p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <WalletCards size={21} />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-bold text-foreground">Cambio de moneda por API externa</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    El backend consulta la tasa USD/COP mediante el Adapter y la interfaz convierte los precios del catalogo.
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-background p-4 text-left md:min-w-[280px]">
                {exchangeStatus === "loading" && (
                  <p className="text-sm font-semibold text-muted-foreground">Consultando tasa de cambio...</p>
                )}
                {exchangeStatus === "ready" && exchangeRate && (
                  <>
                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                      1 {exchangeInfo?.from || "USD"} equivale a
                    </p>
                    <p className="mt-1 font-heading text-2xl font-bold text-primary">{formatPrice(exchangeRate)}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {exchangeInfo?.date ? `Fecha: ${exchangeInfo.date}` : "Fecha no informada por el proveedor"}
                    </p>
                    <p className="mt-1 max-w-[260px] truncate text-xs text-muted-foreground">
                      Proveedor: {exchangeInfo?.provider || "API externa configurada"}
                    </p>
                  </>
                )}
                {exchangeStatus === "error" && (
                  <p className="text-sm font-semibold text-red-600">
                    No se pudo consultar la API externa de cambio de moneda.
                  </p>
                )}
              </div>
            </div>
          </section>

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
                    <option key={band.value} value={band.value}>
                      {band.label}
                    </option>
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
                type="button"
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
                type="button"
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

          {loading && <p className="text-center text-muted-foreground">Cargando productos...</p>}
          {!loading && loadError && <p className="text-center text-red-600">{loadError}</p>}

          {!loading && !loadError && (
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
                    className="group product-flip-card h-[520px] rounded-lg"
                    tabIndex={0}
                  >
                    <div className="product-flip-inner h-full">
                      <div className="product-flip-face product-flip-front glass overflow-hidden">
                        <div className="relative aspect-square bg-muted overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-lg bg-white/90 px-2 py-1 text-xs font-semibold text-primary shadow-sm">
                            <Rotate3D size={14} />
                            Info
                          </div>
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
                            <span>
                              <span className="block font-heading font-bold text-lg">{formatPrice(product.price)}</span>
                              {exchangeRate && (
                                <span className="block text-xs text-muted-foreground">
                                  Ref. {formatUsd(product.price / exchangeRate)}
                                </span>
                              )}
                            </span>
                            <button
                              type="button"
                              disabled={!inStock}
                              onClick={() => handleAdd(product)}
                              className="inline-flex h-10 min-w-10 items-center justify-center gap-2 rounded-lg bg-primary px-3 text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
                            >
                              {justAdded ? <Check size={18} /> : <ShoppingCart size={18} />}
                              <span className="hidden md:inline text-sm">{justAdded ? "Listo" : "Agregar"}</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="product-flip-face product-flip-back glass flex flex-col p-5 text-left">
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <span className="rounded-lg bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                            {product.category}
                          </span>
                          <Info size={18} className="text-primary" />
                        </div>
                        <h3 className="font-heading text-xl font-bold leading-tight">{product.name}</h3>
                        <p className="mt-1 text-sm font-semibold text-muted-foreground">{product.brand}</p>
                        <p className="mt-5 text-sm leading-6 text-muted-foreground">{product.description}</p>
                        <div className="mt-auto space-y-3 pt-5">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="rounded-lg border border-border bg-background p-3">
                              <p className="text-xs text-muted-foreground">Precio</p>
                              <p className="font-heading font-bold">{formatPrice(product.price)}</p>
                              {exchangeRate && (
                                <p className="text-xs text-muted-foreground">Ref. {formatUsd(product.price / exchangeRate)}</p>
                              )}
                            </div>
                            <div className="rounded-lg border border-border bg-background p-3">
                              <p className="text-xs text-muted-foreground">Stock</p>
                              <p className="font-heading font-bold">{product.available_stock} unidades</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            disabled={!inStock}
                            onClick={() => handleAdd(product)}
                            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
                          >
                            {justAdded ? <Check size={18} /> : <ShoppingCart size={18} />}
                            {justAdded ? "Agregado" : "Agregar al carrito"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {!loading && !loadError && filteredProducts.length === 0 && (
            <p className="mt-12 text-center text-muted-foreground">No hay productos con esos filtros.</p>
          )}

          {!loading && (
            <section className="mt-14 border-t border-border pt-8">
              <div className="mb-5 flex items-center gap-3">
                <Cable size={20} className="text-primary" />
                <div>
                  <h2 className="font-heading text-2xl font-bold">Productos de aliados</h2>
                  <p className="text-sm text-muted-foreground">
                    Catalogo consumido desde el servicio JSON del equipo aliado.
                  </p>
                </div>
              </div>

              {alliedProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {alliedProducts.slice(0, 4).map((product) => (
                    <article key={product.id} className="rounded-lg border border-border bg-card p-4">
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                      <h3 className="mt-1 font-heading text-lg font-bold">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.brand}</p>
                      <p className="mt-3 font-semibold text-primary">{formatPrice(product.price)}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                  {alliedMessage || "Configura ALLIED_SERVICE_URL para mostrar datos reales del equipo aliado."}
                </p>
              )}
            </section>
          )}
        </div>
      </section>
    </>
  );
};

export default Products;
