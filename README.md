# 📦 Mini API Boxful

API REST construida con **NestJS** que simula las funcionalidades de Boxful: autenticación de usuarios, registro, creación de órdenes de envío y consulta de historial por rango de fechas.

---

## 🚀 Funcionalidades

- 🔓 **Inicio de sesión** — Autenticación con correo y contraseña
- 📝 **Registro de usuarios** — Nombre, apellido, sexo, fecha de nacimiento, correo, teléfono y contraseña
- 📦 **Creación de órdenes** — Dirección de recolección, datos del destinatario y array de paquetes con dimensiones y contenido
- 📋 **Historial de órdenes** — Consulta filtrada por rango de fechas con resumen de cada orden

---

## 📄 Documentación de la API

La documentación completa de todos los endpoints está disponible en Postman:

🔗 [Ver documentación en Postman](https://documenter.getpostman.com/view/46628987/2sBXwmRtQN)

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|---|---|
| **NestJS** | Framework principal (Node.js) |
| **TypeScript** | Lenguaje tipado |
| **Prisma ORM** | Acceso y modelado de base de datos |
| **MongoDB** | Base de datos NoSQL |
| **JWT (Passport.js)** | Autenticación stateless |
| **bcrypt** | Hash de contraseñas |
| **dotenv** | Variables de entorno |

---

## 📁 Estructura del Proyecto

```
backend-boxful/
├── prisma/
│   └── schema.prisma                  # Modelos de base de datos
├── src/
│   ├── auth/
│   │   ├── decorators/
│   │   │   └── get-user.decorator.ts  # Decorador para obtener usuario autenticado
│   │   ├── dto/
│   │   │   ├── login.dto.ts           # DTO de inicio de sesión
│   │   │   └── register.dto.ts        # DTO de registro
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts      # Guard de autenticación JWT
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   └── jwt.strategy.ts            # Estrategia JWT con Passport
│   ├── orders/
│   │   ├── dto/
│   │   │   ├── create-order.dto.ts    # DTO de creación de orden
│   │   │   ├── create-package.dto.ts  # DTO de paquetes
│   │   │   └── order-history-query.dto.ts  # DTO de filtro por fechas
│   │   ├── orders.controller.ts
│   │   ├── orders.module.ts
│   │   └── orders.service.ts
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts          # Servicio de conexión a la BD
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts                        # Punto de entrada de la aplicación
├── .env.example
├── package.json
└── README.md
```

---

## ⚙️ Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/Roberto640Alvarado/backend-boxful.git
cd backend-boxful
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita el `.env` con tus valores:

```env
DATABASE_URL="mongodb+srv://<usuario>:<contraseña>@cluster.mongodb.net/boxful_db"
JWT_SECRET=tu_clave_secreta
PORT=3000
```

### 4. Sincronizar Prisma con la base de datos

```bash
npx prisma generate
```

### 5. Ejecutar el proyecto

**Modo desarrollo:**

```bash
npm run start:dev
```

**Modo producción:**

```bash
npm run build
npm run start:prod
```

La API estará disponible en: `http://localhost:3000`

---

## 🔐 Endpoints principales

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| `POST` | `/auth/login` | Público | Inicio de sesión |
| `POST` | `/auth/register` | Público | Registro de usuario |
| `POST` | `/orders` | Privado 🔒 | Crear una orden |
| `GET` | `/orders/history` | Privado 🔒 | Historial por rango de fechas |

> Los endpoints privados requieren el header: `Authorization: Bearer <token>`
