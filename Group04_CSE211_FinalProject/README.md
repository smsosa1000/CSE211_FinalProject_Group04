# CSE211 Web Development Final Project - EventsX

**EventsX** is a modern event management platform designed for seamless discovery, registration, and budget planning for events. The platform offers a dynamic user experience with responsive design, multi-currency support, and an intuitive interface.

## 🌟 Features

- **Sliding Authentication Form**: Smooth transition between Login and Registration
- **Multi-step Registration Process**: Guided form completion for better user experience
- **Dynamic Events Catalog**: Mock-ready system for backend integration
- **Multi-currency Budget Calculator**: Now supporting USD, EUR, KWD, SAR, and more
- **Fully Responsive Design**: Optimized for all device sizes
- **HTML5 Form Validation**: Client-side validation for better data quality
- **Cross-browser Compatibility**: Tested across modern browsers
- **Semantic HTML Structure**: Improved accessibility and SEO
- **Modular JavaScript**: Clean, maintainable code architecture

## 👥 Team 04 Members

### **Samaa Mohamed** (223101629) - Team Leader

**GitHub:** [smsosa1000](https://github.com/smsosa1000)

#### Samaa's Tasks

- **4.3.5.1.** HTML5 Validation Implementation
- **4.3.1.** HTML Specifications
  - `index.html` Page (Homepage)
  - `budget-calculator.html` Page
- **4.3.2.** CSS Specifications (Help if Needed)
- **4.3.3.** JavaScript Specifications (Main)
- **4.3.4.** Universal Page Requirements B) Consistent Navigation Structure
- **4.2.** Web Project Logical Folder Structure
- **6.** Written Report Appendix B: Team Contribution Breakdown and the rest of the report
- **Quality Check:** Every member will make a quality check

---

### **Saga Taha** (223104728)

**GitHub:** [Saga-Taha](https://github.com/Saga-Taha)

#### Saga's Tasks

- **4.3.5.2.** Browser Compatibility Testing
- **4.3.1.** HTML Specifications
  - `events.html` Page
  - `thank-you.html` Page
- **4.3.2.** CSS Specifications (Help if Needed)
- **4.3.3.** JavaScript Specifications (Main)
- **4.3.4.** Universal Page Requirements C) Code Quality Standards
- **6.** Written Report Appendix C: Additional Visualisations
- **Quality Check:** Every member will make a quality check

---

### **Omar Khalifa** (223101614) - Designer & Developer

**GitHub:** [Omar-223101614](https://github.com/Omar-223101614)

#### Omar's Tasks

- **4.3.1.** HTML Specifications
  - `contact.html` Page
  - `about.html` Page
  - Multimedia Resources Management
- **4.3.2.** CSS Specifications (Main Design)
- **4.3.3.** JavaScript Specifications (Help if Needed)
- **4.1.** 3-Website Map Design
- **6.** Written Report (Content & Structure)
- **Quality Check:** Every member will make a quality check

---

### **Mohamed Samir** (223104766) - Backend Specialist

**GitHub:** [Mohamed-Samir-11](https://github.com/Mohamed-Samir-11)

#### Mohamed's Tasks

- **4.3.6.** Backend Implementation (Bonus Strategy)
- **4.3.1.** HTML Specifications
  - `registration.html` Page
- **4.3.3.** JavaScript Specifications (Help if Needed)
- **4.3.4.** Universal Page Requirements A) HTML5 Semantic Structure
- **6.** Written Report Appendix A: AI Assistance Acknowledgement
- **Quality Check:** Every member will make a quality check

## 📁 Project Structure

EventsX/

│

├── pages/ # Application subpages

│ ├── index.html # Homepage (Samaa)

│ ├── events.html # Events catalog (Saga)

│ ├── registration.html # Registration page (Mohamed)

│ ├── contact.html # Contact page (Omar)

│ ├── about.html # About page (Omar)

│ ├── budget-calculator.html # Budget calculator (Samaa)

│ └── thank-you.html # Confirmation page (Saga)

│
├── css/ # Stylesheets

│ └── main.css # Main styles (Omar)

│
├── scripts/ # Modular JavaScript logic

│ ├── auth.js # Authentication logic (Saga)

│ ├── budget-calculator.js # Multi-currency calculator (Samaa)

│ ├── registration.js # Multi-step registration (Saga)

│ ├── events.js # Events catalog logic (Saga)

│ └── validation.js # HTML5 validation (Samaa)

│
├── images/ # Multimedia assets

│ ├── icons/ # Icons and small graphics

│ ├── logos/ # Logo variations

│ └── events/ # Event-related images

│
├── backend-guide.txt # Guide for moving to PHP/MySQL

└── README.md # This documentation file

## Backend (PHP + MySQL)

EventsX includes a small JSON API built with PHP and MySQL (PDO). The front-end uses `fetch()` with credentials: `"include"` and PHP sessions to keep users logged in.

### Tech

- **PHP** (session-based auth)
- **MySQL** (via PDO)
- **JSON** responses for all API endpoints

---

## API Endpoints

### GET /api/events.php
Returns the events list from the events table: 
'''json
{ "ok": true, "events": [...] }
'''

### POST /api/auth/register.php

Creates a new user (validates required fields + minimum password length) and stores a hashed password (`password_hash`). Also starts a logged-in session.

### POST /api/auth/login.php

Logs in using either email or username + password, then stores a safe user object in `$_SESSION["user"]`.

### GET /api/auth/me.php

Returns the currently logged-in session user (or `{ "ok": false, "user": null }`).

### POST /api/auth/logout.php

Intended to clear the session (note: this file currently references a missing `db.php`, so it may need a small fix to work as-is).

### POST /api/registrations/register.php

Requires login. Registers the current user for an event (prevents duplicate registrations per user + event).

### GET /api/registrations/list.php

Requires login. Returns up to 20 most recent registrations for the current user.

---

## Database Tables

* **users**: `id`, `username`, `name`, `email`, `phone`, `role`, `password_hash`
* **events**: `id`, `name`, `category`, `date`, `location`, `cost`, `image`
* **registrations**: `id`, `user_id`, `event_key`, `event_name`, `created_at`
