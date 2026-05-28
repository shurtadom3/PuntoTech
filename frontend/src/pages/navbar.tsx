import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, Search, User } from "lucide-react";
import { useCart } from "../context/CartContext";

interface StoredUser {
  id: string;
  name?: string;
  email: string;
}

const getStoredUser = (): StoredUser | null => {
  const raw = localStorage.getItem("puntotech_user");
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    localStorage.removeItem("puntotech_user");
    return null;
  }
};

const notifyAuth = (message: string) => {
  window.dispatchEvent(new CustomEvent("puntotech_auth_message", { detail: message }));
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<StoredUser | null>(() => getStoredUser());
  const { count, openCart } = useCart();
  const navigate = useNavigate();

  const links = [
    { label: "Inicio", to: "/" },
    { label: "Productos", to: "/products" },
    { label: "Combos", to: "/combo" },
    { label: "Garantias", to: "/garantias" },
  ];

  const handleOpenCart = () => {
    setIsOpen(false);
    openCart();
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    setIsOpen(false);
    setIsSearchOpen(false);
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  const handleLogout = () => {
    const displayName = user?.name || user?.email.split("@")[0] || "usuario";
    localStorage.removeItem("puntotech_user");
    setUser(null);
    setIsOpen(false);
    window.dispatchEvent(new Event("puntotech_user_changed"));
    notifyAuth(`Cierre de sesion confirmado. Hasta pronto, ${displayName}.`);
    navigate("/");
  };

  useEffect(() => {
    const syncUser = () => setUser(getStoredUser());

    window.addEventListener("puntotech_user_changed", syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("puntotech_user_changed", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="font-heading font-bold text-primary-foreground text-sm">PT</span>
            </div>
            <span className="font-heading font-bold text-xl text-foreground">
              Punto<span className="text-primary">tech</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2 rounded-lg border border-border bg-background px-3">
                <Search size={16} className="text-muted-foreground" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  autoFocus
                  placeholder="Buscar producto"
                  className="h-10 w-44 bg-transparent text-sm outline-none"
                />
                <button type="submit" className="text-muted-foreground hover:text-primary">
                  <Search size={16} />
                </button>
                <button type="button" onClick={() => setIsSearchOpen(false)} className="text-muted-foreground hover:text-primary">
                  <X size={16} />
                </button>
              </form>
            ) : (
              <button type="button" onClick={() => setIsSearchOpen(true)} className="text-muted-foreground hover:text-primary transition-colors">
                <Search size={20} />
              </button>
            )}
            {user ? (
              <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
                <User size={16} />
                <span>Hola, {user.name || user.email.split("@")[0]}</span>
                <button type="button" onClick={handleLogout} className="text-xs text-muted-foreground hover:text-primary">
                  Salir
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-muted-foreground hover:text-primary transition-colors" title="Iniciar sesion">
                <User size={20} />
              </Link>
            )}
            <button type="button" onClick={handleOpenCart} className="relative text-muted-foreground hover:text-primary transition-colors" title="Carrito">
              <ShoppingCart size={20} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <button type="button" onClick={handleOpenCart} className="relative text-muted-foreground" title="Carrito">
              <ShoppingCart size={22} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
            </button>
            <button type="button" onClick={() => setIsOpen(!isOpen)} className="text-foreground">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-muted-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <form onSubmit={handleSearch} className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1">
                <Search size={18} className="text-muted-foreground" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Buscar producto"
                  className="h-10 w-full bg-transparent text-sm outline-none"
                />
                <button type="submit" className="text-muted-foreground hover:text-primary">
                  <Search size={18} />
                </button>
              </form>
              <div className="flex items-center gap-4 pt-4 border-t border-border">
                {user ? (
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <User size={20} />
                    <span>Hola, {user.name || user.email.split("@")[0]}</span>
                    <button type="button" onClick={handleLogout} className="text-xs text-muted-foreground">
                      Salir
                    </button>
                  </div>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <User size={20} className="text-muted-foreground" />
                  </Link>
                )}
                <button type="button" onClick={handleOpenCart} className="relative">
                  <ShoppingCart size={20} className="text-muted-foreground" />
                  {count > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                      {count}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
