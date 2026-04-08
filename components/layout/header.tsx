// components/layout/header.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  Cookie,
  User,
  LogOut,
  LogIn,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/providers/cart-provider";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import ThemeToggle from "@/components/features/theme-toggle/theme-toggle";
import { SearchDialog } from "@/components/features/search/search-dialog";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Productos", href: "/products" },
  { label: "Delivery", href: "/delivery" },
  { label: "Nosotros", href: "/about" },
  { label: "Contacto", href: "/contact" },
];

function OnlineBadge() {
  return (
    <span className="relative flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
    </span>
  );
}

function getDisplayName(user: SupabaseUser): string {
  const full =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Usuario";
  return full.split(" ")[0];
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { totalItems, toggleCart } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await supabase.auth.signOut();
    setIsSigningOut(false);
    router.push("/");
  };

  const displayName = user ? getDisplayName(user) : null;

  return (
    <>
      {/* Search Dialog — rendered at root level */}
      <SearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Main Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-lg shadow-cookie-lg py-2 border-b border-border-light"
            : "bg-background-light/80 backdrop-blur-sm py-4"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-10 h-10 rounded-full bg-gradient-cookie flex items-center justify-center shadow-glow"
              >
                <Cookie className="w-6 h-6 text-white" />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-cookie-500">
                  Vian Cookies
                </span>
                <span className="text-xs text-vanilla flex items-center">
                  <span className="w-1.5 h-1.5 bg-cookie-500 rounded-full mr-2 animate-pulse-soft" />
                  Galletas Artesanales
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-16">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-vanilla hover:text-cookie-400 transition-colors font-medium relative group text-lg"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-cookie group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              {/* Search — opens SearchDialog */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-full hover:bg-background-surface/50 transition-colors group"
                aria-label="Buscar"
              >
                <Search className="w-5 h-5 text-vanilla-dark group-hover:text-cookie-400 transition-colors" />
              </motion.button>

              <ThemeToggle />

              {/* User Account (Desktop) */}
              <div className="hidden sm:block">
                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <OnlineBadge />
                      <span className="text-sm text-vanilla font-medium">{displayName}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="p-2 rounded-full hover:bg-background-surface/50 transition-colors group"
                      aria-label="Cerrar sesión"
                    >
                      <LogOut className="w-5 h-5 text-vanilla-dark group-hover:text-cookie-400 transition-colors" />
                    </motion.button>
                  </div>
                ) : (
                  <Link href="/auth">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-full hover:bg-background-surface/50 transition-colors group"
                      aria-label="Iniciar sesión"
                    >
                      <LogIn className="w-5 h-5 text-vanilla-dark group-hover:text-cookie-400 transition-colors" />
                    </motion.button>
                  </Link>
                )}
              </div>

              {/* Cart */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleCart}
                className="relative p-2 rounded-full hover:bg-background-surface/50 transition-colors group"
                aria-label="Carrito"
              >
                <ShoppingCart className="w-5 h-5 text-vanilla-dark group-hover:text-cookie-400 transition-colors" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-cookie text-white text-xs font-bold flex items-center justify-center shadow-glow"
                  >
                    {totalItems > 9 ? "9+" : totalItems}
                  </motion.span>
                )}
              </motion.button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-full hover:bg-background-surface/50 transition-colors"
                aria-label="Menú"
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <X className="w-6 h-6 text-vanilla-dark" />
                    </motion.div>
                  ) : (
                    <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Menu className="w-6 h-6 text-vanilla-dark" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1">
          <motion.div
            className="h-full bg-gradient-cookie shadow-glow"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isScrolled ? 1 : 0 }}
            style={{ originX: 0 }}
          />
        </div>
      </header>

      {/* Mobile Menu (Sidebar) */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-background z-50 md:hidden shadow-cookie-xl border-l border-border-dark"
            >
              <div className="p-6 h-full flex flex-col">
                {/* Header del menú */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-cookie flex items-center justify-center shadow-glow">
                      <Cookie className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-cookie-500">Vian Cookies</div>
                      <div className="text-xs text-caramel">Menú</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-full hover:bg-background-surface transition-colors"
                  >
                    <X className="w-5 h-5 text-vanilla-dark" />
                  </button>
                </div>

                {/* Search button in mobile menu */}
                <button
                  onClick={() => { setIsMenuOpen(false); setIsSearchOpen(true); }}
                  className="flex items-center gap-3 w-full px-4 py-3 mb-4 rounded-xl bg-background-surface border border-border-light text-caramel hover:text-cookie-400 hover:border-cookie-500/40 transition-colors text-sm"
                >
                  <Search className="w-4 h-4" />
                  Buscar galletas...
                </button>

                {/* Nav items */}
                <nav className="flex flex-col gap-1 flex-1">
                  {navItems.map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center px-4 py-3 rounded-xl text-base font-medium transition-colors",
                          pathname === item.href
                            ? "bg-cookie-500/10 text-cookie-400"
                            : "text-vanilla hover:bg-background-surface hover:text-cookie-400"
                        )}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* User section in mobile */}
                <div className="border-t border-border-light pt-4">
                  {user ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 px-4 py-2">
                        <OnlineBadge />
                        <span className="text-sm text-vanilla">{displayName}</span>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-caramel hover:bg-background-surface hover:text-cookie-400 transition-colors text-sm"
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar sesión
                      </button>
                    </div>
                  ) : (
                    <Link href="/auth">
                      <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-caramel hover:bg-background-surface hover:text-cookie-400 transition-colors text-sm">
                        <LogIn className="w-4 h-4" />
                        Iniciar sesión
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}