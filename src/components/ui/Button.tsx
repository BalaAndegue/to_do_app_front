"use client";
import React from "react";

export default function Button({ children, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`bg-yellow-400 hover:bg-orange-500 text-black font-bold py-2 px-4 rounded-xl border-2 border-yellow-400 transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
