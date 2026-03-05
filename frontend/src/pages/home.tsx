import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import heroBanner from "@/assets/homeBack.jpg";

const Home = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="Tecnología premium en Puntotech"
          className="w-full h-full object-cover opacity-40"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 pt-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6"
          >
            <Zap size={14} className="text-primary" />
            <span className="text-sm text-primary font-medium">Stock inteligente en tiempo real</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            Tu próximo
            <br />
            <span className="gradient-text">nivel tech</span>
            <br />
            empieza aquí
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg"
          >
            Celulares, computadores, audio y accesorios con recomendaciones inteligentes, combos exclusivos y garantía extendida digital.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#categorias"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity glow"
            >
              Explorar productos
              <ArrowRight size={18} />
            </a>
            <a
              href="#combos"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border border-border text-foreground font-semibold hover:border-primary/50 hover:text-primary transition-colors"
            >
              Ver combos tech
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex gap-8 mt-12 pt-8 border-t border-border/50"
          >
            {[
              { value: "500+", label: "Productos" },
              { value: "24h", label: "Envío rápido" },
              { value: "2 años", label: "Garantía digital" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-heading text-2xl md:text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Home;