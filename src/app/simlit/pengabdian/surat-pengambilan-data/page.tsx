"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type SuratData = {
  judulPengabdian: string;
  tahunKegiatan: number;
  lamaKegiatan: string;
  createdByName?: string;
};

export default function SuratPengambilanDataPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuratContent />
    </Suspense>
  );
}

function SuratContent() {
  const params = useSearchParams();
  const id = params.get("id");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SuratData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      if (!id) {
        setError("ID tidak ditemukan");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/dosen/pengabdian`);
        const json = await res.json();
        if (!res.ok) throw new Error(json?.message || "Gagal memuat data");
        interface PengabdianItem {
          id: string;
          judulPengabdian: string;
          tahunKegiatan: number;
          lamaKegiatan: string;
          createdBy?: {
            name?: string;
          };
        }

        const item = (json?.data as PengabdianItem[]).find((p) => p.id === id);
        if (!item) throw new Error("Pengabdian tidak ditemukan");
        const surat: SuratData = {
          judulPengabdian: item.judulPengabdian,
          tahunKegiatan: item.tahunKegiatan,
          lamaKegiatan: item.lamaKegiatan,
          createdByName: item?.createdBy?.name,
        };
        if (!isMounted) return;
        setData(surat);
      } catch (e) {
        if (!isMounted) return;
        setError(e instanceof Error ? e.message : "Terjadi kesalahan");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    run();
    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!loading && !error) {
      const t = setTimeout(() => window.print(), 300);
      return () => clearTimeout(t);
    }
  }, [loading, error]);

  const today = useMemo(() => new Date().toLocaleDateString("id-ID"), []);

  return (
    <div className="p-8 print:p-0">
      <style>{`@media print { .no-print { display: none; } body { background: #fff; } }`}</style>
      <div className="no-print mb-4 flex gap-2">
        <button
          onClick={() => window.print()}
          className="px-3 py-2 bg-black text-white rounded">
          Cetak
        </button>
        <button
          onClick={() => window.close()}
          className="px-3 py-2 border rounded">
          Tutup
        </button>
      </div>
      {loading ? (
        <div>Memuat...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : data ? (
        <div className="max-w-3xl mx-auto bg-white text-black">
          <h1 className="text-center text-xl font-bold mb-6">
            Surat Pengantar Pengambilan Data
          </h1>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-semibold">Tanggal</span>: {today}
            </div>
            <div>
              <span className="font-semibold">Kepada</span>: Yth. Pihak Terkait
            </div>
            <div>
              <span className="font-semibold">Perihal</span>: Permohonan
              Pengambilan Data
            </div>
          </div>
          <hr className="my-4" />
          <div className="text-sm space-y-3">
            <p>Dengan hormat,</p>
            <p>
              Sehubungan dengan pelaksanaan kegiatan pengabdian masyarakat
              berjudul
              <span className="font-semibold"> {data.judulPengabdian} </span>
              (Tahun {data.tahunKegiatan}, durasi {data.lamaKegiatan}), kami
              memohon izin untuk melakukan pengambilan data pada
              instansi/organisasi yang Bapak/Ibu pimpin.
            </p>
            <p>
              Data yang diperoleh akan digunakan untuk kepentingan kegiatan
              pengabdian dan tidak akan disebarluaskan di luar keperluan
              tersebut.
            </p>
          </div>
          <div className="mt-12 text-right text-sm">
            <div>UPI YPTK Padang</div>
            <div className="mt-12">__________________________</div>
            <div>TTD dan Nama Pejabat</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
