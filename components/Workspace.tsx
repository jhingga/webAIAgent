"use client";

import React, { useState } from 'react';

interface KAKItem {
  id: string;
  nama: string;
  nilai: number;
  status: 'Draft' | 'Final';
  category: 'Pengadaan' | 'Non Pengadaan';
  timestamp: number;
}

export default function Workspace({ generateKAKData }: { generateKAKData?: any }) {
  const [activeTab, setActiveTab] = useState('detail');
  const [kakContent, setKakContent] = useState(`I. PENDAHULUAN
Kerangka Acuan Kerja Pengadaan Alkes 2026

II. DESKRIPSI ALAT KESEHATAN
Spesifikasi teknis dan detail produk yang dibutuhkan.

III. KONDISI, SYARAT DAN PERSYARATAN
Kualifikasi, sertifikasi, dan standar yang harus dipenuhi.`);
  const [isEditing, setIsEditing] = useState(false);

  // Hasil Tab States
  const [activeHasilTab, setActiveHasilTab] = useState('ringkasan');
  const [pengadaanList, setPengadaanList] = useState<KAKItem[]>([
    {
      id: '1',
      nama: 'Alkes Tipe A - Pengadaan Awal',
      nilai: 150000000,
      status: 'Draft',
      category: 'Pengadaan',
      timestamp: Date.now(),
    },
  ]);
  const [nonPengadaanList, setNonPengadaanList] = useState<KAKItem[]>([
    {
      id: '2',
      nama: 'Alkes Tipe B - Non Pengadaan',
      nilai: 100000000,
      status: 'Draft',
      category: 'Non Pengadaan',
      timestamp: Date.now(),
    },
  ]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'Pengadaan' | 'Non Pengadaan'>('Pengadaan');
  const [showKakModal, setShowKakModal] = useState(false);
  const [kakModalContent, setKakModalContent] = useState<string>('');
  const [movingItem, setMovingItem] = useState<string | null>(null);

  const tabs = [
    { id: 'detail', label: 'Detail & Analysis' },
    { id: 'survey', label: 'Survey Pasar' },
    { id: 'kak', label: 'KAK / Spek' },
    { id: 'hasil', label: 'Hasil' },
  ];

  const hasilTabs = [
    { id: 'ringkasan', label: 'Ringkasan' },
    { id: 'pengadaan', label: 'Pengadaan' },
    { id: 'nonpengadaan', label: 'Non Pengadaan' },
  ];

  // Handlers
  const handleGenerateKAK = () => {
    setShowCategoryModal(true);
  };

  const handleConfirmCategory = () => {
    const newKAK: KAKItem = {
      id: String(Date.now()),
      nama: `KAK ${selectedCategory} - ${new Date().toLocaleString('id-ID')}`,
      nilai: Math.floor(Math.random() * 500000000) + 50000000,
      status: 'Draft',
      category: selectedCategory,
      timestamp: Date.now(),
    };

    if (selectedCategory === 'Pengadaan') {
      setPengadaanList([...pengadaanList, newKAK]);
    } else {
      setNonPengadaanList([...nonPengadaanList, newKAK]);
    }

    setKakModalContent(`I. PENDAHULUAN
Kerangka Acuan Kerja ${selectedCategory} 2026
Program: ${generateKAKData?.program || 'Program 1'}
Kegiatan: ${generateKAKData?.kegiatan || 'Kegiatan 1'}
KRO: ${generateKAKData?.kro || 'KRO 1'}
RO: ${generateKAKData?.ro || 'RO 1'}
Komponen: ${generateKAKData?.komponen || 'Komponen 1'}

II. DESKRIPSI PRODUK/JASA
Spesifikasi teknis dan detail hasil generate ${selectedCategory}
Estimasi Nilai: Rp ${newKAK.nilai.toLocaleString('id-ID')}

III. KONDISI, SYARAT DAN PERSYARATAN
Kualifikasi, sertifikasi, dan standar yang harus dipenuhi.
Status: Draft - Menunggu Review dan Finalisasi`);
    setShowKakModal(true);
    setShowCategoryModal(false);
  };

  const handleMoveItem = (itemId: string, fromCategory: 'Pengadaan' | 'Non Pengadaan') => {
    setMovingItem(itemId);
    const toCategory: 'Pengadaan' | 'Non Pengadaan' = fromCategory === 'Pengadaan' ? 'Non Pengadaan' : 'Pengadaan';
    const sourceList = fromCategory === 'Pengadaan' ? pengadaanList : nonPengadaanList;
    const targetList = fromCategory === 'Pengadaan' ? nonPengadaanList : pengadaanList;

    const item = sourceList.find((i) => i.id === itemId);
    if (item) {
      const updatedItem: KAKItem = { ...item, category: toCategory };
      setTimeout(() => {
        if (fromCategory === 'Pengadaan') {
          setPengadaanList(pengadaanList.filter((i) => i.id !== itemId));
          setNonPengadaanList([...targetList, updatedItem]);
        } else {
          setNonPengadaanList(nonPengadaanList.filter((i) => i.id !== itemId));
          setPengadaanList([...targetList, updatedItem]);
        }
        setMovingItem(null);
      }, 300);
    }
  };

  const handleViewDetail = (itemId: string) => {
    const item = [...pengadaanList, ...nonPengadaanList].find((i) => i.id === itemId);
    if (item) {
      setKakModalContent(`Detail KAK - ${item.nama}

Kategori: ${item.category}
Nilai: Rp ${item.nilai.toLocaleString('id-ID')}
Status: ${item.status}

I. IDENTITAS PAKET
Nama: ${item.nama}
Pagu: Rp ${item.nilai.toLocaleString('id-ID')}

II. DESKRIPSI DETAIL
Deskripsi lengkap dari paket ${item.nama}
Kategori: ${item.category}
Tanggal Dibuat: ${new Date(item.timestamp).toLocaleString('id-ID')}`);
      setShowKakModal(true);
    }
  };

  const allItems = [...pengadaanList, ...nonPengadaanList];
  const totalItem = allItems.length;
  const totalNilai = allItems.reduce((sum, item) => sum + item.nilai, 0);
  const formatCurrency = (value: number) => `Rp ${value.toLocaleString('id-ID')}`;

  return (
    <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Paket</p>
          <h1 className="text-2xl font-bold text-white">Pengadaan Alkes</h1>
        </div>
        <button className="px-4 py-2 bg-slate-700 text-slate-100 rounded-md text-sm hover:bg-slate-600 transition">
          ← Kembali
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-700 bg-slate-900 px-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 border-b-2 transition text-sm font-medium ${
              activeTab === tab.id
                ? 'border-blue-400 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'detail' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Card dengan informasi paket */}
            <div className="bg-slate-800 rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase mb-1">Nama Paket</p>
                  <p className="text-sm text-slate-100 font-medium">Pengadaan Alkes Sesuai Standar</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase mb-1">Pagu</p>
                  <p className="text-sm text-slate-100 font-medium">Rp 500.000.000</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase mb-1">Risiko</p>
                  <p className="text-sm text-yellow-400 font-medium">⚠️ Sedang</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase mb-1">Status</p>
                  <p className="text-sm text-green-400 font-medium">✓ Draft</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase mb-2">Analisis</p>
                <p className="text-sm text-slate-300 leading-6">
                  Pengadaan alat kesehatan ini dirancang untuk meningkatkan kapasitas layanan kesehatan di wilayah perkotaan. Berdasarkan analisis pasar, estimasi harga ditetapkan dengan margin keamanan 15% dari harga rata-rata vendor potensial. Spesifikasi teknis telah disesuaikan dengan standar internasional dan peraturan lokal.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-slate-700 text-slate-100 rounded-md text-sm hover:bg-slate-600 transition">
                📋 Salin
              </button>
              <button className="px-4 py-3 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-500 transition font-medium">
                ⬇️ Unduh KAK
              </button>
            </div>
          </div>
        )}

        {activeTab === 'survey' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="bg-slate-800 rounded-lg p-6 space-y-4">
              <div>
                <p className="text-xs text-slate-400 uppercase mb-2 font-semibold">Vendor Potensial</p>
                <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
                  <li>PT. Medika Utama - Spesialis alat kesehatan, berpengalaman 15 tahun</li>
                  <li>CV. Kesehatan Indonesia - Distributor resmi produk internasional</li>
                  <li>PT. Teknologi Medis - Manufacturer lokal, harga kompetitif</li>
                  <li>PT. Klinik Supplies - Penyedia lengkap dengan garansi extended</li>
                </ul>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase mb-2 font-semibold">Estimasi Harga</p>
                <p className="text-sm text-slate-300">Harga pasar berkisar Rp 450M - Rp 550M dengan rata-rata Rp 500M</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase mb-2 font-semibold">Analisis Kesesuaian Pagu</p>
                <p className="text-sm text-slate-300">Pagu saat ini (Rp 500M) sesuai dengan estimasi pasar dan memberikan margin keselamatan yang cukup untuk negosiasi.</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase mb-2 font-semibold">Rekomendasi Metode</p>
                <p className="text-sm text-slate-300">Lelang Terbuka - Metode ini dipilih untuk transparansi dan kompetisi yang sehat di antara vendor potensial.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'kak' && (
          <div className="flex-1 overflow-hidden flex flex-col">
            {isEditing ? (
              <textarea
                value={kakContent}
                onChange={(e) => setKakContent(e.target.value)}
                className="flex-1 p-6 bg-slate-950 text-slate-100 border-none resize-none font-mono text-sm focus:outline-none"
                placeholder="Edit dokumen KAK..."
              />
            ) : (
              <div className="flex-1 overflow-y-auto p-6">
                <div className="prose prose-invert max-w-none">
                  <p className="text-slate-300 whitespace-pre-line">{kakContent}</p>
                </div>
              </div>
            )}
            {/* KAK Buttons */}
            <div className="bg-slate-900 border-t border-slate-700 px-6 py-3 flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-500 transition"
                  >
                    ✓ Simpan
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-slate-700 text-slate-100 rounded-md text-sm hover:bg-slate-600 transition"
                  >
                    Batal
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-slate-700 text-slate-100 rounded-md text-sm hover:bg-slate-600 transition"
                  >
                    ✏️ Edit
                  </button>
                  <button className="px-4 py-2 bg-slate-700 text-slate-100 rounded-md text-sm hover:bg-slate-600 transition">
                    🔄 Generate Ulang
                  </button>
                  <button className="px-4 py-2 bg-slate-700 text-slate-100 rounded-md text-sm hover:bg-slate-600 transition">
                    ⬇️ Unduh
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === 'hasil' && (
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Hasil Sub-tabs */}
            <div className="flex border-b border-slate-700 bg-slate-900 px-4">
              {hasilTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveHasilTab(tab.id)}
                  className={`px-4 py-3 border-b-2 transition text-sm font-medium ${
                    activeHasilTab === tab.id
                      ? 'border-emerald-400 text-emerald-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              <button
                onClick={handleGenerateKAK}
                className="ml-auto px-4 py-3 text-emerald-400 text-sm font-medium hover:text-emerald-300 transition"
              >
                ✨ Generate KAK Otomatis
              </button>
            </div>

            {/* Hasil Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {activeHasilTab === 'ringkasan' && (
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                      <p className="text-xs text-slate-400 uppercase mb-2">Total Item</p>
                      <p className="text-3xl font-bold text-white">{totalItem}</p>
                      <p className="text-xs text-slate-500 mt-2">items dalam sistem</p>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                      <p className="text-xs text-slate-400 uppercase mb-2">Total Nilai</p>
                      <p className="text-2xl font-bold text-emerald-400">{formatCurrency(totalNilai)}</p>
                      <p className="text-xs text-slate-500 mt-2">total anggaran</p>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                      <p className="text-xs text-slate-400 uppercase mb-2">Status</p>
                      <p className="text-xl font-bold text-yellow-400">📋 Draft</p>
                      <p className="text-xs text-slate-500 mt-2">menunggu finalisasi</p>
                    </div>
                  </div>

                  <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 space-y-4">
                    <h3 className="text-sm font-semibold text-white">Breakdown KAK</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Kategori Pengadaan</p>
                        <p className="text-lg font-semibold text-cyan-400">{pengadaanList.length} items</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {formatCurrency(pengadaanList.reduce((sum, item) => sum + item.nilai, 0))}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Kategori Non Pengadaan</p>
                        <p className="text-lg font-semibold text-purple-400">{nonPengadaanList.length} items</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {formatCurrency(nonPengadaanList.reduce((sum, item) => sum + item.nilai, 0))}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeHasilTab === 'pengadaan' && (
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {pengadaanList.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-center">
                      <p className="text-slate-400">Belum ada KAK Pengadaan. Klik "Generate KAK Otomatis" untuk membuat.</p>
                    </div>
                  ) : (
                    pengadaanList.map((item) => (
                      <div
                        key={item.id}
                        className={`bg-slate-800 rounded-lg p-6 border border-slate-700 transition-all duration-300 ${
                          movingItem === item.id ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white">{item.nama}</h3>
                            <p className="text-sm text-slate-400 mt-1">Kategori: Pengadaan</p>
                          </div>
                          <span className="px-3 py-1 bg-yellow-900 text-yellow-300 rounded-full text-xs font-medium">
                            {item.status}
                          </span>
                        </div>
                        <div className="mb-4">
                          <p className="text-xs text-slate-400 mb-1">Nilai Anggaran</p>
                          <p className="text-2xl font-bold text-cyan-400">{formatCurrency(item.nilai)}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleMoveItem(item.id, 'Pengadaan')}
                            disabled={movingItem !== null}
                            className="flex-1 px-4 py-2 bg-slate-700 text-slate-100 rounded-md text-sm hover:bg-slate-600 transition disabled:opacity-50"
                          >
                            ↔️ Pindah ke Non Pengadaan
                          </button>
                          <button
                            onClick={() => handleViewDetail(item.id)}
                            disabled={movingItem !== null}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-500 transition disabled:opacity-50"
                          >
                            👁️ Lihat Detail
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeHasilTab === 'nonpengadaan' && (
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {nonPengadaanList.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-center">
                      <p className="text-slate-400">Belum ada KAK Non Pengadaan. Klik "Generate KAK Otomatis" untuk membuat.</p>
                    </div>
                  ) : (
                    nonPengadaanList.map((item) => (
                      <div
                        key={item.id}
                        className={`bg-slate-800 rounded-lg p-6 border border-slate-700 transition-all duration-300 ${
                          movingItem === item.id ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white">{item.nama}</h3>
                            <p className="text-sm text-slate-400 mt-1">Kategori: Non Pengadaan</p>
                          </div>
                          <span className="px-3 py-1 bg-yellow-900 text-yellow-300 rounded-full text-xs font-medium">
                            {item.status}
                          </span>
                        </div>
                        <div className="mb-4">
                          <p className="text-xs text-slate-400 mb-1">Nilai Anggaran</p>
                          <p className="text-2xl font-bold text-purple-400">{formatCurrency(item.nilai)}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleMoveItem(item.id, 'Non Pengadaan')}
                            disabled={movingItem !== null}
                            className="flex-1 px-4 py-2 bg-slate-700 text-slate-100 rounded-md text-sm hover:bg-slate-600 transition disabled:opacity-50"
                          >
                            ↔️ Pindah ke Pengadaan
                          </button>
                          <button
                            onClick={() => handleViewDetail(item.id)}
                            disabled={movingItem !== null}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-500 transition disabled:opacity-50"
                          >
                            👁️ Lihat Detail
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-lg border border-slate-700 w-96">
            <div className="border-b border-slate-700 px-6 py-4">
              <h2 className="text-lg font-bold text-white">Pilih Kategori KAK</h2>
            </div>
            <div className="p-6 space-y-4">
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-800 transition">
                <input
                  type="radio"
                  name="category"
                  value="Pengadaan"
                  checked={selectedCategory === 'Pengadaan'}
                  onChange={(e) => setSelectedCategory(e.target.value as 'Pengadaan' | 'Non Pengadaan')}
                  className="w-4 h-4"
                />
                <span className="text-slate-100 font-medium">Pengadaan</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-800 transition">
                <input
                  type="radio"
                  name="category"
                  value="Non Pengadaan"
                  checked={selectedCategory === 'Non Pengadaan'}
                  onChange={(e) => setSelectedCategory(e.target.value as 'Pengadaan' | 'Non Pengadaan')}
                  className="w-4 h-4"
                />
                <span className="text-slate-100 font-medium">Non Pengadaan</span>
              </label>
            </div>
            <div className="border-t border-slate-700 px-6 py-4 flex gap-2 justify-end">
              <button
                onClick={() => setShowCategoryModal(false)}
                className="px-4 py-2 bg-slate-700 text-slate-100 rounded-md text-sm hover:bg-slate-600 transition"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmCategory}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-500 transition"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KAK Modal */}
      {showKakModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-lg border border-slate-700 w-3/4 h-3/4 max-w-4xl flex flex-col">
            <div className="border-b border-slate-700 px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">Konten KAK</h2>
              <button
                onClick={() => setShowKakModal(false)}
                className="text-slate-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
              <p className="text-slate-300 font-mono text-sm whitespace-pre-line leading-relaxed">
                {kakModalContent}
              </p>
            </div>
            <div className="border-t border-slate-700 px-6 py-4 flex gap-2 justify-end">
              <button
                onClick={() => setShowKakModal(false)}
                className="px-4 py-2 bg-slate-700 text-slate-100 rounded-md text-sm hover:bg-slate-600 transition"
              >
                Tutup
              </button>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-500 transition">
                💾 Simpan KAK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
