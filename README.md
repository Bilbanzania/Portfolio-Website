# Mitchell Laypath - Full-Stack Portfolio

![Portfolio Preview](media/Kitty_Dreams.webp)

**Live Demo:** [View Portfolio](https://bilbanzania.github.io/Portfolio-Website/)

## 📖 Overview

This repository houses my personal portfolio website, designed as a Single Page Application (SPA) to showcase my skills in Full-Stack Development, Simulation Design, and IT Support. 

Unlike typical portfolio templates, this site was built from the ground up using **Vanilla JavaScript** to demonstrate a mastery of core web fundamentals (DOM manipulation, state management, and asynchronous API handling) without relying on heavy frontend frameworks.

## Key Features

* **Custom SPA Architecture:** Lightweight, hash-based routing system built from scratch to manage views without page reloads.
* **Serverless Backend:** Integrates with **Supabase Edge Functions** to handle secure, spam-resistant email delivery via a "Backend-for-Frontend" pattern.
* **Dynamic Theming:** CSS Variable-based Dark/Light mode that persists user preference via `localStorage`.
* **Performance:** Optimized asset loading with lazy-loading strategies for images and modular JavaScript architecture.
* **Accessibility:** Semantic HTML structure with managed focus states for keyboard navigation.

## Tech Stack

### Frontend
* **Languages:** HTML5, CSS3, JavaScript (ES6+)
* **Styling:** CSS Variables, Flexbox/Grid, Responsive Media Queries
* **State Management:** Vanilla JS Custom Store

### Backend & Services
* **Database/Auth:** Supabase (PostgreSQL)
* **Compute:** Supabase Edge Functions (Deno/TypeScript)
* **Hosting:** GitHub Pages

## 📂 Project Structure

```bash
├── index.html          # Main entry point (SEO optimized structure)
├── style.css           # Global styles, variables, and responsive resets
├── app.js              # Core logic: Routing, Event Listeners, Supabase Client
├── data.js             # "Database" file: JSON-like structure for project data
├── media/              # Optimized assets (WebP images, PDFs)
└── README.md           # Project documentation
