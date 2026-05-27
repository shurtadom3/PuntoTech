import { motion } from "framer-motion";
import { CheckCircle2, FileCheck, ShieldCheck, Truck } from "lucide-react";
import Navbar from "./navbar";

const items = [
  {
    icon: ShieldCheck,
    title: "Garantia extendida",
    text: "Cobertura para fallas de fabrica y soporte tecnico segun la categoria del producto.",
  },
  {
    icon: FileCheck,
    title: "Registro digital",
    text: "Cada compra queda asociada a tu correo para consultar soporte y trazabilidad.",
  },
  {
    icon: Truck,
    title: "Revision de entrega",
    text: "Validamos el estado del producto al despacharlo y registramos novedades de envio.",
  },
];

const Guarantees = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-16 md:pt-28">
        <div className="container mx-auto px-4 md:px-6">
          <section className="max-w-3xl text-left">
            <p className="text-sm font-semibold text-primary mb-2">Soporte PuntoTech</p>
            <h1 className="font-heading text-3xl md:text-5xl font-bold">Garantias</h1>
            <p className="mt-4 text-muted-foreground">
              Consulta las condiciones principales de garantia para celulares, computadores, audio y accesorios.
            </p>
          </section>

          <section className="mt-10 grid gap-5 md:grid-cols-3">
            {items.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="glass rounded-lg p-5 text-left"
              >
                <item.icon size={28} className="text-primary" />
                <h2 className="mt-4 font-heading text-xl font-bold">{item.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
              </motion.article>
            ))}
          </section>

          <section className="mt-8 rounded-lg border border-border bg-card p-5 text-left">
            <h2 className="font-heading text-xl font-bold">Proceso</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {["Presenta factura o correo de compra", "Validamos producto y cobertura", "Reparamos, cambiamos o respondemos el caso"].map((step) => (
                <div key={step} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default Guarantees;
