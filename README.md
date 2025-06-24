# Event Manager App

A Next.js app for managing events with AI-powered description and title/tag generation.

## Setup & Run Locally

1. **Clone the repository:**

   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
   cd YOUR_REPO
Install dependencies:

bash
Copy
npm install
Create .env.local file in the root folder with your OpenAI API key:

env
Copy
OPENAI_API_KEY=your_openai_api_key_here
Run the development server:

bash
Copy
npm run dev
Open your browser and go to:

arduino
Copy
http://localhost:3000
Features
Add, edit, and delete events

AI-generated event descriptions

AI-generated catchy titles and tags

Persistent storage using Firebase Firestore

Notes
Make sure you have a valid OpenAI API key with access to GPT-3.5 or higher

Firebase config is included in the project under src/lib/firebase.ts (replace with your own)

This project is configured to run on port 3000 by default; if occupied, Next.js will use another port
