import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  XCircle,
  Shield,
  Users,
  UserCheck,
  Lock,
  Code,
  Database,
  Globe,
  Zap,
  FlaskConical,
  HandHeart,
} from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl mt-32">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Dokumentasi Sistem LPPM UPI YPTK Padang
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Panduan lengkap tentang role, akses, dan fitur yang tersedia dalam
          sistem manajemen LPPM
        </p>
      </div>

      {/* Overview Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            Overview Sistem
          </CardTitle>
          <CardDescription>
            Sistem LPPM UPI YPTK Padang memiliki 3 role utama dengan hierarki
            akses yang berbeda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600 mb-2">
                PIMPINAN
              </div>
              <div className="text-sm text-gray-600">Role Tertinggi</div>
              <Badge
                variant="outline"
                className="mt-2">
                Belum Tersedia
              </Badge>
            </div>
            <div className="text-center p-4 border rounded-lg bg-blue-50">
              <div className="text-2xl font-bold text-blue-600 mb-2">ADMIN</div>
              <div className="text-sm text-gray-600">Role Administratif</div>
              <Badge className="mt-2 bg-blue-600">Tersedia</Badge>
            </div>
            <div className="text-center p-4 border rounded-lg bg-green-50">
              <div className="text-2xl font-bold text-green-600 mb-2">
                DOSEN
              </div>
              <div className="text-sm text-gray-600">Role Pengguna</div>
              <Badge className="mt-2 bg-green-600">Tersedia</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role Details */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* ADMIN Role */}
        <Card className="border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Users className="h-6 w-6" />
              Role ADMIN
            </CardTitle>
            <CardDescription className="text-blue-700">
              Akses Penuh Sistem Manajemen LPPM
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">
                  Yang Bisa Dilakukan:
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Dashboard admin lengkap dengan statistik sistem</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>
                      Manajemen konten: Artikel, Berita, Pengumuman, Agenda,
                      Webinar (CRUD)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Manajemen PKM semua dosen (CRUD)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>
                        Manajemen Penelitian dengan workflow review (8 status)
                      </strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>
                        Manajemen Pengabdian dengan workflow review (8 status)
                      </strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Manajemen user: Buat, edit, hapus role DOSEN</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>
                      Export data PKM, Penelitian, dan Pengabdian ke Excel
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Akses semua API endpoints</span>
                  </li>
                </ul>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">
                  URL Dashboard:
                </h4>
                <Badge
                  variant="outline"
                  className="font-mono">
                  <Link href="/dashboard/admin">/dashboard/admin</Link>
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* DOSEN Role */}
        <Card className="border-green-200">
          <CardHeader className="bg-green-50">
            <CardTitle className="flex items-center gap-2 text-green-800">
              <UserCheck className="h-6 w-6" />
              Role DOSEN
            </CardTitle>
            <CardDescription className="text-green-700">
              Akses Terbatas untuk Data Pribadi
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-green-800 mb-2">
                  Yang Bisa Dilakukan:
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>
                      Manajemen PKM pribadi (dengan publikasi, HKI, buku) (CRUD)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>
                        Manajemen Penelitian pribadi (CRUD) - 7 kategori
                        penelitian
                      </strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>
                        Manajemen Pengabdian pribadi (CRUD) - 7 kategori
                        pengabdian
                      </strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Manajemen prestasi pribadi (CRUD)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Manajemen prototype pribadi (CRUD)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>
                      Export data PKM, Penelitian, Pengabdian, Prestasi, dan
                      Prototype pribadi ke Excel
                    </span>
                  </li>
                </ul>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold text-red-800 mb-2">
                  Yang Tidak Bisa:
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <span>Akses dashboard admin</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <span>Lihat data dosen lain</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <span>Kelola konten publik</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <span>Kelola user lain</span>
                  </li>
                </ul>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold text-green-800 mb-2">
                  URL yang bisa diakses:
                </h4>
                <div className="space-y-1">
                  <Badge
                    variant="outline"
                    className="font-mono">
                    <Link href="/pkm">/PKM</Link>
                  </Badge>
                  <Badge
                    variant="outline"
                    className="font-mono">
                    <Link href="/penelitian/penelitian">/Penelitian</Link>
                  </Badge>
                  <Badge
                    variant="outline"
                    className="font-mono">
                    <Link href="/pengabdian/pengabdian">/Pengabdian</Link>
                  </Badge>
                  <Badge
                    variant="outline"
                    className="font-mono">
                    <Link href="/prototype">/Prototype</Link>
                  </Badge>
                  <Badge
                    variant="outline"
                    className="font-mono">
                    <Link href="/prestasi">/Prestasi</Link>
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Features Section */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Penelitian Module */}
        <Card className="border-cyan-200">
          <CardHeader className="bg-cyan-50">
            <CardTitle className="flex items-center gap-2 text-cyan-800">
              <FlaskConical className="h-6 w-6" />
              Modul Penelitian
            </CardTitle>
            <CardDescription className="text-cyan-700">
              Sistem manajemen penelitian dengan workflow approval bertingkat
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-cyan-800 mb-2">
                  Fitur Utama:
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">
                      Workflow review dengan 8 status (Draft → Disetujui)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">
                      7 kategori penelitian (Dosen Pemula → Mitra Internasional)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">10 jenis luaran penelitian</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">
                      Tim multi-dosen (Ketua & Anggota)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">Integrasi 13 program studi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">
                      Export Excel dengan filter status
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pengabdian Module */}
        <Card className="border-emerald-200">
          <CardHeader className="bg-emerald-50">
            <CardTitle className="flex items-center gap-2 text-emerald-800">
              <HandHeart className="h-6 w-6" />
              Modul Pengabdian
            </CardTitle>
            <CardDescription className="text-emerald-700">
              Sistem manajemen pengabdian masyarakat dengan workflow approval
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-emerald-800 mb-2">
                  Fitur Utama:
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">
                      Workflow review dengan 8 status (Draft → Disetujui)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">
                      7 kategori pengabdian masyarakat
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">
                      Tim multi-dosen (Ketua & Anggota)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">Integrasi 13 program studi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">
                      Export Excel dengan filter status
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">
                      Review dan approval bertingkat
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technology Stack Section */}
      <Card className="mb-8 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-6 w-6 text-indigo-600" />
            Teknologi yang Digunakan
          </CardTitle>
          <CardDescription>
            Stack teknologi modern yang digunakan dalam pengembangan sistem LPPM
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Frontend */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-blue-800">Frontend</h4>
              </div>
              <div className="space-y-2">
                <Badge
                  variant="outline"
                  className="w-full justify-start">
                  <span className="font-mono text-xs">Next.js 15.2.4</span>
                </Badge>
                <Badge
                  variant="outline"
                  className="w-full justify-start">
                  <span className="font-mono text-xs">React 19</span>
                </Badge>
                <Badge
                  variant="outline"
                  className="w-full justify-start">
                  <span className="font-mono text-xs">TypeScript 5</span>
                </Badge>
                <Badge
                  variant="outline"
                  className="w-full justify-start">
                  <span className="font-mono text-xs">Tailwind CSS 4</span>
                </Badge>
                <Badge
                  variant="outline"
                  className="w-full justify-start">
                  <span className="font-mono text-xs">Shadcn/ui</span>
                </Badge>
              </div>
            </div>

            {/* Backend */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-green-800">Backend</h4>
              </div>
              <div className="space-y-2">
                <Badge
                  variant="outline"
                  className="w-full justify-start">
                  <span className="font-mono text-xs">Next.js API Routes</span>
                </Badge>
                <Badge
                  variant="outline"
                  className="w-full justify-start">
                  <span className="font-mono text-xs">Prisma ORM 6.13</span>
                </Badge>
                <Badge
                  variant="outline"
                  className="w-full justify-start">
                  <span className="font-mono text-xs">NextAuth.js 4.24</span>
                </Badge>
                <Badge
                  variant="outline"
                  className="w-full justify-start">
                  <span className="font-mono text-xs">Zod Validation</span>
                </Badge>
              </div>
            </div>

            {/* Database */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Database className="h-5 w-5 text-purple-600" />
                <h4 className="font-semibold text-purple-800">Database</h4>
              </div>
              <div className="space-y-2">
                <Badge
                  variant="outline"
                  className="w-full justify-start">
                  <span className="font-mono text-xs">PostgreSQL</span>
                </Badge>
                <Badge
                  variant="outline"
                  className="w-full justify-start">
                  <span className="font-mono text-xs">Prisma Migrations</span>
                </Badge>
              </div>
            </div>

            {/* Core Libraries */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Code className="h-5 w-5 text-orange-600" />
                <h4 className="font-semibold text-orange-800">
                  Core Libraries
                </h4>
              </div>
              <div className="space-y-2">
                <Badge
                  variant="outline"
                  className="w-full justify-start">
                  <span className="font-mono text-xs">bcryptjs</span>
                </Badge>
                <Badge
                  variant="outline"
                  className="w-full justify-start">
                  <span className="font-mono text-xs">Cloudinary</span>
                </Badge>
                <Badge
                  variant="outline"
                  className="w-full justify-start">
                  <span className="font-mono text-xs">XLSX (Excel)</span>
                </Badge>
                <Badge
                  variant="outline"
                  className="w-full justify-start">
                  <span className="font-mono text-xs">SWR</span>
                </Badge>
                <Badge
                  variant="outline"
                  className="w-full justify-start">
                  <span className="font-mono text-xs">React Hook Form</span>
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card className="mb-8 border-purple-200">
        <CardHeader className="bg-purple-50">
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Lock className="h-6 w-6" />
            Sistem Keamanan
          </CardTitle>
          <CardDescription className="text-purple-700">
            Fitur keamanan yang diterapkan dalam sistem
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold">Middleware Proteksi</h4>
                  <p className="text-sm text-gray-600">
                    Sistem menggunakan middleware untuk proteksi berdasarkan
                    role
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold">Isolasi Data DOSEN</h4>
                  <p className="text-sm text-gray-600">
                    DOSEN hanya bisa akses data yang dibuat sendiri
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold">JWT Authentication</h4>
                  <p className="text-sm text-gray-600">
                    Autentikasi berbasis JWT dengan NextAuth.js
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold">Password Hashing</h4>
                  <p className="text-sm text-gray-600">
                    Password di-hash menggunakan bcryptjs
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold">Akses ADMIN</h4>
                  <p className="text-sm text-gray-600">
                    ADMIN bisa akses semua data di sistem
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold">Validasi API</h4>
                  <p className="text-sm text-gray-600">
                    Setiap API endpoint memvalidasi role sebelum memberikan
                    akses
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold">Input Validation</h4>
                  <p className="text-sm text-gray-600">
                    Validasi input menggunakan Zod schema
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold">SQL Injection Protection</h4>
                  <p className="text-sm text-gray-600">
                    Proteksi SQL injection melalui Prisma ORM
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold">Secure File Upload</h4>
                  <p className="text-sm text-gray-600">
                    Upload file aman dengan Cloudinary
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center mt-12 pt-8 border-t">
        <p className="text-gray-600">
          Dokumentasi ini diperbarui terakhir pada 7 September 2025 dengan
          penambahan modul Penelitian dan Pengabdian
        </p>
      </div>
    </div>
  );
}
