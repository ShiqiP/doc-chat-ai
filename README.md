# Doc Chat AI

A modern document analysis and chat application built with Next.js, React, and OpenAI.

## Features

- 📄 **Document Upload**: Support for DOC, DOCX, PDF, MD, and TXT files
- 🤖 **AI-Powered Analysis**: OpenAI integration for intelligent document analysis
- 💬 **Interactive Chat**: Ask questions about your documents and get AI-powered answers
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🎨 **Modern UI**: Clean, intuitive interface with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Environment Setup

1. Copy the environment example file:
```bash
cp env.example .env.local
```

2. Update the environment variables in `.env.local`:
- `NEXT_PUBLIC_APP_NAME`: Application name (default: "Shiqi AI Tools")
- `OPENAI_API_KEY`: Your OpenAI API key for AI functionality

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd doc-chat-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add your OpenAI API key:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## OpenAI API Setup

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an account or sign in
3. Generate a new API key
4. Add the API key to your `.env.local` file

## How It Works

1. **Upload Documents**: Upload DOC, DOCX, PDF, MD, or TXT files or paste text directly
2. **AI Analysis**: The system automatically analyzes your content using OpenAI
3. **Smart Summary**: Get a concise summary (under 300 words) of your document
4. **Suggested Questions**: AI generates 3-5 relevant questions you can ask
5. **Interactive Chat**: Ask questions and get AI-powered answers based on your content

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI, Lucide React icons
- **PDF Viewer**: react-pdf
- **AI Integration**: OpenAI GPT-3.5-turbo
- **State Management**: React hooks

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   │   └── ai/         # OpenAI integration
│   ├── components/     # React components
│   └── layout.tsx      # Root layout
├── components/         # Shared components
├── lib/               # Utility functions
└── style/             # Global styles
```

## API Endpoints

- `POST /api/ai` - OpenAI integration for summarization and Q&A

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 🚀 Deployment

### Vercel Deployment (Recommended)

This application is optimized for Vercel deployment with built-in security features:

#### **Security Features**
- 🔒 **IP-based Rate Limiting**: 10 requests per minute per IP
- 📏 **File Size Limits**: 5MB maximum file size
- 📝 **Text Size Limits**: 10KB maximum text input
- 🛡️ **Security Headers**: X-Frame-Options, X-Content-Type-Options
- ⚡ **Vercel Edge Network**: Global CDN and DDoS protection

#### **Quick Deployment**

1. **Set your OpenAI API key (optional):**
```bash
export OPENAI_API_KEY=your_openai_api_key_here
```

2. **Run the Vercel deployment script:**
```bash
chmod +x deploy-vercel.sh
./deploy-vercel.sh
```

3. **For custom domain (optional):**
```bash
./deploy-vercel.sh --domain yourdomain.com
```

#### **Manual Deployment**

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy:**
```bash
vercel --prod
```

4. **Add environment variables:**
```bash
vercel env add OPENAI_API_KEY production
```

#### **Environment Variables**

Copy `env.example` to `.env.local` and configure:
```env
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
```

#### **Vercel Dashboard Setup**

After deployment, configure in Vercel dashboard:
1. **Environment Variables**: Add `OPENAI_API_KEY`
2. **Domain**: Add custom domain (optional)
3. **Analytics**: Monitor usage and performance
4. **Functions**: View serverless function logs

#### **Cost Information**

- **Free Tier**: 100GB bandwidth/month
- **Serverless Functions**: 100GB-hours/month
- **No server maintenance**: Fully managed by Vercel
- **Global CDN**: Automatic edge caching

## License

MIT License - see LICENSE file for details.
