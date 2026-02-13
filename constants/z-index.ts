// constants/z-index.ts
export const Z_INDEX = {
  BACKGROUND: 0, // Capas de fondo
  CONTENT: 10, // Contenido general
  HEADER: 40, // Header fijo
  CHAT_BUTTON: 45, // Botón del chatbot
  CHAT_WINDOW: 47, // Ventana del chatbot
  CART_OVERLAY: 48, // Overlay del carrito (mismo nivel que chat window)
  CART_SIDEBAR: 50, // Sidebar del carrito
  MOBILE_MENU: 50, // Menú móvil (el más alto)
  MODAL: 60, // Modales globales
  TOAST: 70, // Notificaciones toast
} as const;
