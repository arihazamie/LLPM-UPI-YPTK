"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

type Dosen = {
  namaDosen: string;
  NIDN: string;
};

type SuratData = {
  judulPenelitian: string;
  dosen: Dosen[];
};

// Helper function to convert month index to Roman numeral
const getBulanRomawi = (monthIndex: number) => {
  const romawiMap = [
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
    "XI",
    "XII",
  ];
  return romawiMap[monthIndex];
};

export default function SuratPengambilanDataPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center p-8">Loading letter preview...</div>
      }>
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
  const [nomorUrut, setNomorUrut] = useState("027");

  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      if (!id) {
        setError("ID Penelitian tidak ditemukan di URL.");
        setLoading(false);
        return;
      }
      try {
        // Fetch the specific research data by ID
        const res = await fetch(`/api/dosen/penelitian/${id}`);
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json?.message || "Gagal memuat data penelitian");
        }

        const item = json.data;
        if (!item) {
          throw new Error("Data penelitian tidak ditemukan.");
        }

        // Map the fetched data to the structure needed for the letter
        const surat: SuratData = {
          judulPenelitian: item.judulPenelitian,
          dosen: item.dosenPenelitian.map((d: any) => ({
            namaDosen: d.namaDosen,
            NIDN: d.NIDN,
          })),
        };

        if (isMounted) {
          setData(surat);
        }
      } catch (e) {
        if (isMounted) {
          setError(
            e instanceof Error
              ? e.message
              : "Terjadi kesalahan yang tidak diketahui"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    run();
    return () => {
      isMounted = false;
    };
  }, [id]);

  // Auto-print when data is ready
  useEffect(() => {
    if (!loading && !error && data) {
      const timer = setTimeout(() => window.print(), 500);
      return () => clearTimeout(timer);
    }
  }, [loading, error, data]);

  const { nomorSuratLengkap, tanggalSurat } = useMemo(() => {
    const today = new Date();
    const bulanRomawi = getBulanRomawi(today.getMonth());
    const tahun = today.getFullYear();
    const tgl = today.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return {
      nomorSuratLengkap: `${nomorUrut.padStart(
        3,
        "0"
      )}/LPPM.UPI-YPTK/SPD.P/HS.V/${bulanRomawi}/${tahun}`,
      tanggalSurat: tgl,
    };
  }, [nomorUrut]);

  return (
    <div className="bg-gray-100 p-4 md:p-8 print:bg-white print:p-0">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Times+New+Roman&display=swap');
        @page {
          size: A4;
          margin: 1.5cm;
        }
        @media print {
          .no-print { display: none !important; }
          body { background: white; -webkit-print-color-adjust: exact; }
          .a4-paper { box-shadow: none !important; }
        }
        .document-body {
          font-family: 'Times New Roman', Times, serif;
          line-height: 1.5;
        }
      `}</style>

      <div className="no-print mb-6 flex justify-center items-center gap-4">
        <div className="flex items-center gap-2">
          <label
            htmlFor="nomor-urut"
            className="text-sm font-medium">
            No. Urut:
          </label>
          <input
            id="nomor-urut"
            type="text"
            value={nomorUrut}
            onChange={(e) => setNomorUrut(e.target.value)}
            className="px-2 py-1 border rounded w-24"
          />
        </div>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          Cetak
        </button>
        <button
          onClick={() => window.close()}
          className="px-4 py-2 rounded border bg-white hover:bg-gray-50 transition-colors">
          Tutup
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">Memuat data surat...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-600 font-semibold">
          {error}
        </div>
      ) : data ? (
        <main
          className="a4-paper mx-auto bg-white text-black text-sm document-body shadow-lg"
          style={{ width: "210mm", minHeight: "297mm", padding: "1.5cm" }}>
          {/* Header */}
          <header className="flex items-start gap-4 border-b-2 border-black pb-2">
            <Image
              src="/logo.png"
              alt="Logo UPI YPTK"
              width={80}
              height={80}
              className="h-20 w-auto"
            />
            <div className="text-center w-full">
              <p className="text-sm font-bold">
                Yayasan Perguruan Tinggi Komputer (YPTK) Padang
              </p>
              <p className="font-semibold text-blue-700">
                LEMBAGA PENELITIAN DAN PENGABDIAN MASYARAKAT
              </p>
              <p className="font-semibold text-red-700 text-lg">
                UNIVERSITAS PUTRA INDONESIA "YPTK"
              </p>
              <p className="text-xs italic">
                Jalan Raya Lubuk Begalung Padang. Telp. (0751) 776666. Faks.
                71913. E-Mail: admin@upiyptk.ac.id Homepage: www.upiyptk.ac.id
              </p>
            </div>
          </header>

          <div className="mt-4 flex justify-end">
            <p>Padang, {tanggalSurat}</p>
          </div>

          {/* Letter Details */}
          <section className="mt-4">
            <table>
              <tbody>
                <tr>
                  <td className="pr-2">Nomor</td>
                  <td>: {nomorSuratLengkap}</td>
                </tr>
                <tr>
                  <td>Lampiran</td>
                  <td>: -</td>
                </tr>
                <tr>
                  <td className="font-bold">Hal</td>
                  <td className="font-bold">
                    : Permohonan Kesediaan Pengambilan Data
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Recipient */}
          <section className="mt-4">
            <p>Kepada Yth. Bapak/Ibu</p>
            <p className="font-bold">
              Kepala Koordinator Pendidikan dan Penelitian RSUP DR. M. DJAMIL
              Padang
            </p>
            <p className="mt-2">Di</p>
            <p className="ml-4">Tempat</p>
          </section>

          <section className="mt-6 text-justify space-y-4">
            <p className="italic">
              Assalamu'alaikum Warahmatullahi Wabarakatuh
            </p>
            <p>Dengan Hormat,</p>
            <p>
              Segala puji hanya milik Allah SWT, shalawat dan salam atas nabi
              besar Muhammad SAW. Mudah-mudahan kita semua senantiasa diberi
              rahmat dan hidayahNya dalam menjalankan aktivitas sehari-hari,
              Amin.
            </p>
            <p>
              Bersama ini Ketua Lembaga Penelitian dan Pengabdian Masyarakat
              (LPPM) Universitas Putra Indonesia YPTK Padang, memohon kepada
              Bapak/Ibu untuk berkenan memberikan izin dalam melaksanakan
              penelitian kepada dosen kami berikut ini:
            </p>
          </section>

          {/* Lecturers Table */}
          <section className="my-4 px-8">
            <table className="w-full border-collapse border border-black">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black p-2 text-center">Nama</th>
                  <th className="border border-black p-2 text-center">
                    NIDN/NUPTK
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.dosen.map((d, i) => (
                  <tr key={i}>
                    <td className="border border-black p-2">{d.namaDosen}</td>
                    <td className="border border-black p-2 text-center">
                      {d.NIDN}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="my-4 text-justify">
            <p>
              <span className="font-bold">Judul Penelitian:</span>{" "}
              <span className="italic">{data.judulPenelitian}</span>
            </p>
          </section>

          <section className="mt-4 text-justify space-y-4">
            <p>
              Demikian surat ini disampaikan dan besar harapan kami untuk dapat
              memberikan izin kepada yang bersangkutan dalam melakukan
              penelitian di instansi yang Ibu/Bapak Pimpin. Adapun kontak yang
              dapat dihubungi No. HP: 085272432232, atas perhatian dan kerjasama
              dari Bapak/Ibu kami haturkan banyak terima kasih, semoga hidayah
              dan inayah Allah SWT senantiasa tercurah kepada kita semua, Amin.
            </p>
            <p className="italic">
              Wassalamu'alaikum Warahmatullahi Wabarakatuh
            </p>
          </section>

          {/* Signature */}
          <section className="mt-8 flex justify-end">
            <div className="text-center">
              <p>Kepala LPPM UPI YPTK Padang</p>
              <div className="relative h-24 w-48">
                {/* Placeholder for signature and stamp */}
                <Image
                  src="/ttd-agung.png"
                  alt="Signature and Stamp"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <p className="font-bold underline">
                (Assoc. Prof. Dr. Agung Ramadhanu, S.Kom, M.Kom, MTA)
              </p>
              <p>NIDN. 1015049102</p>
            </div>
          </section>
        </main>
      ) : null}
    </div>
  );
}
