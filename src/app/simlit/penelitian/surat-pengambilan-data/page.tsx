"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

// ===== Type Definitions =====
type DosenItem = {
  namaDosen: string;
  NIDN: string;
  prodiFakultas?: string;
};

type SuratData = {
  judulPenelitian: string;
  dosen: DosenItem[];
  noHpKetua?: string;
  tanggalSurat: string;
  penandaTangan: {
    jabatan: string;
    nama: string;
    nidn: string;
  };
};

type DosenPenelitian = {
  namaDosen: string;
  NIDN: string;
  noHp?: string;
  roleDosenPenelitian: "KETUA" | "ANGGOTA";
  programStudiDosenPenelitian?: string;
};

type Penelitian = {
  id: string;
  judulPenelitian: string;
  dosenPenelitian: DosenPenelitian[];
};

// ===== Component =====
export default function SuratTugasPage() {
  const [id, setId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SuratData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ===== Input Manual =====
  const [nomorUrut, setNomorUrut] = useState("026");
  const [lampiran, setLampiran] = useState("-");
  const [hal, setHal] = useState("Permohonan Kesediaan Pengambilan Data");
  const [tujuan, setTujuan] = useState(
    "Kelompok Kerja Pemuda Daerah Simpang Anduring Kecamatan Kuranji Kota Padang"
  );

  // Ambil ID dari URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setId(searchParams.get("id"));
  }, []);

  // Fetch data penelitian
  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/dosen/penelitian`);
        const json = await res.json();
        if (!res.ok) throw new Error(json?.message || "Gagal memuat data.");

        const list: Penelitian[] = json?.data || [];
        const penelitian = list.find((p) => p.id === id);
        if (!penelitian) throw new Error("Data penelitian tidak ditemukan.");

        // Mapping dosen penelitian
        const dosenList = penelitian.dosenPenelitian.map((d) => ({
          namaDosen: d.namaDosen ?? "-",
          NIDN: d.NIDN ?? "-",
          prodiFakultas: d.programStudiDosenPenelitian ?? "-",
          role: d.roleDosenPenelitian,
          noHp: d.noHp ?? "-",
        }));

        // Urutkan ketua di atas
        const sorted = [...dosenList].sort((a) =>
          a.role === "KETUA" ? -1 : 1
        );
        const ketua = dosenList.find((d) => d.role === "KETUA");

        // Bangun data surat
        const suratData: SuratData = {
          judulPenelitian: penelitian.judulPenelitian ?? "-",
          dosen: sorted.map(({ role, noHp, ...rest }) => rest),
          noHpKetua: ketua?.noHp ?? "-",
          tanggalSurat: new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          penandaTangan: {
            jabatan: "Kepala LPPM UPI-YPTK Padang",
            nama: "Assoc. Prof. Dr. Agung Ramadhanu, S.Kom., M.Kom., MTA",
            nidn: "1015049102",
          },
        };

        if (isMounted) setData(suratData);
      } catch (e) {
        if (isMounted)
          setError(e instanceof Error ? e.message : "Gagal mengambil data.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [id]);

  // ===== Generate Nomor Surat =====
  const getBulanRomawi = (monthIndex: number) =>
    ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"][
      monthIndex
    ];

  const nomorSuratLengkap = useMemo(() => {
    const bulan = getBulanRomawi(new Date().getMonth());
    const tahun = new Date().getFullYear();
    return `${nomorUrut}/LPPM.UPI-YPTK/SPD.PENELITIAN/HS.V/${bulan}/${tahun}`;
  }, [nomorUrut]);

  // ===== RENDER =====
  return (
    <div className="bg-gray-100 p-4 md:p-8 print:bg-white print:p-0">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Times+New+Roman&display=swap');
        @page { size: A4; margin: 18mm; }
        @media print { .no-print { display:none } body{background:white} .a4-shadow{box-shadow:none} }
        .document-body { font-family: 'Times New Roman', Times, serif; }
      `}</style>

      {/* Input Manual */}
      <div className="no-print mb-4 flex flex-col gap-2 items-center">
        <div className="flex gap-2">
          <label>No. Urut:</label>
          <input
            value={nomorUrut}
            onChange={(e) => setNomorUrut(e.target.value)}
            className="border px-2 py-1 rounded w-20"
          />
          <label>Lampiran:</label>
          <input
            value={lampiran}
            onChange={(e) => setLampiran(e.target.value)}
            className="border px-2 py-1 rounded w-32"
          />
        </div>
        <div className="flex gap-2">
          <label>Hal:</label>
          <input
            value={hal}
            onChange={(e) => setHal(e.target.value)}
            className="border px-2 py-1 rounded w-96"
          />
        </div>
        <div className="flex gap-2">
          <label>Kepada:</label>
          <input
            value={tujuan}
            onChange={(e) => setTujuan(e.target.value)}
            className="border px-2 py-1 rounded w-[600px]"
          />
        </div>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-600 text-white rounded mt-2">
          Cetak Surat
        </button>
      </div>

      {/* Konten Surat */}
      {loading ? (
        <div className="text-center py-10">Memuat data surat...</div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : data ? (
        <main
          className="a4-shadow mx-auto bg-white text-black document-body"
          style={{
            width: "216mm",
            minHeight: "279mm",
            padding: "18mm",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}>
          {/* HEADER */}
          <header className="flex items-center border-b-4 border-black pb-2">
            <Image
              src="/logo.png"
              alt="Logo"
              width={90}
              height={90}
            />
            <div className="flex-1 text-center leading-tight">
              <p className="font-bold text-sm">
                Yayasan Perguruan Tinggi Komputer (YPTK) Padang
              </p>
              <p className="font-semibold text-blue-700">
                LEMBAGA PENELITIAN DAN PENGABDIAN MASYARAKAT
              </p>
              <p className="font-semibold text-red-700 text-lg">
                UNIVERSITAS PUTRA INDONESIA “YPTK” PADANG
              </p>
              <p className="text-xs italic">
                Jalan Raya Lubuk Begalung Padang. Telp. (0751) 776666. Faks.
                71913. E-Mail: admin@upiyptk.ac.id Homepage: www.upiyptk.ac.id
              </p>
            </div>
          </header>

          {/* Nomor Surat */}
          <section className="text-sm mt-4">
            <p className="text-right">Padang, {data.tanggalSurat}</p>
            <table>
              <tbody>
                <tr>
                  <td className="align-top w-24">Nomor</td>
                  <td>: {nomorSuratLengkap}</td>
                </tr>
                <tr>
                  <td>Lampiran</td>
                  <td>: {lampiran}</td>
                </tr>
                <tr>
                  <td>Hal</td>
                  <td className="font-semibold italic">: {hal}</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Tujuan Surat */}
          <section className="text-sm mt-6">
            <p>
              Kepada Yth. Bapak/Ibu
              <br />
              {tujuan}
              <br />
              Di Tempat
            </p>
          </section>

          {/* Pembuka */}
          <section className="text-sm text-justify mt-6">
            <p className="font-bold">
              Assalaamu’alaikum Warahmatullaahi Wabarakaatuh
            </p>
            <p className="mt-2">Dengan hormat</p>
            <p>
              Segala puji hanya milik Allah SWT, shalawat dan salam atas nabi
              besar Muhammad SAW. Mudah-mudahan kita semua senantiasa diberi
              rahmat dan hidayahnya dalam menjalankan aktivitas sehari-hari,
              Amin.
            </p>
            <p>
              Bersama ini Ketua Lembaga Penelitian dan Pengabdian Masyarakat
              (LPPM) Universitas Putra Indonesia YPTK Padang memohon kepada
              Bapak/Ibu untuk berkenan memberikan izin dalam melaksanakan
              Penelitian kepada dosen kami berikut ini:
            </p>
          </section>

          {/* TABEL DOSEN */}
          <section className="mt-4 mb-4">
            <table
              className="w-full text-sm border border-black"
              style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black px-2 py-1 w-10">No</th>
                  <th className="border border-black px-2 py-1">Nama</th>
                  <th className="border border-black px-2 py-1">NIDN</th>
                </tr>
              </thead>
              <tbody>
                {data.dosen.map((d, i) => (
                  <tr key={i}>
                    <td className="border border-black px-2 py-1 text-center">
                      {i + 1}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {d.namaDosen}
                    </td>
                    <td className="border border-black px-2 py-1">{d.NIDN}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Isi Surat */}
          <section className="text-sm text-justify mb-4">
            <p>
              Judul Penelitian :{" "}
              <span className="italic font-semibold">
                {data.judulPenelitian}
              </span>
            </p>
            <p className="mt-2">
              Demikian surat ini disampaikan, besar harapan kami agar Bapak/Ibu
              dapat memberikan izin kepada yang bersangkutan dalam melaksanakan
              kegiatan penelitian di instansi yang Bapak/Ibu pimpin. Ketua dapat
              dihubungi di nomor <strong>{data.noHpKetua}</strong>.
            </p>
            <p className="mt-2">
              Atas perhatian dan kerja sama Bapak/Ibu kami ucapkan terima kasih.
            </p>
          </section>

          {/* Penutup */}
          <section className="text-sm text-justify mb-4 font-bold">
            <p>Wassalaamu’alaikum Warahmatullaahi Wabarakaatuh</p>
          </section>

          {/* Tanda Tangan */}
          <section className="mt-8">
            <div className="float-right text-sm text-center">
              <p className="text-left">{data.penandaTangan.jabatan}</p>
              <div className="h-24" />
              <p className="font-bold underline">{data.penandaTangan.nama}</p>
              <p>NIDN: {data.penandaTangan.nidn}</p>
            </div>
          </section>
        </main>
      ) : null}
    </div>
  );
}
