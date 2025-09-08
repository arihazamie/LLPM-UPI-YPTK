import Link from "next/link";
import { Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-100 via-yellow-100 to-white text-center px-4">
      <div className="bg-white/80 rounded-2xl shadow-xl p-10 flex flex-col items-center max-w-md w-full">
        <div className="bg-red-100 rounded-full p-4 mb-6 shadow-md">
          <Ghost className="w-16 h-16 text-red-500 animate-bounce" />
        </div>
        <h1 className="text-5xl font-extrabold text-red-600 mb-3 drop-shadow">
          404
        </h1>
        <h2 className="text-2xl font-semibold mb-2 text-slate-800">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-gray-500 mb-6">
          Maaf, halaman yang Anda cari tidak tersedia atau sudah dipindahkan.
        </p>
        <Link
          href="/"
          className="inline-block bg-gradient-to-r from-red-500 to-yellow-400 text-white font-semibold px-6 py-3 rounded-lg shadow hover:from-red-600 hover:to-yellow-500 transition-all duration-200"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
