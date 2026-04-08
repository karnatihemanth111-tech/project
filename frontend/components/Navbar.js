"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/map",         label: "Map",       icon: "🗺️"  },
  { href: "/search",      label: "Search",    icon: "🔍"  },
  { href: "/events",      label: "Events",    icon: "📅"  },
  { href: "/qr-scanner",  label: "QR Scan",   icon: "📷"  },
  { href: "/emergency",   label: "Emergency", icon: "🚨"  },
  { href: "/about",       label: "About",     icon: "ℹ️"  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-950 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:bg-blue-500 transition-colors">
              CN
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">
              Campus <span className="text-blue-400">Nav</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const isEmergency = link.href === "/emergency";
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isEmergency
                      ? isActive
                        ? "bg-red-600 text-white"
                        : "text-red-400 hover:bg-red-950 hover:text-red-300"
                      : isActive
                        ? "bg-gray-800 text-white"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }
                  `}
                >
                  <span className="text-base">{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
              <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 pb-4 pt-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const isEmergency = link.href === "/emergency";
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium mb-1 transition-all
                  ${isEmergency
                    ? isActive
                      ? "bg-red-600 text-white"
                      : "text-red-400 hover:bg-red-950"
                    : isActive
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }
                `}
              >
                <span className="text-lg">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}