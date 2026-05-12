import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-orange-50 border border-orange-200 rounded-2xl p-8 shadow-xl text-center">
        <h1 className="text-3xl font-bold text-orange-400 mb-4">InstaWycena</h1>
        <p className="text-gray-500 mb-8">Profesjonalny system do wyceny malowania.</p>
        <div className="space-y-4">
          <Link href="/login" className="block w-full bg-orange-400 text-gray-900 font-semibold py-3 rounded-xl hover:bg-orange-300 transition-colors cursor-pointer">
            Zaloguj się
          </Link>
          <Link href="/register" className="block w-full bg-orange-400  text-gray-900 font-semibold py-3 rounded-xl hover:bg-orange-300 transition-colors cursor-pointer">
            Zarejestruj się jako klient
          </Link>
        </div>
      </div>
    </div>
  );
}
