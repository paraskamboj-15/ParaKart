<!-- # MiniShop

An elegant, tightly curated e-commerce storefront. Built to be fast, accessible, and visually striking, MiniShop offers a premium browsing experience for tech, beauty, and homeware products.

## 🚀 Tech Stack

*   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) (Persisted)
*   **Animations:** [Framer Motion](https://www.framer.com/motion/)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Mock Backend:** [DummyJSON API](https://dummyjson.com/)

## ✨ Features

*   **Responsive Design:** Fully responsive layout with mobile-first sliding drawers and filters.
*   **Client-side Cart:** Persistent shopping cart managed globally via Zustand.
*   **Editorial UI:** Custom typography, layout animations, and subtle grain filters for a premium aesthetic.
*   **Server-Side Rendering:** SEO-optimized product pages and category fetching.
*   **Smart Search & Filtering:** Debounced search inputs and category navigation with URL state syncing.

## 📦 Getting Started

### Prerequisites
*   Node.js 18.x or higher
*   npm, yarn, pnpm, or bun

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/minishop.git](https://github.com/your-username/minishop.git)
    cd minishop
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root directory. Add any necessary variables (e.g., API overrides).
    ```env
    # Example
    NEXT_PUBLIC_API_URL=[https://dummyjson.com](https://dummyjson.com)
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open the app:**
    Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```text
src/
├── app/                  # Next.js App Router pages and layouts
├── components/           # Reusable UI components (Hero, Filters, Cart, etc.)
├── lib/                  # Utilities, API fetchers, and TypeScript types
├── store/                # Zustand global state (Cart management)
└── config/               # (Recommended) Business logic and magic numbers -->


# MiniShop

An elegant, tightly curated e-commerce storefront. Built to be fast, accessible, and visually striking, MiniShop offers a premium browsing experience for tech, beauty, and homeware products.

**🌍 Live Demo:** [minishop.vercel.app](https://minishop.vercel.app)

---

## 🚀 Tech Stack

*   **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) (Persisted)
*   **Animations:** [Framer Motion](https://www.framer.com/motion/)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Mock Backend:** [DummyJSON API](https://dummyjson.com/)
*   **Hosting:** [Vercel](https://vercel.com/)

## ✨ Features

*   **Responsive Design:** Fully responsive layout with mobile-first sliding drawers and filters.
*   **Client-side Cart:** Persistent shopping cart managed globally via Zustand (securely namespaced locally as `mini-shop`).
*   **Editorial UI:** Custom typography, layout animations, and subtle grain filters for a premium aesthetic.
*   **Server-Side Rendering:** SEO-optimized product pages and category fetching.
*   **Smart Search & Filtering:** Debounced search inputs and category navigation with URL state syncing.

## 📦 Getting Started

### Prerequisites
*   Node.js 18.x or higher
*   npm, yarn, pnpm, or bun

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/minishop.git](https://github.com/your-username/minishop.git)
    cd minishop
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root directory. Add any necessary variables (e.g., API overrides).
    ```env
    # Example
    NEXT_PUBLIC_API_URL=[https://dummyjson.com](https://dummyjson.com)
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open the app:**
    Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```text
src/
├── app/                  # Next.js App Router pages and layouts
├── components/           # Reusable UI components (Hero, Filters, Cart, etc.)
├── lib/                  # Utilities, API fetchers, and TypeScript types
└── store/                # Zustand global state (Cart management)