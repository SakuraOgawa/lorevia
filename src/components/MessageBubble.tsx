type MessageBubbleProps = {
  text: string;
  name: string;
  role: "user" | "assistant";
}

function MessageBubble(props: MessageBubbleProps) {
  const isUser = props.role === "user";

  return (
    <div 
      className={`mb-4 flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div className="max-w-[70%]">
        <p 
          className={`mb-1 text-sm text-zinc-400 ${
            isUser ? "text-right": "text-left"
          }`}
        >
          {props.name}
        </p>

        <div 
          className={`wrap-break-word whitespace-pre-wrap rounded-2xl bg-zinc-800 px-4 py-3 text-zinc-100 shadow ${
            isUser
              ? "bg-violet-600"
              : "bg-zinc-800"
          }`}
        >
          {props.text}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;