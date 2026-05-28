# 📦 Mini API Boxful

API REST construida con **NestJS** que simula las funcionalidades de Boxful: autenticación de usuarios, registro, creación de órdenes de envío, consulta de historial por rango de fechas y módulo de liquidación COD.

---

## 🚀 Funcionalidades

- 🔓 **Inicio de sesión** — Autenticación con correo y contraseña
- 📝 **Registro de usuarios** — Nombre, apellido, sexo, fecha de nacimiento, correo, teléfono y contraseña
- 📦 **Creación de órdenes** — Dirección de recolección, datos del destinatario y array de paquetes con dimensiones y contenido
- 📋 **Historial de órdenes** — Consulta filtrada por rango de fechas con resumen de cada orden
- 💵 **COD (Cash on Delivery)** — Soporte para órdenes con cobro contra entrega y cálculo automático de liquidación
- 💰 **Balance de liquidación** — Consulta del monto acumulado a liquidar por comercio
- 🔔 **Webhook** — Endpoint público para recibir confirmaciones de entrega y calcular el monto final

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

---

## 📁 Estructura del Proyecto

```
backend-boxful/
├── prisma/
│   ├── schema.prisma                  # Modelos de base de datos
│   └── seed.ts                        # Seeder de costos de envío por día
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
│   │   │   ├── create-order.dto.ts    # DTO de creación de orden (incluye campos COD)
│   │   │   ├── create-package.dto.ts  # DTO de paquetes
│   │   │   └── order-history-query.dto.ts  # DTO de filtro por fechas
│   │   ├── orders.controller.ts
│   │   ├── orders.module.ts
│   │   └── orders.service.ts
│   ├── webhooks/                      # Módulo de webhooks (punto extra)
│   │   ├── dto/
│   │   │   └── webhook-order.dto.ts   # DTO del webhook
│   │   ├── webhooks.controller.ts
│   │   ├── webhooks.module.ts
│   │   └── webhooks.service.ts        # Lógica de liquidación COD
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
PORT=4000
```

### 4. Sincronizar Prisma con la base de datos

```bash
npx prisma generate
```

### 5. Ejecutar el seeder de costos de envío

Este paso es **obligatorio** para que el sistema pueda asignar el costo de envío al crear una orden. El seeder carga los costos por día de la semana en la base de datos desde el archivo `prisma/seed.ts`.

```bash
npx prisma db seed
```

Los costos que se cargan son los siguientes:

| Día | Costo |
|-----|-------|
| Lunes | $2.50 |
| Martes | $2.50 |
| Miércoles | $3.00 |
| Jueves | $3.00 |
| Viernes | $3.50 |
| Sábado | $4.00 |
| Domingo | $1.50 |

> Si se desea modificar los costos, edita el archivo `prisma/seed.ts` antes de ejecutar el seeder:

```typescript
const shippingCosts = [
  { day: 'monday',    cost: 2.5 },
  { day: 'tuesday',   cost: 2.5 },
  { day: 'wednesday', cost: 3.0 },
  { day: 'thursday',  cost: 3.0 },
  { day: 'friday',    cost: 3.5 },
  { day: 'saturday',  cost: 4.0 },
  { day: 'sunday',    cost: 1.5 },
];
```

### 6. Ejecutar el proyecto

**Modo desarrollo:**

```bash
npm run start:dev
```

La API estará disponible en: `http://localhost:4000`

---

## 🔐 Endpoints principales

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| `POST` | `/api/auth/login` | Público | Inicio de sesión |
| `POST` | `/api/auth/register` | Público | Registro de usuario |
| `POST` | `/api/orders` | Privado 🔒 | Crear una orden |
| `GET` | `/api/orders/history` | Privado 🔒 | Historial por rango de fechas |
| `GET` | `/api/orders/balance` | Privado 🔒 | Balance acumulado de liquidación |
| `POST` | `/api/webhooks/orders/:numeroOrden` | Público | Confirmar entrega y calcular liquidación |

> Los endpoints privados requieren el header: `Authorization: Bearer <token>`

---

## 💵 Punto extra — COD y Liquidación

Se implementó el módulo de **Cash on Delivery (COD)** como punto extra de la prueba técnica.

### ¿Cómo funciona?

1. Al crear una orden se puede indicar si es COD con `isCOD: true` y un `expectedAmount` opcional
2. El sistema asigna automáticamente el costo de envío según el día de la semana
3. Cuando el repartidor entrega el paquete, se llama al webhook con el monto real recolectado
4. El sistema calcula el monto a liquidar al comercio con la siguiente fórmula:
   - **Orden COD:** `Monto Recolectado - Costo de Envío - Comisión (0.01% con tope de $25)`
   - **Orden sin cobro:** `- Costo de Envío`

### 🔔 Ejemplo de uso del Webhook

Este endpoint es **público** y simula la notificación que enviaría el sistema del repartidor al confirmar una entrega. No requiere token JWT.

```
POST http://localhost:4000/api/webhooks/orders/1000001
```

**Body:**
```json
{
  "collectedAmount": 25.00
}
```

> `collectedAmount` es opcional. Si la orden no es COD se puede enviar el body vacío `{}`.

**Respuesta esperada:**
```json
{
  "mensaje": "Orden actualizada correctamente",
  "orden": {
    "numeroOrden": 1000001,
    "status": "delivered",
    "isCOD": true,
    "collectedAmount": 25,
    "shippingCost": 3,
    "settlementAmount": 21.9975
  }
}
```