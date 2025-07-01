# AI Chat with Claude

A modern chat application built with Next.js and powered by Anthropic's Claude AI.

## Features

- 🤖 Real-time chat with Claude AI
- 💬 Clean and responsive chat interface
- 🎨 Beautiful UI with Tailwind CSS
- ⚡ Fast and efficient with Next.js 14
- 🔒 Secure API key handling
- 📱 Mobile-friendly design

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Anthropic API key

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd ai-chat-claude
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Add your Anthropic API key to `.env.local`:

```env
ANTHROPIC_API_KEY=your_actual_api_key_here
```

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Getting an Anthropic API Key

1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env.local` file

## Project Structure

```
src/
├── app/
│   ├── api/chat/route.ts    # API endpoint for Claude integration
│   ├── layout.tsx           # Root layout
│   └── page.tsx            # Home page
├── components/
│   ├── ChatContainer.tsx    # Main chat component
│   ├── ChatInput.tsx       # Message input component
│   └── ChatMessage.tsx     # Individual message component
├── hooks/
│   └── useChat.ts          # Chat state management hook
├── lib/
│   └── utils.ts            # Utility functions
└── types/
    └── chat.ts             # TypeScript type definitions
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Anthropic Claude** - AI chat capabilities
- **React Hooks** - State management

## Features

### Chat Interface

- Send and receive messages in real-time
- Message timestamps
- Loading indicators
- Error handling
- Clear chat functionality

### AI Integration

- Powered by Claude 3 Sonnet
- Maintains conversation context
- Handles various message types
- Robust error handling

## Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `ANTHROPIC_API_KEY` environment variable in Vercel dashboard
4. Deploy!

## Contributing

1
