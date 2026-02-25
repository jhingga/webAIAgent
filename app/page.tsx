"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Workspace from "@/components/Workspace";
import AIChat from "@/components/AIChat";

export default function Home() {
  const [kakData, setKakData] = useState(null);

  const handleGenerateKAK = (data) => {
    setKakData(data);
  };

  return (
    <div className="h-screen bg-slate-950 text-white flex overflow-hidden">
      <Sidebar onGenerateKAK={handleGenerateKAK} />
      <Workspace generateKAKData={kakData} />
      <AIChat />
    </div>
  );
}
