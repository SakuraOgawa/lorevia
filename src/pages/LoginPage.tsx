import { supabase } from "../lib/supabase"

function LoginPage() {
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) { console.error("Googleログインエラー1:", error)}
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
      <div className="text-center">
        <h1 className="mb-6 text-3xl font-bold">
          Lorevia
        </h1>
  
        <button 
          onClick={signInWithGoogle}
          className="rounded-xl bg-white px-6 py-3 font-medium text-black hover:bg-zinc-200"
        >
          Googleでログイン
        </button>
      </div>
    </div>
  )

}

export default LoginPage