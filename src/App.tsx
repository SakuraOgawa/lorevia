import { useState, useRef, useEffect } from 'react'
import type { Session } from "@supabase/supabase-js";
import './App.css'
import ChatHeader from './components/ChatHeader'
import MessageBubble from './components/MessageBubble'
import ThinkingBubble from './components/ThinkingBubble'
import ErrorToast from "./components/ErrorToast";
import LoginPage from './pages/LoginPage'
import { supabase } from "./lib/supabase"
import { ArrowUp } from "lucide-react";

function App() {
  type Message = {
    id: number;
    role: "user" | "assistant";
    name: string;
    text: string;
  };
  const [messages, setMessages] = useState<Message[]>([]);
  // 変数宣言
  const [inputText, setInputText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  // ログアウト.
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) { console.error("ログアウトに失敗しました:", error)}
  }

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    getSession();

    const { data: authListener } =
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // テキストエリアの高さ調整.
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if(!textarea) {
      return;
    }
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`
  }
  // 入力.
  const handleSend = async () => {
    if (!session) { return; }

    if (inputText === "") {
      return;
    }
    const newMessage: Message = {
      id: Date.now(),
      role: "user",
      name: "さくら",
      text: inputText,
    }
    setMessages((prevMessages) => [
      ...prevMessages,
      newMessage,
    ]);
    const recentMessages = [
      ...messages,
      newMessage,
    ]
      .slice(-15)
      .map((message) => ({
        role: message.role,
        content: message.text,
      }));

    setIsThinking(true);
    
    setInputText("");
    if(textareaRef.current) { textareaRef.current.style.height = "auto" }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          messages: recentMessages,
        }),
      });
      if(!response.ok) { 
        const errorData = await response.json();
        console.error("API error:", errorData);
        throw new Error("AIの生成に失敗しました。")
      }
      const data = await response.json();

      const aiMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        name: "AI",
        text: data.reply,
      };

      setMessages((prevMessages) => [
        ...prevMessages,
        aiMessage,
      ]);
    } catch (error) {
      console.error("エラーが発生しました。", error)
      setErrorMessage(
        "AIの回答生成に失敗しました。もう一度お試しください。"
      );
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    } finally {
      setIsThinking(false);
    }
  }
  // スクロールの動き.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, isThinking]);

  if (!session) {
    return <LoginPage />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-white">
      <button
        onClick={handleLogout}
        className="rounded-lg bg-zinc-800 px-4 py-2 hover:bg-zinc-700"
      >
        ログアウト
      </button>
      {errorMessage && (
        <ErrorToast message={errorMessage} />
      )}
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

        {isThinking && <ThinkingBubble/>}
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
                // 早期リターン
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

