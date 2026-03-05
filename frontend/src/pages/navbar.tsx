import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, Search, User, LogOut, ChevronDown, Smartphone, Laptop, Headphones, Speaker } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const categories = [
  { label: "Celulares", icon: Smartphone, to: "/" },
  { label: "Computadores", icon: Laptop, to: "/products" },
  { label: "Audífonos", icon: Headphones, to: "/products" },
  { label: "Bafles", icon: Speaker, to: "/products" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { totalItems, setIsOpen: setCartOpen } = useCart();
  const navigate = useNavigate();

  const links = [
    { label: "Inicio", href: "/" },
    { label: "Combos", href: "#combo" },
    { label: "Garantías", href: "#garanties" },
  ];

  const handleAuthClick = () => {
    if (user) {
      signOut();
    } else {
      navigate("/auth");
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="font-heading font-bold text-primary-foreground text-sm">PT</span>
            </div>
            <span className="font-heading font-bold text-xl text-foreground">
              Punto<span className="text-primary">tech</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {links[0] && (
              <Link to={links[0].href} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                {links[0].label}
              </Link>
            )}

            {/* Productos Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <Link
                to="/products"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Productos
                <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
              </Link>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2"
                  >
                    <div className="w-52 rounded-xl bg-card border border-border shadow-lg p-2 space-y-1">
                      {categories.map((cat) => (
                        <Link
                          key={cat.label}
                          to={cat.to}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
                        >
                          <cat.icon size={16} className="text-primary" />
                          {cat.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {links.slice(1).map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button className="text-muted-foreground hover:text-primary transition-colors">
              <Search size={20} />
            </button>
            <button
              onClick={handleAuthClick}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              {user ? (
                <>
                  <span className="text-sm font-medium text-foreground truncate max-w-[120px]">
                    {user.fullName || user.email?.split("@")[0]}
                  </span>
                  <LogOut size={18} />
                </>
              ) : (
                <>
                  <User size={20} />
                  <span className="text-sm font-medium">Ingresar</span>
                </>
              )}
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-muted-foreground hover:text-primary transition-colors"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <Link to="#" className="text-muted-foreground hover:text-primary transition-colors py-2" onClick={() => setIsOpen(false)}>
                Inicio
              </Link>
              <Link to="#productos" className="text-muted-foreground hover:text-primary transition-colors py-2 font-medium" onClick={() => setIsOpen(false)}>
                Productos
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.label}
                  to={cat.to}
                  className="text-muted-foreground hover:text-primary transition-colors py-2 pl-4 flex items-center gap-2 text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  <cat.icon size={14} className="text-primary" />
                  {cat.label}
                </Link>
              ))}
              <Link to="#combos" className="text-muted-foreground hover:text-primary transition-colors py-2" onClick={() => setIsOpen(false)}>
                Combos
              </Link>
              <Link to="#garantias" className="text-muted-foreground hover:text-primary transition-colors py-2" onClick={() => setIsOpen(false)}>
                Garantías
              </Link>
              <div className="flex items-center gap-4 pt-4 border-t border-border">
                <Search size={20} className="text-muted-foreground" />
                <button onClick={handleAuthClick} className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                  <User size={20} />
                  <span className="text-sm">{user ? "Cerrar sesión" : "Ingresar"}</span>
                </button>
                <button onClick={() => { setCartOpen(true); setIsOpen(false); }} className="relative text-muted-foreground">
                  <ShoppingCart size={20} />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                      {totalItems}
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