"use client";
import React from "react";

export default function Card({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-white border-2 border-yellow-400 rounded-xl shadow-sm p-4 text-black ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
