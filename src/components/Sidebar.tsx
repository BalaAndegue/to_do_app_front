"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { label: "Dashboard", href: "/" },
        { label: "Boards", href: "/boards" },
        { label: "Profile", href: "/profile" },
    ];

    return (
        <aside className="w-64 h-full border-r border-[#e0e0e0] flex flex-col bg-white">
            <div className="p-6 border-b border-[#e0e0e0]">
                <h1 className="text-xl font-bold tracking-tight">TODO App</h1>
            </div>
            <nav className="flex-1 py-4">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`ibm-sidebar-item ${pathname === item.href ? "active" : ""}`}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>
            <div className="p-4 border-t border-[#e0e0e0] text-xs text-gray-500">
                IBM Carbon Inspired
            </div>
        </aside>
    );
}
