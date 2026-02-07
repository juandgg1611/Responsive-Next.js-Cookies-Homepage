# 🍪 Vian Cookies - Galletas Artesanales Premium

## 🌟 Descripción

Vian Cookies es una landing page premium para una marca de galletas artesanales de alta calidad. Este proyecto combina diseño moderno, animaciones fluidas y una experiencia de usuario excepcional para mostrar productos gourmet de repostería artesanal.

## ✨ Características Principales

### 🎨 Diseño Premium

- **Neumorfismo Galleta**: Efectos visuales 3D inspirados en galletas
- **Paleta de Colores Única**: Tonos cálidos de galleta horneada, chocolate y fondos marrones elegantes
- **Responsividad Total**: Diseño adaptado para todos los dispositivos
- **Tipografía Elegante**: Combinación de Playfair Display (elegante) e Inter (moderna)

### 🚀 Tecnologías Modernas

- **Next.js 14**: Framework React de última generación
- **TypeScript**: Tipado estático para mayor robustez
- **Tailwind CSS**: Estilización utilitaria y personalizada
- **Framer Motion**: Animaciones fluidas y avanzadas
- **Shadcn/ui**: Componentes UI accesibles y personalizables

### 🎭 Animaciones y Efectos

- **Efecto Partículas**: Chispas de chocolate animadas en el fondo
- **Hover Effects**: Interacciones sofisticadas en tarjetas y botones
- **Scroll Animations**: Revelado suave al hacer scroll
- **Transiciones Fluidas**: Movimientos naturales entre secciones
- **Gradientes Animados**: Efectos visuales dinámicos

## 🚀 Empezando

Este proyecto usa Next.js creado con `create-next-app`.

### Primeros Pasos

Primero, ejecuta el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev
```

Abre <http://localhost:3000> en tu navegador para ver el resultado.

Puedes empezar a editar la página modificando `app/page.tsx`. La página se actualiza automáticamente mientras editas el archivo.

Este proyecto usa `next/font` para optimizar y cargar automáticamente **Geist**, una nueva familia de fuentes para Vercel. [web:20]

---

## Aprende Más

Para aprender más sobre Next.js, mira los siguientes recursos:

- **Documentación de Next.js**: aprende sobre las características y API de Next.js. [web:20]
- **Aprende Next.js**: un tutorial interactivo de Next.js. [web:20]
- Puedes revisar el **repositorio de Next.js en GitHub**: ¡tus comentarios y contribuciones son bienvenidos! [web:28]

---

## 🏗️ Estructura del Proyecto

````text
vian-cookies/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Layout principal
│   │   ├── page.tsx               # Homepage
│   │   └── globals.css            # Estilos globales
│   ├── components/
│   │   ├── ui/                    # Componentes Shadcn/ui
│   │   ├── layout/                # Componentes de layout
│   │   ├── sections/              # Secciones de la página
│   │   │   ├── hero-section.tsx
│   │   │   ├── features-section.tsx
│   │   │   ├── testimonials-section.tsx
│   │   │   └── cta-section.tsx
│   │   ├── shared/                # Componentes compartidos
│   │   └── providers/             # Providers de contexto
│   ├── lib/
│   │   ├── utils.ts               # Utilidades
│   │   ├── constants.ts           # Constantes
│   │   └── animations.ts          # Configuración de animaciones
│   └── types/
│       └── index.ts               # Tipos TypeScript
├── public/
│   ├── images/
│   │   ├── products/              # Imágenes de productos
│   │   ├── testimonials/          # Fotos de testimonios
│   │   └── hero/                  # Imágenes hero
│   └── favicon.ico
├── package.json
├── next.config.js                # Configuración Next.js
├── tailwind.config.js            # Configuración Tailwind
├── tsconfig.json                 # Configuración TypeScript
└── README.md
``` [web:20][web:23]

---

## 🎨 Paleta de Colores

### Modo Claro

```css
--color-cookie-light: #D4A574;    /* Galleta horneada */
--color-chocolate-dark: #8B4513;  /* Chocolate premium */
--color-bg-dark: #2C1810;         /* Fondo marrón elegante */
--color-vanilla: #F5E9D9;         /* Vainilla suave */
--color-caramel: #A67C52;         /* Caramelo natural */


--color-cookie-dark: #B8945C;
--color-chocolate-deep: #5D2906;
--color-bg-black: #1A0F0A;
--color-vanilla-cream: #E8DBC5;
--color-caramel-dark: #8B5A2B;
````

````[web:24]

---

## 📦 Scripts Disponibles

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "type-check": "tsc --noEmit",
  "format": "prettier --write ."
}
``` [web:19][web:25]

---

## 🔧 Configuración Personalizada

### Tailwind CSS

El proyecto incluye una configuración personalizada de Tailwind con:

- Colores personalizados para galletas.
- Animaciones CSS personalizadas.
- Sombras y efectos de neumorfismo.
- Breakpoints optimizados. [web:24]

### Framer Motion

Configuración de animaciones optimizadas:

- Transiciones suaves.
- Efectos de entrada escalonados.
- Animaciones de scroll.
- Optimizaciones de performance. [web:26]

---

## 🎯 Características de la Landing Page

### Sección Hero

- Carrusel automático de productos.
- Efecto de partículas de chocolate.
- Animaciones de galleta giratoria.
- CTA principal con efectos hover.

### Características

- Grid responsivo de características.
- Efectos de neumorfismo en tarjetas.
- Iconos animados al hacer hover.
- Diseño de gradientes personalizados.

### Testimonios

- Grid estático de testimonios.
- Calificación con estrellas animadas.
- Estadísticas interactivas.
- Efectos visuales de confianza.

### CTA Final

- Formulario de suscripción.
- Efectos de confetti.
- Diseño de gradiente premium.
- Animaciones de entrada.
````
