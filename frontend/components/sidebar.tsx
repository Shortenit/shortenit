"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  ChartBar,
  ChevronLeft,
  ChevronRight,
  Home,
  Link2,
  Plus,
  QrCode,
  Settings,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

import { useAuth } from "@/components/auth-provider";
import { ShieldCheck } from "lucide-react";

export default function Sidebar() {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { label: "Home", icon: <Home size={20} />, href: "/" },
    { label: "Links", icon: <Link2 size={20} />, href: "/links" },
    { label: "QR Codes", icon: <QrCode size={20} />, href: "/qrcodes" },
    { label: "Analytics", icon: <ChartBar size={20} />, href: "/analytics" },
    { label: "Settings", icon: <Settings size={20} />, href: "/settings" },
  ];

  if (user?.role === "ADMIN") {
      // Insert Admin before Settings (last item)
      navItems.splice(navItems.length - 1, 0, { label: "Admin", icon: <ShieldCheck size={20} />, href: "/admin/users" });
  }

  return (
    <aside
      className={`hidden md:flex ${
        collapsed ? "w-20" : "w-56"
      } bg-background border-r border-border transition-[width] duration-300 flex flex-col`}
    >
      {/* Logo Section */}
      <div className="p-2 border-border flex items-center justify-between">
        <div
          className={`flex items-center gap-2 ${
            collapsed ? "justify-center w-full" : ""
          }`}
        >
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
            <Image
              src="/shortenit.svg"
              className="w-5 h-5"
              width={20}
              height={20}
              alt="Logo"
            />
          </div>
          {!collapsed && (
            <span className="font-bold text-lg text-foreground">Shortenit</span>
          )}
        </div>
      </div>

      {/* Create New Button */}
      <div className="p-4 border-b border-border">
        <Link href="/links" className="block">
          <Button className="w-full bg-primary hover:cursor-pointer hover:bg-primary/80 text-primary-foreground">
            {collapsed ? <Plus /> : "Create New"}
          </Button>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href} className="block">
              <div
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted"
                } ${collapsed ? "justify-center" : ""}`}
              >
                {item.icon}
                {!collapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <div className="p-2 border-t border-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full p-2 rounded-lg hover:bg-muted text-foreground hover:cursor-pointer transition-colors flex items-center justify-center"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>
    </aside>
  );
}
