# INWine

**INWine** es un marketplace B2B que conecta tres perfiles alrededor de la compraventa de vino:

- **Cellers / bodegues** que publican su producción.
- **Restaurants** que negocian precio y compran para su carta.
- **Inversors** que financian el producto y participan del beneficio de cada venta.

La plataforma gestiona todo el ciclo: catálogo, negociación de precio, checkout con
pago con tarjeta, seguimiento logístico del pedido (aprobado → enviado → entregado →
vendido) y reparto de comisiones entre las tres partes.

## Índice

- [Stack tecnológico](#stack-tecnológico)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Puesta en marcha](#puesta-en-marcha)
- [Roles y panel de administración](#roles-y-panel-de-administración)
- [Internacionalización](#internacionalización)
- [Changelog](#changelog)

## Stack tecnológico

### Backend

|                         |                          |
| ----------------------- | ------------------------ |
| Framework               | Laravel 11 (PHP 8.2+)    |
| Base de datos           | MySQL / MariaDB          |
| Autenticación           | Laravel Sanctum (tokens) |
| Panel de administración | Filament 3               |
| Pagos                   | Stripe (Payment Intents) |
| Email transaccional     | Resend                   |

### Frontend

|                      |                                      |
| -------------------- | ------------------------------------ |
| Librería UI          | React 19                             |
| Bundler              | Vite 6                               |
| Estilos              | Tailwind CSS 4                       |
| Internacionalización | i18next (català / castellà / anglès) |
| Pagos                | Stripe.js / React Stripe Elements    |

## Estructura del repositorio

```
inwine/
├── backend/    # API Laravel + panel de administración (Filament)
│   ├── app/
│   │   ├── Http/Controllers/Api/   # Controladores de la API REST
│   │   ├── Models/                 # Modelos Eloquent
│   │   ├── Notifications/          # Notificaciones (email + base de datos)
│   │   └── Filament/                # Recursos y widgets del panel de admin
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/api.php
└── frontend/   # SPA en React consumida por navegadores (cellers, restaurants, inversors)
    └── src/
        ├── pages/         # Vistas por rol (Seller, Restaurant, Inversor, landing pública)
        ├── components/    # Componentes reutilizables
        ├── hooks/         # Hooks compartidos (comisiones, etc.)
        └── locales/       # Ficheros de traducción
```

Cada carpeta (`backend/`, `frontend/`) tiene su propio gestor de dependencias y su
propio `.env`; se ejecutan y despliegan de forma independiente.

## Puesta en marcha

Requisitos: PHP 8.2+, Composer, Node.js 18+, y una base de datos MySQL/MariaDB
(el repo incluye un `docker-compose.yml` dentro de `backend/` para levantar una
en local con Docker, si lo prefieres a instalarla a mano).

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# Rellena en .env: conexión a base de datos, y las claves de Stripe/Resend
# si vas a probar pagos o envío de email (ver .env.example para la lista completa)
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Ajusta VITE_API_URL / VITE_URL_BASE si el backend no corre en localhost:8000
npm run dev
```

Ninguna clave ni credencial va incluida en el repositorio: todos los ficheros
`.env.example` documentan qué variables hacen falta, con valores de ejemplo vacíos.

## Roles y panel de administración

Un mismo usuario puede tener varios roles a la vez (celler, restaurant, inversor) y
cambiar entre ellos desde la aplicación. Cada rol tiene su propio dashboard:

- **Celler**: alta y gestión de productos, seguimiento de solicitudes recibidas.
- **Restaurant**: catálogo, negociación de precio, carrito y checkout.
- **Inversor**: histórico de inversiones y rendimiento por producto.

El backend incluye además un panel de administración interno (Filament) desde el
que el equipo gestiona catálogo, usuarios, comandas y la configuración de
comisiones de la plataforma. El acceso está restringido a cuentas de
administración concretas; no es una funcionalidad accesible desde el registro
público.

## Internacionalización

La interfaz está disponible en català, castellà i anglès. Las traducciones viven en
`frontend/src/locales/{ca,es,en}/translation.json`.

## Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/). El
proyecto no sigue todavía versionado semántico estricto (es un proyecto en
desarrollo activo sin releases publicadas), así que los cambios se agrupan por
periodo.

### Sin publicar

#### Añadido

- Panel de administración (Filament) ampliado con gestión completa de usuarios,
  roles, productos, restaurantes, cellers, inversores, comandas, pagos y
  comisiones, con estadísticas y gráficos en el tauler principal.
- Sistema de comisiones configurable desde el panel de administración, con un
  porcentaje independiente para celler, restaurant e inversor.
- Avisos en los formularios de alta de producto y de solicitud de restaurant que
  informan de la comisión aplicable antes de confirmar la acción.
- Recuperación de cuenta (contacto directo con administración) y cambio de
  contraseña real desde el perfil de usuario.
- Preferencia de notificaciones por email, configurable por el usuario.

#### Cambiado

- Los gastos de envío pasan a ser gratuitos en todas las comandas.
- El selector de idioma de la pantalla de ajustes ahora comparte el mismo
  mecanismo que el resto de la aplicación.
- El listado de solicitudes de un producto muestra el nombre real del
  restaurante que la ha hecho.

#### Corregido

- Cálculo de comisión de plataforma que no se aplicaba correctamente en el
  checkout.
- Pantallas que mostraban datos de ejemplo cuando fallaba la conexión con la
  API, en vez de un estado vacío real.
- Diversos problemas de adaptación a pantallas pequeñas (móvil y tablet) en el
  catálogo, el carrito y los paneles de cada rol.
- Comprobación de permisos incorrecta que impedía a un restaurant marcar un
  producto como vendido.

#### Seguridad

- Revisión de controles de acceso y de visibilidad de datos sensibles en
  varias pantallas y endpoints de la API.

### Versiones anteriores

El proyecto arrancó a inicios de 2025 y ha ido creciendo de forma incremental y
colaborativa desde entonces, sin releases con versión formal. A grandes rasgos:

- **Primera etapa**: modelos de datos base, registro y login por rol, catálogo
  público de productos, carrito, favoritos, y dashboards iniciales para celler,
  restaurant e inversor.
- **Segunda etapa**: negociación de precio entre restaurant y celler, checkout
  con Stripe, seguimiento logístico del pedido, cifrado de datos personales
  sensibles, ampliación de la ficha de restaurant, y traducciones a los tres
  idiomas soportados.

Para el detalle completo, consulta el historial de commits del repositorio.
