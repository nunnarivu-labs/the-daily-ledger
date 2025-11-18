# The Daily Ledger: A High-Performance Analytics Dashboard

<img width="1421" height="768" alt="Screenshot 2025-11-18 at 11 52 57" src="https://github.com/user-attachments/assets/fdc115b5-0ecc-46f4-8093-bdc253bbfca5" />

**Live Demo:** [**thedailyledger.nunnarivulabs.in**](https://thedailyledger.nunnarivulabs.in)

---

## About The Project
The Daily Ledger is a full-stack business intelligence dashboard built for a fictional e-commerce store. It's designed from the ground up to handle massive datasets with high performance, providing a clean, intuitive, and real-time interface for monitoring key business metrics.

This project was architected not just to work with a few hundred rows, but to be truly scalable. The local development environment is populated with over 10 million order records to rigorously test and demonstrate the efficiency of the backend queries and frontend rendering strategies.

### A Note on the Live Demo

The public live demo is hosted on Netlify and connected to a free-tier Supabase Postgres database. To respect these resource limits, it has been seeded with a still-impressive **50,000 orders**. While this demonstrates all features, the true power of the application's architecture is best seen with the full 10 million record dataset.

**I would be happy to provide a live, one-on-one demonstration of the application running against the full 10M+ record database to showcase its performance under heavy load.**

## ✨ Key Features

*   **Dynamic KPI Cards:** At-a-glance metrics for Revenue, Profit, Orders, and New Users, with contextual comparison against previous periods.
*   **Interactive Trend Chart:** A multi-line chart visualising Sales vs. Profit over any selected date range.
*   **High-Performance Data Grid:** An orders table architected to handle millions of records with a fluid, infinitely scrolling user experience.
*   **Advanced Data Fetching:** A "sparse virtualisation" engine that only fetches the data for the portion of the table the user is currently looking at.
*   **Intercepted Modal Routes:** Seamlessly view order details in a modal that has its own dedicated, shareable URL, showcasing a professional UX pattern.
*   **Fully Responsive:** A clean and adaptive UI that works beautifully on all screen sizes, from mobile sheets to desktop modals.

---

### 🚀 Feature Spotlight: High-Performance Sparse Virtualisation
The biggest challenge was building the Orders page to handle the dataset of over 10 million records. A standard list would crash any browser. The solution is a custom-built **sparse virtualisation engine**.

**The Problem:** You can't render 10 million rows. Even a simple infinite scroll fetching 50 rows at a time would eventually overwhelm the browser's memory.

**The Solution:**
Think of the table as a magic book with 10 million pages. The virtualisation engine is smart enough to only ever render the 20-30 pages you're looking at right now.
*   **Efficient Rendering:** It keeps the DOM footprint incredibly small, ensuring a smooth 60fps scrolling experience.
*   **Sparse Data Fetching:** The "sparse" part is the real magic. If you grab the scrollbar and jump to the middle of the list (say, to order #5,000,000), the app is intelligent enough to only fetch the pages for that specific window, without loading all the pages in between.

This is an advanced, production-grade pattern that ensures the application remains blazing fast and responsive at any scale.


https://github.com/user-attachments/assets/a7a573c4-8224-40bd-a4da-0bd534f82346


---

## 🛠️ Technical Architecture & Stack

This project is a modern full-stack application built with a focus on performance, type safety, and a great developer experience.

*   **Frontend:** Next.js (App Router), React, TypeScript
*   **Styling:** Tailwind CSS, shadcn/ui
*   **Data Fetching (Client):** TanStack Query
*   **Data Grid:** TanStack Table & TanStack Virtual
*   **Charting:** Recharts
*   **Database:** PostgreSQL (Cloud: Supabase, Local: Docker)
*   **ORM & Queries:** Drizzle ORM
*   **Deployment:** Netlify

---

## 🏃‍♂️ Running Locally (Full 10M+ Record Demo)

To run the full-scale version of this project on your local machine, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/nunnarivu-labs/the-daily-ledger.git
    cd the-daily-ledger
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your local database URL:
    ```
    DATABASE_URL="postgresql://[your_username]:[your_password]@localhost:5432/daily_ledger"
    ```

4.  **Start the local database:**
    Ensure Docker is installed and running.
    ```bash
    docker-compose up -d
    ```

5.  **Apply the database schema:**
    This will create all the necessary tables in your local Postgres instance.
    ```bash
    npm run db:push
    ```

6.  **Seed the database:**
    This will populate your database with over 10 million records. **Warning: This is a very long-running process (30-60+ minutes).** Modify the constants in `scripts/seed.ts` for a smaller dataset if desired.
    ```bash
    npm run db:seed
    ```

7.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🧠 Challenges & Lessons Learned

Building this project involved solving several interesting and challenging problems:

*   **High-Performance SQL:** Wrote advanced PostgreSQL queries using `json_agg` to shape complex, nested data directly in the database, dramatically simplifying the API layer and improving performance for fetching order details.
*   **Conditional Aggregation:** Implemented efficient conditional aggregation (`SUM(CASE WHEN ...`) to calculate KPI values for both a current and a previous period in a single database query.
* **Virtualisation Layout:** Solved complex CSS layout challenges to build a truly robust virtualised table.
* **Database Indexing:** Identified performance bottlenecks and added indexes to foreign keys and date columns, learning how critical they are for query performance at scale.

---

## License

This project is licensed under the Apache 2.0 License.
