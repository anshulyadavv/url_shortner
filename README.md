# 🔗 Apple-Style URL Shortener

A modern **URL shortening platform** with a clean **Apple-inspired interface**, built for simplicity, elegance, and usability.

This application allows users to generate **temporary short URLs instantly** or create an account to manage **permanent links with analytics and expiration controls**.

The UI follows a **minimal Apple ecosystem design philosophy** similar to **macOS settings, iCloud dashboards, and Notion-style layouts**.

---

# ✨ Features

### 🔹 Temporary Link Generation

Guest users can instantly create short URLs that automatically expire after **24 hours**.

### 🔹 User Authentication

Users can sign up or log in to access advanced features.

### 🔹 Custom Expiry Controls

Authenticated users can create links with configurable expiration:

* 24 hours
* 7 days
* 30 days
* Custom date
* Permanent

### 🔹 Link Management Dashboard

Users can manage all generated links in a **clean dashboard interface**.

Actions available per link:

* Copy link
* Open link
* Edit expiry
* Delete link

### 🔹 Analytics Dashboard

Provides insights into link performance including:

* Total clicks
* Active links
* Expired links
* Click activity over time
* Device distribution
* Country distribution

### 🔹 QR Code Generation

Each shortened link can generate a **QR code for easy sharing**.

### 🔹 Apple-Inspired UI

The interface is designed with:

* minimal layouts
* soft rounded cards
* elegant spacing
* subtle shadows
* smooth interactions

---

# 🖥 UI Screens

The application currently includes the following screens:

### Landing Page

Guest users can quickly generate a temporary short link.

Features shown:

* URL input field
* Generate short link button
* Product highlights
* Navigation for login and signup

---

### Login Page

Simple authentication screen including:

* Email input
* Password input
* Google login option
* Forgot password link

---

### Signup Page

Account creation screen with:

* Email
* Password
* Confirm password

---

### Main Dashboard

Primary workspace for authenticated users.

Includes:

* Sidebar navigation
* Create new short link panel
* Expiry controls
* Links management table

---

### Links Table

Displays all created links with details:

* Short URL
* Original URL
* Click count
* Expiry date
* Creation date

Each row includes quick actions for managing links.

---

### Analytics Page

Displays insights using visual charts:

* Total clicks
* Active links
* Expired links
* Click activity graph
* Device usage distribution
* Country distribution

---

### Temporary Link Result (Guest Mode)

When a guest user creates a link, they receive:

* Generated short URL
* Copy button
* QR code preview
* Notification that the link expires in **24 hours**

Users are encouraged to create an account to save links permanently.

---

# 🧱 Project Structure

```
url-shortener/

frontend/
│
├── src
│   ├── components
│   ├── pages
│   ├── services
│   ├── context
│   └── styles
│
├── public
└── package.json

README.md
LICENSE
```

---

# 🛠 Tech Stack

Frontend

* React
* TailwindCSS
* React Router
* Axios

Backend *(planned)*

* Node.js
* Express
* PostgreSQL / MongoDB
* Redis (for caching)

---

# 🚀 Getting Started

### Clone the repository

```
git clone https://github.com/yourusername/url-shortener.git
```

### Navigate into the project

```
cd url-shortener/frontend
```

### Install dependencies

```
npm install
```

### Start development server

```
npm run dev
```

The application will run at:

```
http://localhost:5173
```

---

# 📊 Planned Features

Upcoming improvements include:

* Custom domain support
* Rate limiting
* Link password protection
* Advanced analytics
* API access
* Team workspaces

---

# 🎯 Purpose of the Project

This project demonstrates:

* modern frontend architecture
* dashboard UI design
* SaaS-style product development
* scalable URL shortening system design

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👤 Author

Built with ❤ by **Anshul Yadav**
