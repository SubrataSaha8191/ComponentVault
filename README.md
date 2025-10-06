🧩 ComponentVault

A Next.js-powered component library platform integrated with Firebase — built to store, showcase, and share reusable UI components with images, metadata, and real-time updates.

🚀 Overview

ComponentVault is a web platform designed to help developers upload, manage, and discover UI components efficiently.
Built using Next.js, Firebase Firestore, and Firebase Storage, it offers a seamless experience for storing reusable design blocks, complete with screenshots and metadata.

🧠 Key Features

⚡ Next.js 14 App Router — blazing fast frontend rendering.

🔐 Firebase Authentication — secure user login and session handling.

🗂️ Firestore Database — dynamic storage for component metadata.

🖼️ Image Upload & Preview — upload component screenshots.

📦 Responsive UI — TailwindCSS + ShadCN-UI based design system.

📡 Real-time Updates — instant reflection of new components.

🧭 Search & Filter — find components easily across categories.

🏗️ Tech Stack
Layer	Technology
Frontend	Next.js 14 (App Router), React, TailwindCSS, ShadCN-UI
Backend	Firebase Firestore, Firebase Authentication
Storage	Firebase Storage (or alternative cloud storage)
Deployment	Vercel / Firebase Hosting
Language	TypeScript / JavaScript
⚙️ Setup & Installation

Clone the repository

git clone https://github.com/<your-username>/componentvault.git
cd componentvault


Install dependencies

npm install
# or
yarn install


Setup Firebase

Create a Firebase project at console.firebase.google.com

Enable Authentication and Firestore Database

Copy your Firebase config and create a .env.local file:

NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id


Run the app

npm run dev


App runs on http://localhost:3000

🛠️ Future Enhancements

🌍 Public Gallery for shared components

🧠 AI-powered Tagging for categorization

🧾 Version Control for component updates

💬 Community Interaction (likes, comments, forks)

🤝 Contributing

Contributions are welcome!
Fork the repo, make your changes, and submit a pull request.

📜 License

This project is licensed under the MIT License — free for personal and commercial use.

👨‍💻 Developed By

Subrata Saha

“Building tools that empower developers to create better interfaces, faster.”
