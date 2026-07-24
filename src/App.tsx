import { useState, useRef, useEffect } from 'react'
import './App.css'
import ChatHeader from './components/ChatHeader'
import MessageBubble from './components/MessageBubble'
import { ArrowUp } from "lucide-react";

function App() {
  type Message = {
    id: number;
    role: "user" | "assistant";
    name: string;
    text: string;
  };
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      name: "AI",
      text: "こんにちは",
    },
    {
      id: 2,
      role: "assistant",
      name: "AI",
      text: "Reactを勉強中です。",
    },
    {
      id: 3,
      role: "assistant",
      name: "AI",
      text: "Tailwind楽しい!",
    }
  ]);

  const [inputText, setInputText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if(!textarea) {
      return;
    }
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`
  }
  const handleSend = () => {
    if (inputText === "") {
      return;
    }
    const newMessage: Message = {
      id: Date.now(),
      role: "user",
      name: "さくら",
      text: inputText,
    }
    setMessages([...messages, newMessage]);
    setInputText("");
    if(textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages])

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-white">
      <ChatHeader />
      <main className="mx-auto w-full max-w-5xl p-4 pb-28">
        {messages.map((message) =>
          <MessageBubble
            key={message.id}
            role={message.role}
            name={message.name}
            text={message.text}
          />
        )}
        <div ref={messagesEndRef}></div>
      </main>

      <div className="
        fixed bottom-0 left-0
        right-0 flex gap-2 border-t
        border-zinc-800 bg-zinc-950 p-4"
      >
        <div className="mx-auto flex w-full max-w-5xl gap-2">
          <div className="relative w-full">
            <textarea 
              ref={textareaRef}
              className="
              max-h-40 min-h-12 w-full resize-none
              overflow-y-auto rounded-full bg-zinc-800
              py-3 pl-5 pr-20 text-white outline-none
            placeholder:text-zinc-500"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                adjustTextareaHeight();
              }}
              onKeyDown={(e) =>{
                // 日本語の変換中に送信しないように変更する.
                if(e.nativeEvent.isComposing) return;
                // shift押してるなら.
                if(e.shiftKey) return;
                // ただの改行.
                if(e.key !== "Enter") return;

                e.preventDefault();
                handleSend();
              }}
              placeholder="メッセージを入力"
            />
            <button 
              className="
                absolute bottom-5 right-3
                rounded-full bg-violet-600
                h-10 w-10
                flex items-center justify-center
                font-bold text-white
              hover:bg-violet-500 text-sm"
              onClick={handleSend}
            >
              <ArrowUp size={22}  strokeWidth={2}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;
