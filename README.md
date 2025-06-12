# Audit Agent by LOOPR

AI-powered code auditing and optimization tool that helps developers identify bugs, inefficiencies, and vulnerabilities in their code.

## Features

- Multi-language support (JavaScript, Python, C, Java, Solidity, Rust)
- Real-time code analysis and optimization
- Security vulnerability detection
- Performance optimization suggestions
- Code readability improvements
- Modern, responsive UI with real-time updates
- Collaborative code review capabilities

## Tech Stack

- **Framework**: Next.js 13+ (App Router)
- **Styling**: Tailwind CSS
- **AI Integration**: OpenAI GPT-3.5/4
- **UI Components**: 
  - Framer Motion for animations
  - React Syntax Highlighter
  - Custom glassmorphism effects
- **Deployment**: Vercel

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment

This project is configured for deployment on Vercel:

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Add your `OPENAI_API_KEY` to the environment variables
4. Deploy!

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)

## License

Copyright © 2024 LOOPR. All rights reserved.
