# MathCode Web

> **The web platform for MathCode** — an online learning hub for Singapore Maths and Kids Coding, built with React and powered by Firebase & Vercel.

---

## 🚀 Overview

MathCode Web is a full-featured educational platform that connects students with tutoring services for **Singapore Maths** and **Kids Coding**. It includes a public-facing marketing site, user authentication, a student dashboard, session management, billing, and more.

### Key Features

- 🏠 **Landing Page** — Hero section, services overview, testimonials, and CTAs
- 📐 **Singapore Maths** — Dedicated page with curriculum details and bar model demos
- 💻 **Kids Coding** — Program information and enrollment
- 💰 **Pricing & Plans** — Transparent pricing tiers with package selection
- 📅 **Session Management** — Book, view, and manage tutoring sessions
- 👤 **User Dashboard** — Profile settings, billing management, and progress tracking
- 🔐 **Authentication** — Email/password login, Google OAuth, OTP verification, and password reset
- 📩 **Contact & Inquiries** — Contact forms and free assessment booking
- 📊 **Student Progress** — Track learning milestones and session history

---

## 🛠️ Tech Stack

| Category       | Technology                                                        |
| -------------- | ----------------------------------------------------------------- |
| **Framework**  | [React 19](https://react.dev) with [Vite 7](https://vite.dev)    |
| **Styling**    | [Tailwind CSS 4](https://tailwindcss.com) + Bootstrap 5           |
| **Routing**    | React Router DOM v6                                               |
| **Auth**       | Firebase Auth · Google OAuth (`@react-oauth/google`)              |
| **State**      | React Context API (User, Package, Student, Sessions, Plan, Billing) |
| **HTTP**       | Axios · Fetch API                                                 |
| **Charts**     | Recharts                                                          |
| **Icons**      | React Icons                                                       |
| **Backend**    | REST API (hosted on Vercel)                                       |
| **Hosting**    | Firebase Hosting · Vercel                                         |

---

## 📁 Project Structure

```
MathCode-Web/
├── public/                    # Static assets & favicons
├── src/
│   ├── assets/                # Images, videos, and logo files
│   ├── components/            # Reusable UI components
│   │   ├── AppNavBar/         # Main navigation bar
│   │   ├── AppDashboardSidebar/ # Dashboard sidebar navigation
│   │   ├── AuthModal/         # Login / Register modal
│   │   ├── Footer/            # Site footer
│   │   ├── PricingDialog/     # Pricing selection dialog
│   │   ├── BookingDialog/     # Session booking dialog
│   │   ├── ChildProfile/      # Child profile management
│   │   ├── StudentProgress/   # Progress tracking widgets
│   │   ├── LoadingSpinner/    # Loading indicator
│   │   └── ...                # 23 component modules total
│   ├── context/               # React Context providers
│   │   ├── UserProvider.jsx   # Authentication & user state
│   │   ├── PackageProvider.jsx # Subscription packages
│   │   ├── StudentProvider.jsx # Student profiles
│   │   ├── SessionsProvider.jsx # Session management
│   │   ├── PlanProvider.jsx   # Plan/tier state
│   │   └── BillingProvider.jsx # Billing & payments
│   ├── controllers/           # Business logic & API calls
│   │   ├── AuthController.jsx
│   │   ├── PackageController.jsx
│   │   ├── SessionsController.jsx
│   │   ├── BillingController.jsx
│   │   └── ...
│   ├── screens/               # Page-level components
│   │   ├── Home/              # Landing page (Hero, Services, etc.)
│   │   ├── About/             # About page
│   │   ├── Pricing/           # Pricing page
│   │   ├── SingaporeMaths/    # Singapore Maths info page
│   │   ├── KidsCoding/        # Kids Coding info page
│   │   ├── Dashboard/         # User dashboard
│   │   ├── Sessions/          # Session management
│   │   ├── ProfileSettings/   # Profile settings
│   │   ├── ManageBilling/     # Billing management
│   │   ├── Auth/              # Login, Register, OTP, Reset
│   │   ├── Contact/           # Contact page
│   │   ├── BookDemo/          # Free demo booking
│   │   ├── Privacy/           # Privacy policy
│   │   ├── Terms/             # Terms of service
│   │   ├── HelpCenter/        # Help & FAQ
│   │   └── NotFound/          # 404 page
│   ├── utils/                 # Utility helpers (colors, payment utils)
│   ├── models/                # Data models
│   ├── firebase.jsx           # Firebase configuration
│   ├── App.jsx                # Root app with routing & layout
│   ├── App.css                # Global styles
│   └── main.jsx               # Application entry point
├── index.html                 # HTML entry point
├── vite.config.js             # Vite configuration
├── firebase.json              # Firebase Hosting config
├── vercel.json                # Vercel deployment config
├── package.json               # Dependencies & scripts
└── .env                       # Environment variables (not committed)
```

---

## ⚡ Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# Clone the repository
git clone https://github.com/JericoDj/MathCode-Web.git
cd MathCode-Web

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
VITE_API_URL=<your-backend-api-url>
VITE_FIREBASE_API_KEY=<your-firebase-api-key>
VITE_FIREBASE_AUTH_DOMAIN=<your-firebase-auth-domain>
VITE_FIREBASE_PROJECT_ID=<your-firebase-project-id>
VITE_FIREBASE_STORAGE_BUCKET=<your-firebase-storage-bucket>
VITE_FIREBASE_MESSAGING_SENDER_ID=<your-sender-id>
VITE_FIREBASE_APP_ID=<your-firebase-app-id>
```

### Development

```bash
# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview the production build locally
npm run preview
```

---

## 🌐 Deployment

### Firebase Hosting

```bash
# Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

### Vercel

The project includes a `vercel.json` configuration with API route proxying to the backend. Push to your connected Git repository and Vercel will auto-deploy.

---

## 🗺️ Routes

### Public Pages

| Path                  | Page                 |
| --------------------- | -------------------- |
| `/`                   | Home / Landing       |
| `/about`              | About                |
| `/pricing`            | Pricing              |
| `/singapore-maths`    | Singapore Maths      |
| `/kids-coding`        | Kids Coding          |
| `/contact`            | Contact              |
| `/book-demo`          | Book Free Assessment |
| `/privacy`            | Privacy Policy       |
| `/terms`              | Terms of Service     |

### Auth Pages

| Path                    | Page                 |
| ----------------------- | -------------------- |
| `/verify-otp`           | OTP Verification     |
| `/reset-password`       | Forgot Password      |
| `/reset-password/confirm` | Reset Password     |
| `/logout`               | Logout               |

### Dashboard (Authenticated)

| Path                | Page               |
| ------------------- | ------------------ |
| `/dashboard`        | Dashboard Home     |
| `/profile-settings` | Profile Settings   |
| `/sessions`         | Session Management |
| `/packages`         | Package Management |
| `/manage-billing`   | Billing Management |
| `/help-center`      | Help Center        |

---

## 📜 Available Scripts

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start Vite development server        |
| `npm run build`     | Build for production                 |
| `npm run preview`   | Preview production build locally     |
| `npm run lint`      | Run ESLint                           |

---

## 📄 License

This project is private and proprietary.