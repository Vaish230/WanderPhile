# 🌍 Wanderphile – Travel Listing Platform

Wanderphile is a full‑stack web application where users can browse, create, edit, and delete travel destination listings. It includes user authentication, image uploads via Cloudinary, reviews & ratings, category filtering, and a search feature.

## 🚀 Live Demo

*https://wanderphile.onrender.com*

## ✨ Features

- **User authentication** – Sign up, log in, log out (Passport.js with local strategy)
- **Listing management** – Create, read, update, delete travel listings
- **Image upload** – Upload listing images using Cloudinary + Multer
- **Reviews & ratings** – Add / delete reviews (1–5 stars) on listings
- **Category browsing** – Filter listings by categories like Beach, Mountains, Castle, etc.
- **Search** – Search listings by title, category, country, or location
- **Authorization** – Only the owner of a listing or review can edit/delete it
- **Flash messages** – Success/error notifications
- **Responsive UI** – Bootstrap 5 + custom CSS (star rating, cards, footer)

## 🛠️ Tech Stack

| Layer           | Technology                                           |
|----------------|------------------------------------------------------|
| Backend        | Node.js, Express.js                                  |
| Database       | MongoDB (Mongoose ODM)                               |
| Templating     | EJS + ejs-mate (layouts)                             |
| Authentication | Passport.js, passport-local, express-session, connect-mongo |
| File upload    | Multer, Cloudinary                                   |
| Validation     | Joi                                                  |
| CSS            | Bootstrap 5, custom CSS (starability rating)         |
| JavaScript     | Vanilla JS (Bootstrap form validation)               |

## ⚙️ Installation & Setup

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Steps
1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/wanderphile.git
   cd wanderphile
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
4. **Seed and Start **
   ```bash
   cd init
   node index.js
   npm start
   # or
   npm run dev
   # or
   npx nodemon index.js
   ```
5. **View on port**
   ```bash
   http://localhost:8080
   ```
# 🗺️ API Routes

## Listings
| Method | Route | Description | Auth |
|---------|------------------|-------------------|-------|
| GET     | /listings        | Get all listings  | No    |
| GET     | /listings/add    | Add listing form  | Yes   |
| POST    | /listings        | Create listing    | Yes   |
| GET     | /listings/:id    | View listing      | No    |
| GET     | /listings/:id/edit | Edit listing    | Yes (owner) |
| PATCH   | /listings/:id    | Update listing    | Yes (owner) |
| DELETE  | /listings/:id    | Delete listing    | Yes (owner) |

## Reviews
| Method  | Route                                | Description   | Auth             |
|---------|--------------------------------------|---------------|------------------|
| POST    | /listings/:id/reviews               | Add review    | Yes              |
| DELETE  | /listings/:id/reviews/:reviewId     | Delete review  | Yes (owner)      |

## Authentication
- `/register` → Register user
- `/login` → Login user
- `/logout` → Logout user

## 🧪 Testing & Security
- Joi validation (backend input validation)
- Middleware protection:
  - `isLoggedIn`
  - `isOwner`
  - `isReviewOwner`
- Custom error handling (`wrapAsync` + `ExpressError`)
- Flash messages for UX feedback



   
   
