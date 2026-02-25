"use client";

import React, { useState } from 'react';

export default function AIChat() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'ai',
      content:
        'Halo! Saya siap membantu Anda berdiskusi mengenai pengadaan alkes ini. Ada pertanyaan atau saran yang ingin Anda sampaikan?',
    },
    {
      id: '2',
      type: 'user',
      content: 'Apakah spesifikasi yang sudah kami tentukan sudah sesuai dengan standar?',
    },
    {
      id: '3',
      type: 'ai',
      content: 'Berdasarkan analisis, spesifikasi yang Anda tentukan 95% sesuai dengan standar internasional. Saya merekomendasikan penambahan klausa garansi sesuai standar ISO 9001.',
    },
  ]);

  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: String(messages.length + 1),
      type: 'user',
      content: inputValue,
    };

    setMessages([...messages, newMessage]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: String(prev.length + 1),
          type: 'ai',
          content: 'Terima kasih atas pertanyaannya. Saya sedang memproses informasi untuk memberikan jawaban terbaik...',
        },
      ]);
    }, 500);
  };

  return (
    <div className="w-[450px] bg-slate-900 border-l border-slate-700 flex flex-col overflow-hidden flex-shrink-0">
      {/* Header */}
      <div className="bg-slate-950 border-b border-slate-700 px-4 py-4">
        <h2 className="text-base font-semibold text-white">Chat</h2>
        <p className="text-xs text-slate-400 mt-1">Diskusi cepat dengan asisten</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.type === 'ai' && (
              <div className="w-7 h-7 rounded-full bg-blue-900 flex items-center justify-center flex-shrink-0 text-xs font-bold text-blue-300">
                AI
              </div>
            )}
            <div
              className={`max-w-xs rounded-lg px-3 py-2 text-sm ${
                msg.type === 'ai'
                  ? 'bg-slate-800 text-slate-100'
                  : 'bg-blue-600 text-white'
              }`}
            >
              <p className="whitespace-pre-line">{msg.content}</p>
            </div>
            {msg.type === 'user' && ( 
              <div className="w-7 h-7 rounded-full bg-teal-900 flex items-center justify-center flex-shrink-0 text-xs font-bold text-teal-300">
                U
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-700 bg-slate-950 p-3">
        <div className="flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Tulis pesan..."
            className="flex-1 bg-slate-800 text-slate-100 border border-slate-700 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:border-blue-500 max-h-24"
          />
          <button
            onClick={handleSendMessage}
            className="w-9 h-9 bg-blue-600 text-white rounded-md flex items-center justify-center hover:bg-blue-500 transition flex-shrink-0"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
