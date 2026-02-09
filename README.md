<div align="center">
  <br />
  <img src="./public/logo.svg" alt="Vally Logo" width="200" />
  <br />
  <h1 align="center">✨ Vally — A Digital Love Letter 💌</h1>

  <p align="center">
    An immersive, storytelling-driven Valentine's proposal website inspired by high-end branding portfolios.<br/>
    Built with love, for love. 💖
  </p>

  <p align="center">
    <a href="https://nextjs.org">
      <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
    </a>
    <a href="https://tailwindcss.com">
      <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    </a>
    <a href="https://www.framer.com/motion/">
      <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
    </a>
    <a href="https://sanity.io">
      <img src="https://img.shields.io/badge/Sanity-F03E2F?style=for-the-badge&logo=sanity&logoColor=white" alt="Sanity" />
    </a>
  </p>
</div>

<br />

## 🌸 About The Project

**Vally** is more than just a website; it's a cinematic journey through memories and dreams. Designed with the "Chungi Yoo" aesthetic in mind, it features bold editorial typography, smooth animations, and a deeply personal narrative structure.

### ✨ Key Features

*   **🎥 Cinematic Intro:** A breathtaking text reveal animation that sets the mood.
*   **📜 Interactive Storytelling:** Scroll-triggered animations that unfold the love story chapter by chapter.
*   **💫 Smooth Experience:** Powered by `lenis` for buttery smooth scrolling.
*   **🎨 Aesthetic Design:** A carefully curated color palette (Deep Rose & Amber Gold) with grain overlays for that authentic film look.
*   **🎵 Immersive Audio:** Background ambient music and sound effects to enhance the emotional impact.
*   **☁️ CMS Powered:** All content (memories, reasons, milestones) is easily managed via Sanity Studio.

---

## 🚀 Getting Started

To get this running locally on your machine, follow these simple steps!

### Prerequisites

Make sure you have `Node.js` installed. We recommend using **pnpm** for the best experience! 🎀

### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/yourusername/vally.git
    ```

2.  **Install dependencies**
    ```sh
    pnpm install
    ```

3.  **Set up environment variables**
    Create a `.env.local` file in the root directory and add your Sanity config:
    ```env
    NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
    NEXT_PUBLIC_SANITY_DATASET=production
    ```

4.  **Run the development server**
    ```sh
    pnpm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the magic happen! ✨

---

## 📂 Project Structure

```
Vally/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components 🧩
├── sanity/              # Sanity Studio configuration 📝
├── public/              # Static assets (images, fonts, audio) 🖼️
└── lib/                 # Utility functions & Sanity client 🛠️
```

---

## 💝 Credits

*   Inspired by the incredible design work of **Chungi Yoo**.
*   Built with ❤️ using **Next.js**.

<div align="center">
  <br />
  <p><i>"Just one chance."</i></p>
</div>
