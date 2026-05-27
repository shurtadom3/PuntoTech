import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, X, ShoppingBag } from "lucide-react";
import { agregarAlCarrito, crearPedido } from "../api";
import { useCart } from "../context/CartContext";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));

const getUser = () => {
  const raw = localStorage.getItem("puntotech_user");
  return raw ? JSON.parse(raw) : null;
};

interface CartSidebarProps {
  onCheckoutSuccess?: (message: string) => void;
}

const CartSidebar = ({ onCheckoutSuccess }: CartSidebarProps) => {
  const { closeCart, clearCart, isCartOpen, items, removeItem, total, updateQuantity } = useCart();
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  const handleCheckout = async () => {
    if (!items.length) return;
    if (!user) {
      closeCart();
      navigate(`/login?next=${encodeURIComponent(location.pathname)}`);
      return;
    }
    if (address.trim().length < 5) {
      setMessage("Escribe una direccion de envio valida.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      for (const item of items) {
        await agregarAlCarrito(user.id, item.product.id, item.quantity);
      }
      const order = await crearPedido(user.id, address);
      if (order.error) {
        setMessage(order.error);
        return;
      }
      clearCart();
      setAddress("");
      const estimatedDate = order.estimated_delivery_date
        ? ` Fecha estimada de llegada: ${formatDate(order.estimated_delivery_date)}.`
        : "";
      const emailMessage = order.email_sent
        ? "El correo de confirmacion fue enviado."
        : "Revisa la configuracion SMTP para que el correo salga de verdad.";
      onCheckoutSuccess?.(
        order.message
          ? `${order.message} Pedido ${order.id}.${estimatedDate} ${emailMessage}`
          : `Compra confirmada. El producto se compro correctamente. Pedido ${order.id}.${estimatedDate} ${emailMessage}`
      );
      closeCart();
    } catch {
      setMessage("No se pudo completar la compra. Revisa que el backend este activo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Cerrar carrito"
            className="fixed inset-0 z-[70] bg-slate-900/35"
            style={{ zIndex: 9990 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          <motion.aside
            className="fixed right-0 top-0 z-[80] flex h-dvh w-full max-w-md flex-col bg-background shadow-2xl"
            style={{ zIndex: 9991 }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
          >
            <header className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-primary">Tu compra</p>
                <h2 className="font-heading text-2xl font-bold">Carrito</h2>
              </div>
              <button type="button" onClick={closeCart} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
                <X size={22} />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <ShoppingBag size={44} className="text-primary" />
                <h3 className="mt-4 font-heading text-xl font-bold">Tu carrito esta vacio</h3>
                <p className="mt-2 text-sm text-muted-foreground">Agrega productos para verlos aqui.</p>
                <Link
                  to="/products"
                  onClick={closeCart}
                  className="mt-6 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground"
                >
                  Ver productos
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
                  {items.map((item) => (
                    <article key={item.product.id} className="grid grid-cols-[76px_1fr] gap-3 rounded-lg border border-border p-3">
                      <img src={item.product.image} alt={item.product.name} className="h-20 w-20 rounded-lg object-cover" />
                      <div className="min-w-0 text-left">
                        <p className="truncate text-sm font-semibold">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">{formatPrice(item.product.price)}</p>
                        <div className="mt-3 flex items-center justify-between gap-2">
                          <div className="flex items-center rounded-lg border border-border">
                            <button type="button" onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-2 text-muted-foreground hover:text-primary">
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                            <button type="button" onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-2 text-muted-foreground hover:text-primary">
                              <Plus size={14} />
                            </button>
                          </div>
                          <button type="button" onClick={() => removeItem(item.product.id)} className="rounded-lg p-2 text-muted-foreground hover:bg-red-50 hover:text-red-600">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <footer className="border-t border-border px-5 py-5">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total</span>
                    <strong className="font-heading text-xl">{formatPrice(total)}</strong>
                  </div>

                  {user && (
                    <label className="mt-4 block text-sm font-medium">
                      Direccion de envio
                      <textarea
                        value={address}
                        onChange={(event) => setAddress(event.target.value)}
                        className="mt-2 min-h-20 w-full rounded-lg border border-border bg-card p-3 text-foreground outline-none focus:border-primary"
                        placeholder="Calle, ciudad, referencias"
                      />
                    </label>
                  )}

                  {!user && (
                    <p className="mt-4 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                      El inicio de sesion solo se pedira al comprar.
                    </p>
                  )}

                  {message && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{message}</p>}

                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={loading}
                    className="mt-4 w-full rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
                  >
                    {user ? "Comprar ahora" : "Iniciar sesion para comprar"}
                  </button>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
