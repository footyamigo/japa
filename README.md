# Japa GPT - Web Version

This is the web version of the Japa GPT visa recommendation app, built with Next.js.

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the `web` directory with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# API Endpoints (if using backend)
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
web/
├── app/                 # Next.js app directory (App Router)
│   ├── (auth)/         # Auth routes
│   ├── (dashboard)/    # Protected dashboard routes
│   ├── api/            # API routes
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── ui/            # Reusable UI components
│   └── shared/        # Shared components with mobile app
├── lib/               # Utility functions and configurations
│   ├── firebase.ts    # Firebase configuration
│   └── utils.ts       # Helper functions
├── contexts/          # React contexts (Auth, etc.)
├── hooks/             # Custom React hooks
├── styles/            # Global styles
└── public/            # Static assets
```

## Features

- 🔐 Authentication (Email/Password, Google Sign-In)
- 📱 Responsive design
- 🎨 Modern UI matching mobile app
- 🔄 Shared business logic with mobile app
- ⚡ Server-side rendering with Next.js
- 🚀 Optimized performance

## Sharing Code with Mobile App

To share code between the web and mobile app:

1. **Services**: Copy shared services from `../app/services/` to `lib/` and adapt for web
2. **Components**: Create web-compatible versions in `components/shared/`
3. **Types**: Share TypeScript types via a shared types package or symlinks

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure environment variables
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Self-hosted with Node.js

