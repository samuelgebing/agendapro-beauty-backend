# AgendaPro Beauty - Backend API

<p align="center">
  <img src="https://shields.io" alt="Project Name" />
  <img src="https://shields.io" alt="Course" />
  <img src="https://shields.io" alt="Status" />
</p>

> **⚠️ WORK IN PROGRESS / PROJECT IN DEVELOPMENT**  
> This project is currently under active development as part of a 3-month academic cycle. Features are being built and delivered incrementally following a sprint schedule.

---

## 📝 Description
This project was developed as an Integrative Project for the Technological Residency Program in Software Development (Bolsa Futuro Digital) at IFRS Campus Bento Gonçalves during 2026. 

The system solves the scheduling issues of traditional salons that still manage appointments manually through WhatsApp or paper notes. It avoids schedule conflicts, optimizes professional agendas, and provides a solid data foundation for future frontend application integration.

## 📅 Development Roadmap & Status
The project follows the Scrum methodology with 15-day sprints over a 3-month period:
*   [x] **Sprint 1:** Environment setup, base API structure, and relational database modeling.
*   [ ] **Sprint 2:** CRUD operations for professionals and services with area filters.
*   [ ] **Sprint 3:** Shift schedule rules and dynamic free slot generation logic.
*   [ ] **Sprint 4:** Appointment creation, double-booking prevention, and cancellation rules.
*   [ ] **Sprint 5:** User registration, password hashing (bcrypt), and JWT authentication.
*   [ ] **Sprint 6:** Management dashboard reports and final API documentation.

## 🚀 Key Features (Target Scope)
*   **Authentication:** Secure user registration and login with JWT and bcrypt password hashing.
*   **Role-Based Access Control:** Separation between client permissions and admin actions.
*   **Resource Management:** Full CRUD operations for professionals, salon areas, and services.
*   **Smart Scheduling Engine:** Dynamic time-slot calculation based on service duration.
*   **Conflict Prevention:** Rules that strictly prevent double-booking for the same professional.
*   **Manual Blocks:** Ability to manually lock specific time slots or holiday periods.
*   **Rescheduling Logic:** Cancellation limits based on minimum required notice.
*   **Admin Reports:** Data endpoints tracking total appointments and top-performing services.

## 🛠️ Tech Stack
*   **Runtime Environment:** Node.js
*   **Language:** JavaScript (ES6+)
*   **Framework:** Express.js
*   **Database:** MySQL
*   **Security:** JWT (JSON Web Tokens) & Bcrypt

<p align="left">
  <a href="https://shields.io"><img src="https://shields.io" alt="NodeJS" /></a>
  <a href="https://shields.io"><img src="https://shields.io" alt="JavaScript" /></a>
  <a href="https://shields.io"><img src="https://shields.io" alt="ExpressJS" /></a>
  <a href="https://shields.io"><img src="https://shields.io" alt="Database" /></a>
  <a href="https://shields.io"><img src="https://shields.io" alt="Security" /></a>
</p>

## 💾 Database Architecture
The backend maps and implements a relational database structure with the following main entities:
*   `USUARIOS` (Clients and Administrators)
*   `PROFISSIONAIS` (Staff profiles and specialties)
*   `SERVICOS` (Catalog item with duration and pricing attributes)
*   `AREAS` (Salon departments like hair, manicure, or body aesthetics)
*   `HORARIOS_TRABALHO` & `HORARIOS_BLOQUEADOS` (Shift schedules and exceptions)
*   `AGENDAMENTOS` (Stored appointment intervals with pre-calculated completion times)

## 🏁 Getting Started

### Prerequisites
*   Node.js (v18 or higher recommended)
*   A running instance of PostgreSQL or MySQL

### Installation
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/samuelgebing/agendapro-beauty-backend.git
    ```
2.  **Navigate to the project root:**
    ```bash
    cd agendapro-beauty-backend
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Environment Setup:**
    Create a `.env` file in the root folder and configure your variables:
    ```env
    PORT=3000
    DB_HOST=localhost
    DB_USER=your_user
    DB_PASS=your_password
    DB_NAME=agendapro_beauty
    JWT_SECRET=your_jwt_secret_key
    ```
5.  **Run the application:**
    ```bash
    npm start
    ```

## ⚙️ Testing the API
You can test the currently available endpoints using the **REST Client** extension. 
*   The default local server runs on: `http://localhost:3000`

> 💡 **Note:** All README images are currently under review.

---
Made by **Samuel Gebing**
