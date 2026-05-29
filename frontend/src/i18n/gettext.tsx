import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type Language = "es" | "en";
type Params = Record<string, string | number>;

interface I18nContextValue {
  language: Language;
  gettext: (message: string, params?: Params) => string;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
}

const STORAGE_KEY = "puntotech_language";

const translations: Record<Language, Record<string, string>> = {
  es: {},
  en: {
    Inicio: "Home",
    Productos: "Products",
    Combos: "Bundles",
    Garantias: "Warranties",
    "Buscar producto": "Search product",
    "Iniciar sesion": "Sign in",
    Carrito: "Cart",
    "Hola, {name}": "Hi, {name}",
    Salir: "Sign out",
    "Cambiar idioma": "Change language",
    "Cierre de sesion confirmado. Hasta pronto, {name}.": "Signed out. See you soon, {name}.",

    "Tu proximo": "Your next",
    "nivel tech": "tech level",
    "empieza aqui": "starts here",
    "Celulares, computadores, audio y accesorios con recomendaciones inteligentes, combos exclusivos y garantia extendida digital.":
      "Phones, computers, audio and accessories with smart recommendations, exclusive bundles and digital extended warranty.",
    "Explorar productos": "Explore products",
    "Ver combos tech": "See tech bundles",
    "Envio rapido": "Fast shipping",
    "Garantia digital": "Digital warranty",
    "Tecnologia premium en Puntotech": "Premium technology at Puntotech",

    "Explora por": "Explore by",
    categoria: "category",
    "Encuentra exactamente lo que buscas en nuestra seleccion curada de tecnologia.":
      "Find exactly what you need in our curated technology selection.",
    "No se pudo leer el conteo de productos.": "Could not read the product count.",
    "Activa el backend para ver los conteos reales.": "Start the backend to see real counts.",
    "{count} productos": "{count} products",

    "Tu tienda de tecnologia con stock inteligente, combos exclusivos y garantias digitales.":
      "Your technology store with smart stock, exclusive bundles and digital warranties.",
    Categorias: "Categories",
    Soporte: "Support",
    Contacto: "Contact",
    Celulares: "Phones",
    Computadores: "Computers",
    Audifonos: "Headphones",
    Bafles: "Speakers",
    Accesorios: "Accessories",
    "Mis Garantias": "My warranties",
    "Seguir pedido": "Track order",
    Devoluciones: "Returns",
    "Todos los derechos reservados.": "All rights reserved.",
    Terminos: "Terms",
    Privacidad: "Privacy",

    "Solo para comprar": "Only for checkout",
    "Crear cuenta": "Create account",
    Entrar: "Sign in",
    Registro: "Register",
    Nombre: "Name",
    Correo: "Email",
    Contrasena: "Password",
    "No se pudo conectar con el backend.": "Could not connect to the backend.",
    "Inicio de sesion confirmado. Bienvenido, {name}.": "Signed in. Welcome, {name}.",
    "Registro confirmado. Bienvenido a PuntoTech, {name}.": "Registration confirmed. Welcome to PuntoTech, {name}.",

    "Tu compra": "Your purchase",
    "Cerrar carrito": "Close cart",
    "Tu carrito esta vacio": "Your cart is empty",
    "Agrega productos para verlos aqui.": "Add products to see them here.",
    "Ver productos": "View products",
    Total: "Total",
    "Direccion de envio": "Shipping address",
    "Calle, ciudad, referencias": "Street, city, notes",
    "El inicio de sesion solo se pedira al comprar.": "Sign in is only required at checkout.",
    "Comprar ahora": "Buy now",
    "Iniciar sesion para comprar": "Sign in to buy",
    "Escribe una direccion de envio valida.": "Enter a valid shipping address.",
    "Fecha estimada de llegada: {date}.": "Estimated delivery date: {date}.",
    "El correo de confirmacion fue enviado.": "The confirmation email was sent.",
    "Revisa la configuracion SMTP para que el correo salga de verdad.":
      "Check the SMTP configuration so the email can be sent.",
    "Compra confirmada. El producto se compro correctamente. Pedido {id}.":
      "Purchase confirmed. The product was bought successfully. Order {id}.",
    "Pedido {id}.": "Order {id}.",
    "Cerrar mensaje": "Close message",
    "No se pudo completar la compra. Revisa que el backend este activo.":
      "Could not complete the purchase. Check that the backend is running.",

    "Catalogo PuntoTech": "PuntoTech catalog",
    "Cambio de moneda por API externa": "Currency exchange through external API",
    "El backend consulta la tasa USD/COP mediante el Adapter y la interfaz convierte los precios del catalogo.":
      "The backend fetches the USD/COP rate through the Adapter and the interface converts catalog prices.",
    "Consultando tasa de cambio...": "Checking exchange rate...",
    "1 {from} equivale a": "1 {from} equals",
    "Fecha: {date}": "Date: {date}",
    "Fecha no informada por el proveedor": "Date not provided by the provider",
    "Proveedor: {provider}": "Provider: {provider}",
    "API externa configurada": "Configured external API",
    "No se pudo consultar la API externa de cambio de moneda.": "Could not query the external exchange-rate API.",
    "Encontrar productos": "Find products",
    "{count} resultados": "{count} results",
    Buscar: "Search",
    "Nombre, marca o categoria": "Name, brand or category",
    Categoria: "Category",
    Precio: "Price",
    Ordenar: "Sort",
    Todas: "All",
    Todos: "All",
    "Menos de $500k": "Less than $500k",
    "$500k - $2M": "$500k - $2M",
    "Mas de $2M": "More than $2M",
    "Menor precio": "Lowest price",
    "Mayor precio": "Highest price",
    "Mayor stock": "Highest stock",
    "Disponibles ahora": "Available now",
    "Limpiar busqueda": "Clear search",
    "Cargando productos...": "Loading products...",
    "No se pudieron leer los productos de la base de datos.": "Could not read products from the database.",
    "No se pudo conectar con la base de datos. Revisa que el backend este activo.":
      "Could not connect to the database. Check that the backend is running.",
    Info: "Info",
    Agotado: "Out of stock",
    Stock: "Stock",
    "Ref. {price}": "Ref. {price}",
    Listo: "Done",
    Agregar: "Add",
    "Agregado": "Added",
    "Agregar al carrito": "Add to cart",
    "{count} unidades": "{count} units",
    "No hay productos con esos filtros.": "No products match those filters.",
    "Productos de aliados": "Partner products",
    "Catalogo consumido desde el servicio JSON del equipo aliado.": "Catalog consumed from the partner team's JSON service.",
    "Configura ALLIED_SERVICE_URL para mostrar datos reales del equipo aliado.":
      "Configure ALLIED_SERVICE_URL to show real partner data.",
    "No se pudo cargar el catalogo aliado.": "Could not load the partner catalog.",

    "Ahorra mas con combos": "Save more with bundles",
    tecnologicos: "technology",
    "Paquetes disponibles.": "Available bundles.",
    "Cargando combos...": "Loading bundles...",
    "No se pudieron leer los combos de la base de datos.": "Could not read bundles from the database.",
    "No hay combos disponibles.": "No bundles available.",
    "Agregar combo": "Add bundle",
    Combo: "Bundle",

    "Soporte PuntoTech": "PuntoTech support",
    "Consulta las condiciones principales de garantia para celulares, computadores, audio y accesorios.":
      "Check the main warranty conditions for phones, computers, audio and accessories.",
    "Garantia extendida": "Extended warranty",
    "Cobertura para fallas de fabrica y soporte tecnico segun la categoria del producto.":
      "Coverage for factory defects and technical support according to the product category.",
    "Registro digital": "Digital record",
    "Cada compra queda asociada a tu correo para consultar soporte y trazabilidad.":
      "Each purchase is linked to your email for support and traceability.",
    "Revision de entrega": "Delivery review",
    "Validamos el estado del producto al despacharlo y registramos novedades de envio.":
      "We validate product condition before dispatch and record delivery updates.",
    Proceso: "Process",
    "Presenta factura o correo de compra": "Show the invoice or purchase email",
    "Validamos producto y cobertura": "We validate the product and coverage",
    "Reparamos, cambiamos o respondemos el caso": "We repair, replace or respond to the case",
  },
};

const I18nContext = createContext<I18nContextValue | null>(null);

const formatMessage = (message: string, params?: Params) =>
  Object.entries(params || {}).reduce(
    (current, [key, value]) => current.replaceAll(`{${key}}`, String(value)),
    message
  );

const getInitialLanguage = (): Language => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "en" || stored === "es" ? stored : "es";
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (nextLanguage: Language) => {
    localStorage.setItem(STORAGE_KEY, nextLanguage);
    document.documentElement.lang = nextLanguage;
    setLanguageState(nextLanguage);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      gettext: (message, params) => formatMessage(translations[language][message] || message, params),
      setLanguage,
      toggleLanguage: () => setLanguage(language === "es" ? "en" : "es"),
    }),
    [language]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useGettext = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useGettext debe usarse dentro de LanguageProvider");
  }
  return context;
};
