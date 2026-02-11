"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cog, History, Home } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/icons";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/history", label: "History", icon: History },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block font-headline">
              NutriSnap
            </span>
          </Link>
          <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center transition-colors hover:text-foreground/80",
                  pathname === href
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
           <Button variant="ghost" size="icon" asChild>
              <Link href="/settings">
                <Cog className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </Button>
        </div>
      </div>
    </header>
  );
}
