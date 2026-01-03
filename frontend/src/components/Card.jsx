import React from 'react';

export default function Card({ text }) {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white p-4 m-4">
      <p className="text-gray-800 text-lg">{text}</p>
    </div>
  );
}
