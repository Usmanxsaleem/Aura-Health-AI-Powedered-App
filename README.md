Aura Health 🩺✨

Aura Health is an AI-powered health platform that helps users book appointments with doctors efficiently. It includes AI-assisted triage to recommend the right specialty and urgency based on user symptoms.

🚀 Features
Authentication: Register/Login with local state management (Zustand)
Dashboard: Overview with stats, upcoming appointments, and AI triage CTA
AI Triage: Natural language symptom input → recommended specialty + urgency score + clinical summary
Services: Browse doctors by specialty with search and filter
Booking Flow: Select date & time; AI summary shared with doctor
Appointments: Full management (view, cancel)
Design: Cool tones, layered shadows, geometric precision, Inter font, and framer-motion animations

⚡ Currently, AI triage is keyword-based as a functional demo. Next steps include real persistence (database, auth) and AI triage via LLM.

🛠 Tech Stack
Frontend: TypeScript, React, Zustand, Framer Motion
Backend (Future): Node.js / Python (planned)
Design: CSS-in-JS, custom theme
AI: Keyword-based symptom matching (functional demo; LLM integration planned)
📂 Project Structure (Example)
/src
  /components   # Reusable UI components
  /pages        # App pages: Dashboard, Booking, Login, Register
  /store        # Zustand state management
  /services     # AI triage logic and utilities
  /assets       # Images, fonts, icons
  
💻 Installation
Clone the repository:
[git clone https://github.com/your-username/aura-health.git](https://github.com/Usmanxsaleem/Aura-Health-AI-Powedered-App.git)
cd aura-health
Install dependencies:
npm install
Start the development server:
npm run dev
Open your browser at http://localhost:5173

⚠️ AI triage demo works locally without API integration. Real AI-powered triage requires future setup.

🖥 Usage
Register or login
View dashboard stats and upcoming appointments
Enter symptoms in AI Triage → get recommended specialty and urgency
Browse doctors and book appointments with AI-generated summary
Manage appointments (view/cancel)
📸 Screenshots





🤝 Contributing

Contributions are welcome! Steps:

Fork the repo
Create a feature branch (git checkout -b feature-name)
Commit your changes (git commit -m 'Add feature')
Push (git push origin feature-name)
Open a Pull Request
📌 Roadmap
Add database persistence (PostgreSQL / Supabase)
Full authentication with backend
AI-powered triage using LLM
Real-time appointment notifications
