# KnowledgeBase Frontend - React

A modern, responsive, and aesthetically premium frontend for the Knowledge Sharing Platform, built with React and Vite.

## 1. Approach

### Architecture Overview
The frontend is built using **React 18** and follows a component-driven architecture:
- **Pages**: Top-level route components (Dashboard, Home, Login).
- **Components**: Reusable UI elements (ArticleCard, Navbar).
- **Services**: API abstraction layer using Axios for backend communication.
- **State Management**: React Hooks (useState, useEffect) and LocalStorage for persistence.

### Folder Structure
```text
src/
├── assets/        # Static images and icons
├── components/    # Reusable UI building blocks
├── pages/         # View components (Home, ArticleDetail, etc.)
├── services/      # API communication (Axios config)
├── utils/         # Helper functions (JWT decoding)
├── App.jsx        # Routing and main entry
└── index.css      # Core Design System (Glassmorphism & Gradients)
```

### Key Design Decisions
- **Premium Aesthetics**: Implemented a "wow-factor" UI using dark mode, glassmorphism effects, and CSS gradients to create a premium feel.
- **Intercepted Auth**: Used Axios interceptors to automatically attach JWT tokens to every request and redirect to `/login` if a 401 Unauthorized response is received.
- **Fail-Safe UI**: Added robust null-checks in `Home.jsx` and `Dashboard.jsx` to prevent runtime crashes if article content or tags are missing.

## 2. AI Usage (Mandatory Section)

### Tools Used
- **OpenAI**: Used for UI Architecture and frontend-to-backend integration logic.

### How AI Helped
-**Boilerplate Assistance**: Used to generate initial React component shells and basic form structures to accelerate development.
- **CSS Utility**: Provided specific CSS properties for gradients and glassmorphism effects based on manual design requirements.
- **Hook Optimization**: Assisted in verifying dependency arrays for `useEffect` hooks to ensure efficient data fetching.
- **Library Reference**: Provided quick reference for Axios configuration and interceptor setup.

### Manual Corrections
- **Prop Key Handling**: Manually added unique key fallbacks (`article.id || index`) to list renderings after identifying "missing key" warnings in the browser console.
- **Detail Page Logic**: Manually corrected the author-check logic in `ArticleDetail.jsx` to ensure owner-only actions like Edit/Delete are correctly displayed based on the decoded JWT.

## 3. Setup Instructions

### Prerequisites
- **Node.js** (v16.x or later)
- **npm** or **yarn**

### Environment Variables
The frontend expects the backend to be running on `http://localhost:8080`.
Configure any overrides in a `.env` file in the `frontend/` directory (optional).

### Installation
1. Navigate to the directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run in development mode:
   ```bash
   npm run dev
   ```
   *Application will be available at [http://localhost:5173](http://localhost:5173)*

### Build for Production
```bash
npm run build
```
