# Master Growbot MVP

<!-- Branch Deployment Strategy:
main → deploys analyze-plant (web schema)
ios-main → deploys analyze-ios (same schema as web, but separate function)
-->

## 🚀 Branch Deployment Strategy
- **main** → deploys analyze-plant (web schema)
- **ios-main** → deploys analyze-ios (normalized schema for mobile)

### Function Deployment Commands
- **Main branch**: `npm run deploy:main` or `supabase functions deploy --no-verify-jwt=false`
- **iOS branch**: `npm run deploy:ios` or `supabase functions deploy analyze-ios --no-verify-jwt=false`

## About
Master Growbot is an AI-powered cannabis cultivation assistant that helps growers optimize their cultivation process through advanced AI technology and expert guidance.

## Core Features
- AI chatbot for growing advice using OpenAI's GPT
- Plant health analysis using OpenAI's Vision API
- Simple FAQ-style grow guide
- User authentication and profiles
- Mobile-responsive design

## Tech Stack
- React + Vite
- TypeScript
- Tailwind CSS
- Supabase (Authentication, Database, Storage)
- OpenAI APIs (GPT, Vision)

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/YourUsername/v1mastergrowbot.git
cd v1mastergrowbot
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

## Production Deployment
The application is configured for deployment at www.mastergrowbot.com/app

## License
All rights reserved. This source code is proprietary and confidential.