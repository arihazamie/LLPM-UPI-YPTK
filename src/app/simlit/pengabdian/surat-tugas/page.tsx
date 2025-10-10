"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

// Define the structure for a lecturer item
type DosenItem = {
  namaDosen: string;
  NIDN: string;
  prodiFakultas: string;
};

// Define the main structure for the letter data
type SuratData = {
  judulKegiatan: string;
  deskripsiPelaksanaan: string;
  dosen: DosenItem[];
  // Static data that is not from the API
  tanggalSurat: string;
  penandaTangan: {
    jabatan: string;
    nama: string;
    nidn: string;
  };
};

export default function SuratTugasPage() {
  const [id, setId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SuratData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nomorUrut, setNomorUrut] = useState("027"); // State for the inputtable number

  // Get ID from URL search params on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setId(searchParams.get("id"));
  }, []);

  useEffect(() => {
    // Prevent fetching if ID hasn't been determined yet
    if (id === null) {
      return;
    }

    let isMounted = true;
    const fetchData = async () => {
      if (!id) {
        setError("ID pengabdian tidak ditemukan pada URL.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetching all data and then finding the specific item
        const res = await fetch(`/api/dosen/pengabdian`); // Replace with your actual API endpoint
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json?.message || "Gagal memuat data dari server.");
        }

        interface PengabdianItem {
          id: string;
          judulPengabdian: string;
          lamaKegiatan: string;
          tahunKegiatan: string;
          dosenPengabdian?: Array<{
            namaDosen: string;
            NIDN: string;
            programStudiDosenPengabdian: string;
          }>;
        }

        const item = (json?.data as PengabdianItem[]).find((p) => p.id === id);

        if (!item) {
          throw new Error(
            "Data pengabdian dengan ID yang diberikan tidak ditemukan."
          );
        }

        // Mapping fetched data to the structure needed by the component
        const suratData: SuratData = {
          judulKegiatan: item.judulPengabdian,
          deskripsiPelaksanaan: `dilaksanakan selama ${item.lamaKegiatan} pada tahun ${item.tahunKegiatan}`,
          dosen: (item?.dosenPengabdian || []).map((d) => ({
            namaDosen: d.namaDosen,
            NIDN: d.NIDN,
            prodiFakultas: d.programStudiDosenPengabdian || "N/A", // Adjust field name as needed
          })),
          // Static data can be kept here
          tanggalSurat: new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          penandaTangan: {
            jabatan: "Ka. LPPM, UPI-YPTK Padang",
            nama: "Assoc. Prof. Dr. Agung Ramadhanu, S.Kom., M.Kom",
            nidn: "1015049102",
          },
        };

        if (isMounted) {
          setData(suratData);
        }
      } catch (e) {
        if (isMounted) {
          setError(
            e instanceof Error
              ? e.message
              : "Terjadi kesalahan saat mengambil data."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

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

  // Dynamically generate the full letter number
  const nomorSuratLengkap = useMemo(() => {
    const bulanSaatIni = new Date().getMonth(); // 0-11
    const tahunSaatIni = new Date().getFullYear();
    const bulanRomawi = getBulanRomawi(bulanSaatIni);
    return `${nomorUrut}/LPPM-UPI-YPTK/ST.P/HS-V/${bulanRomawi}/${tahunSaatIni}`;
  }, [nomorUrut]);

  return (
    <div className="bg-gray-100 p-4 md:p-8 print:bg-white print:p-0">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Times+New+Roman&display=swap');
        @page {
          size: 216mm 279mm; /* H4 / US Letter paper size */
          margin: 18mm;
        }
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          .a4-shadow { box-shadow: none !important; }
        }
        .document-body {
          font-family: 'Times New Roman', Times, serif;
        }
      `}</style>

      {/* Action buttons and input field, hidden when printing */}
      <div className="no-print mb-4 flex justify-center items-center gap-4">
        <div className="flex items-center gap-2">
          <label
            htmlFor="nomor-urut"
            className="text-sm font-medium whitespace-nowrap">
            No. Urut Surat:
          </label>
          <input
            id="nomor-urut"
            type="text"
            value={nomorUrut}
            onChange={(e) => setNomorUrut(e.target.value.padStart(0, "0"))}
            className="px-2 py-1 border rounded w-24"
            placeholder="cth: 027"
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

      {/* Conditional rendering based on loading and error states */}
      {loading ? (
        <div className="text-center py-10">Memuat data surat...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-600 font-semibold">
          {error}
        </div>
      ) : data ? (
        <main
          className="a4-shadow mx-auto bg-white text-black document-body"
          style={{
            width: "216mm",
            minHeight: "279mm",
            padding: "18mm",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}>
          {/* Header Section */}
          <header className="flex flex-col items-center">
            <div className="flex items-center gap-4 w-full">
              <Image
                src="/logo.png"
                alt="Logo UPI YPTK"
                width={80}
                height={80}
                className="h-20 w-20"
              />
              <div className="text-center flex-1">
                <p className="text-md font-bold">
                  Yayasan Perguruan Tinggi Komputer (YPTK) Padang
                </p>
                <p className="font-semibold text-lg text-blue-700">
                  LEMBAGA PENELITIAN DAN PENGABDIAN MASYARAKAT
                </p>
                <p className="font-semibold text-red-700 text-lg">
                  UNIVERSITAS PUTRA INDONESIA {"YPTK"} PADANG
                </p>
                <p className="text-xs italic">
                  Jalan Raya Lubuk Begalung Padang. Telp. (0751) 776666. Faks.
                  71913. E-Mail: admin@upiyptk.ac.id Homepage: www.upiyptk.ac.id
                </p>
              </div>
            </div>
            <div className="mt-2 h-1 w-full bg-black" />
          </header>

          {/* Document Title */}
          <section className="text-center mt-6 mb-8">
            <h1 className="text-xl font-bold tracking-wider underline">
              SURAT TUGAS
            </h1>
            <p className="text-sm mt-1 font-semibold">
              No. {nomorSuratLengkap}
            </p>
          </section>

          {/* Opening Paragraph */}
          <section className="text-sm leading-relaxed text-justify mb-4">
            <p>
              Yang bertanda tangan di bawah ini Ketua Lembaga Penelitian dan
              Pengabdian Masyarakat Universitas Putra Indonesia {"YPTK"} Padang
              memberi tugas kepada :
            </p>
          </section>

          {/* Lecturers Table */}
          <section className="mb-4">
            <table
              className="w-full text-sm border-black"
              style={{ borderCollapse: "collapse", border: "1px solid black" }}>
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black px-2 py-1.5 w-10 text-center">
                    No
                  </th>
                  <th className="border border-black px-2 py-1.5 text-center">
                    NIDN
                  </th>
                  <th className="border border-black px-2 py-1.5 text-center">
                    NAMA
                  </th>
                  <th className="border border-black px-2 py-1.5 text-center">
                    PRODI/FAKULTAS
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.dosen.map((d, i) => (
                  <tr key={i}>
                    <td className="border border-black px-2 py-1 text-center align-top">
                      {i + 1}.
                    </td>
                    <td className="border border-black px-2 py-1 align-top">
                      {d.NIDN}
                    </td>
                    <td className="border border-black px-2 py-1 align-top">
                      {d.namaDosen}
                    </td>
                    <td className="border border-black px-2 py-1 align-top">
                      {d.prodiFakultas}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Activity Description */}
          <section className="text-sm leading-relaxed text-justify mb-4">
            <p className="mb-4">
              Menjadi Penyelenggara Kegiatan Penelitian dengan Tema{" "}
              <span className="font-semibold italic">{data.judulKegiatan}</span>{" "}
              {data.deskripsiPelaksanaan}.
            </p>
            <p>
              Demikian surat tugas ini dibuat untuk dapat dipergunakan
              sebagaimana mestinya.
            </p>
          </section>

          {/* Signature Section */}
          <section className="mt-12">
            <div className="inline-block float-right text-base text-center">
              <p className="text-left">Padang, {data.tanggalSurat}</p>
              <p className="mt-1 text-left">{data.penandaTangan.jabatan}</p>
              <div className="h-24" />
              <div className="font-bold text-left">
                <p className="underline">{data.penandaTangan.nama}</p>
                <p>NIDN: {data.penandaTangan.nidn}</p>
              </div>
            </div>
          </section>
        </main>
      ) : null}
    </div>
  );
}
