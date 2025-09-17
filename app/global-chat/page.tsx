import ChatInterface from './components/ChatInterface'

export default function GlobalChatPage() {
  return (
    <div className="h-screen">
      <ChatInterface />
    </div>
  )
}

export const metadata = {
  title: 'Global Chat',
  description: 'AI-powered global chat interface',
}