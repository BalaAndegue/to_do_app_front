"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function SideDrawer({ navLinks }: { navLinks: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="md:hidden mr-2 p-2 rounded-xl border-2 border-yellow-400 bg-white"
        onClick={() => setOpen(true)}
        aria-label="Ouvrir le menu"
      >
        <svg width="24" height="24" fill="none" stroke="#FDD835" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex">
          <nav className="bg-white w-64 h-full p-6 flex flex-col gap-4 border-r-2 border-yellow-400">
            <button className="self-end mb-4" onClick={() => setOpen(false)} aria-label="Fermer le menu">
              <svg width="24" height="24" fill="none" stroke="#FDD835" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 6l12 12M6 18L18 6"/></svg>
            </button>
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="text-black font-bold py-2 px-3 rounded hover:bg-yellow-100" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex-1" onClick={() => setOpen(false)} />
        </div>
      )}
    </>
  );
}
