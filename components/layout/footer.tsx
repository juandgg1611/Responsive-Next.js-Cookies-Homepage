// components/layout/footer.tsx
"use client";

import {
  Instagram,
  Facebook,
  Twitter,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background-dark border-t border-border-light py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-display font-bold text-cookie-400 mb-4">
              Vian Cookies
            </div>
            <p className="text-caramel text-sm">
              Galletas artesanales horneadas con pasión y los mejores
              ingredientes.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-vanilla mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm">
              {[
                "Inicio",
                "Productos",
                "Sobre Nosotros",
                "Testimonios",
                "Contacto",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-caramel hover:text-cookie-400 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-vanilla mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm text-caramel">
              <li className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Av 5 de Julio, Maracaibo-Venezuela
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                +58 424 680 1808
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                hola@viancookies.com
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-vanilla mb-4">Síguenos</h4>
            <div className="flex space-x-4">
              {[
                { icon: Instagram, label: "Instagram", href: "viancookies" },
                { icon: Facebook, label: "Facebook", href: "#" },
                { icon: Twitter, label: "Twitter", href: "#" },
                {
                  icon: Mail,
                  label: "Email",
                  href: "mailto:hola@viancookies.com",
                },
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-background-surface flex items-center justify-center text-caramel hover:text-cookie-400 hover:border-cookie-400 border border-border-light transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border-light mt-8 pt-8 text-center text-sm text-caramel">
          <p>© {currentYear} Vian Cookies. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
