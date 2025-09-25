import React from "react";
import { credentialsAreValid, signSession } from "../../lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Input } from "../../components/ui/input";

export const dynamic = "force-dynamic";

async function authenticate(formData) {
  "use server";
  const user = formData.get("user");
  const pass = formData.get("pass");
  if (credentialsAreValid(user, pass)) {
    const token = await signSession({ u: user, t: Date.now() });
    cookies().set("admin_session", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 4,
    });
    redirect("/admin");
  }
  redirect("/login?error=1");
}

export default function LoginPage({ searchParams }) {
  const error = searchParams?.error;
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fefaf6] px-4">
      <form
        action={authenticate}
        className="w-full max-w-sm bg-white/70 backdrop-blur border border-black/5 rounded-xl p-8 space-y-6 shadow-sm"
      >
        <div className="text-center space-y-2">
          <h1 className="font-display text-3xl tracking-tight text-[#ac5b30]">
            Acesso Admin
          </h1>
          <p className="text-xs font-sans text-[#6d4635]/80">
            Área restrita • Confirmações & Mensagens
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#ac5b30] font-semibold mb-1">
              Usuário
            </label>
            <Input
              name="user"
              required
              className="w-full rounded-md border border-[#ac5b30]/30 bg-white/60 focus:bg-white px-3 py-2 text-sm outline-none focus:border-[#ac5b30] focus:ring-2 focus:ring-[#ac5b30]/20"
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#ac5b30] font-semibold mb-1">
              Senha
            </label>
            <Input
              type="password"
              name="pass"
              required
              className="w-full rounded-md border border-[#ac5b30]/30 bg-white/60 focus:bg-white px-3 py-2 text-sm outline-none focus:border-[#ac5b30] focus:ring-2 focus:ring-[#ac5b30]/20"
            />
          </div>
        </div>
        {error && (
          <div className="text-[11px] text-red-600 text-center">
            Credenciais inválidas
          </div>
        )}
        <button
          type="submit"
          className="w-full px-6 py-2 rounded-full bg-[#ac5b30] text-white text-xs tracking-wide hover:brightness-110 transition"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
