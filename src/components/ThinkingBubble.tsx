function ThinkingBubble() {
  return (
    <div className="mb-4 flex justify-start">
      <div className="max-w-[70%]">
        <p className="mb-1 text-sm text-zinc-400">
          AI
        </p>
        <div className="rounded-2xl bg-zinc-800 px-4 py-3 shadow">
          <div className="flex gap-1">
            <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-zinc-300"></span>
            <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-zinc-300" style={{ animationDelay: "0.2s" }}></span>
            <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-zinc-300" style={{ animationDelay: "0.4s" }}></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThinkingBubble;