import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 rounded-2xl p-8 shadow-xl text-center">
        <h1 className="text-3xl font-bold text-teal-400 mb-4">InstaWycena</h1>
        <p className="text-slate-400 mb-8">Profesjonalny system do wyceny malowania.</p>
        <div className="space-y-4">
          <Link href="/login" className="block w-full bg-teal-500 text-slate-950 font-semibold py-3 rounded-xl hover:bg-teal-400 transition-colors cursor-pointer">
            Zaloguj się
          </Link>
          <Link href="/register" className="block w-full bg-slate-800 text-slate-200 font-semibold py-3 rounded-xl hover:bg-slate-700 transition-colors border border-slate-700 cursor-pointer">
            Zarejestruj się jako klient
          </Link>
        </div>
      </div>
    </div>
  );
}
