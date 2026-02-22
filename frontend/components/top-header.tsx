"use client";

import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, LogOut } from "lucide-react";

export default function TopHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  if (!user) return null;

  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <header className="bg-background border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      {/* Left - Spacer or Breadcrumbs could go here */}
      <div className="flex-1 max-w-md">
       
      </div>

      {/* Right - Actions & Profile */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-3 p-1.5 pr-3 hover:bg-muted/50 rounded-full border border-transparent hover:border-border hover:cursor-pointer transition-all duration-200 group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm group-hover:shadow-md transition-shadow">
              {userInitial}
            </div>
            <div className="flex flex-col items-start leading-none gap-0.5">
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {user.name}
                </span>
            </div>
            <span className="text-muted-foreground text-xs opacity-50 group-hover:opacity-100 transition-opacity">▼</span>
          </button>

          {showMenu && (
            <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-card rounded-xl shadow-xl border border-border z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-border bg-muted/30">
                    <p className="text-sm font-semibold text-foreground">
                    {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    <div className="mt-2 text-[10px] uppercase font-bold tracking-wider text-primary/80 bg-primary/10 inline-block px-2 py-0.5 rounded-full">
                        {user.role} Account
                    </div>
                </div>
                <div className="p-1">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 hover:cursor-pointer rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
                </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
