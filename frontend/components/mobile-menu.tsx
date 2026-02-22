"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

import { Home, Link2, BarChart2, Settings, QrCode } from "lucide-react";



import { useAuth } from "@/components/auth-provider";
import { ShieldCheck } from "lucide-react";

export default function MobileMenu() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: "Home", icon: <Home className="w-5 h-5" />, href: "/" },
    { label: "Links", icon: <Link2 className="w-5 h-5" />, href: "/links" },
    { label: "QR Codes", icon: <QrCode className="w-5 h-5" />, href: "/qrcodes" },
    { label: "Analytics", icon: <BarChart2 className="w-5 h-5" />, href: "/analytics" },
    { label: "Settings", icon: <Settings className="w-5 h-5" />, href: "/settings" },
  ];

  if (user?.role === "ADMIN") {
      // Insert Admin before Settings
      navItems.splice(navItems.length - 1, 0, { label: "Admin", icon: <ShieldCheck className="w-5 h-5" />, href: "/admin/users" });
  }

  return (
    <>
      {/* Header */}
      <div className="bg-background border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            S
          </div>
          <span className="font-bold text-lg text-foreground">Shortenit</span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 hover:bg-muted rounded-lg text-foreground hover:cursor-pointer"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {open && (
        <div className="bg-background border-b border-border">
          <nav className="flex flex-col p-2 space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                >
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-border">
            <Link href="/links">
              <Button className="w-full bg-primary hover:bg-primary/80 hover:cursor-pointer text-primary-foreground">
                Create new
              </Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
