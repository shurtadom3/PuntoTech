import { motion } from "framer-motion";
import { Shield, Clock, Smartphone, RefreshCw } from "lucide-react";
import Navbar from "./navbar";

const features = [
  {
    icon: Shield,
    title: "Garantía Digital",
    description: "Gestiona tus garantías extendidas desde la app. Sin papeles, sin complicaciones.",
  },
  {
    icon: Clock,
    title: "Stock en Tiempo Real",
    description: "Nunca compres algo agotado. Nuestro sistema verifica el inventario al instante.",
  },
  {
    icon: Smartphone,
    title: "Recomendaciones IA",
    description: "Sugerencias personalizadas según tu perfil y preferencias de compra.",
  },
  {
    icon: RefreshCw,
    title: "Devolución Fácil",
    description: "30 días para cambios o devoluciones sin preguntas. Tu satisfacción primero.",
  },
];

const Guarantee = () => {
  return (
    <>
    <Navbar />
    <section id="garantias" className="py-20 md:py-28 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">
            ¿Por qué <span className="gradient-text">Puntotech</span>?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            No somos solo otra tienda. Reimaginamos la experiencia de comprar tecnología.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 text-center group hover:border-primary/30 transition-colors"
            >
              <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feat.icon size={24} className="text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{feat.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
    </>
  );
};

export default Guarantee;