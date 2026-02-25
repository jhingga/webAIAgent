"use client";

import React, { useState } from 'react';

export default function Sidebar({ onGenerateKAK }) {
  const [program, setProgram] = useState('Program 1');
  const [kegiatan, setKegiatan] = useState('Kegiatan 1');
  const [kro, setKro] = useState('KRO 1');
  const [ro, setRo] = useState('RO 1');
  const [komponen, setKomponen] = useState('Komponen 1');

  const handleFileSelect = () => {
    // Simulasi file picker
    alert('File picker dibuka - File akan ditampilkan di sini');
  };

  return (
    <div className="w-[280px] bg-slate-900 border-r border-slate-700 p-6 overflow-y-auto flex-shrink-0 flex flex-col gap-8">
      {/* Section 1: Upload CSV RKA */}
      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase mb-3">Upload CSV RKA</h3>
        <button
          onClick={handleFileSelect}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-500 transition"
        >
          📁 Pilih CSV
        </button>
        <p className="text-xs text-slate-500 mt-2">Format: .csv | Max: 5MB</p>
      </div>

      {/* Section 2: Workspace RKA */}
      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase mb-4">Workspace RKA</h3>
        <div className="space-y-3">
          {/* Program Dropdown */}
          <div>
            <label className="text-xs text-slate-400 block mb-1">Program</label>
            <select
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              className="w-full bg-slate-800 text-slate-100 border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition"
            >
              <option>Program 1</option>
              <option>Program 2</option>
              <option>Program 3</option>
            </select>
          </div>

          {/* Kegiatan Dropdown */}
          <div>
            <label className="text-xs text-slate-400 block mb-1">Kegiatan</label>
            <select
              value={kegiatan}
              onChange={(e) => setKegiatan(e.target.value)}
              className="w-full bg-slate-800 text-slate-100 border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition"
            >
              <option>Kegiatan 1</option>
              <option>Kegiatan 2</option>
              <option>Kegiatan 3</option>
            </select>
          </div>

          {/* KRO Dropdown */}
          <div>
            <label className="text-xs text-slate-400 block mb-1">KRO</label>
            <select
              value={kro}
              onChange={(e) => setKro(e.target.value)}
              className="w-full bg-slate-800 text-slate-100 border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition"
            >
              <option>KRO 1</option>
              <option>KRO 2</option>
              <option>KRO 3</option>
            </select>
          </div>

          {/* RO Dropdown */}
          <div>
            <label className="text-xs text-slate-400 block mb-1">RO</label>
            <select
              value={ro}
              onChange={(e) => setRo(e.target.value)}
              className="w-full bg-slate-800 text-slate-100 border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition"
            >
              <option>RO 1</option>
              <option>RO 2</option>
              <option>RO 3</option>
            </select>
          </div>

          {/* Komponen Dropdown */}
          <div>
            <label className="text-xs text-slate-400 block mb-1">Komponen</label>
            <select
              value={komponen}
              onChange={(e) => setKomponen(e.target.value)}
              className="w-full bg-slate-800 text-slate-100 border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition"
            >
              <option>Komponen 1</option>
              <option>Komponen 2</option>
              <option>Komponen 3</option>
            </select>
          </div>
        </div>

        {/* Generate oleh AI Button */}
        <button
          onClick={() => onGenerateKAK && onGenerateKAK({ program, kegiatan, kro, ro, komponen })}
          className="w-full px-4 py-3 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-500 transition flex items-center justify-center gap-2"
        >
          ✨ Generate oleh AI
        </button>
      </div>
    </div>
  );
}
