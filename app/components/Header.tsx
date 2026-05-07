"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

export default function Header() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  const nav = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/dashboard", label: "Dashboard" },
      { href: "/new", label: "New Lesson" },
    ],
    []
  );

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white shadow-sm">
              C
            </span>

            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">
                ClassAssist
              </div>
              <div className="text-xs text-gray-500">
                AI lesson planning
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border bg-white p-1 shadow-sm md:flex">
            {nav.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "rounded-full px-3 py-2 text-sm font-medium transition",
                    active
                      ? "bg-slate-950 text-white"
                      : "text-gray-700 hover:bg-gray-100",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {!isLoggedIn ? (
              <Link
                href="/login"
                className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50"
              >
                Logout
              </button>
            )}

            <div className="md:hidden">
              <MobileMenu
                pathname={pathname}
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileMenu({
  pathname,
  isLoggedIn,
  onLogout,
}: {
  pathname: string | null;
  isLoggedIn: boolean;
  onLogout: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);

  const Item = ({ href, label }: { href: string; label: string }) => {
    const active =
      pathname === href || (href !== "/" && pathname?.startsWith(href));

    return (
      <Link
        href={href}
        onClick={() => setOpen(false)}
        className={[
          "block rounded-lg px-3 py-2 text-sm font-medium",
          active ? "bg-slate-950 text-white" : "text-gray-800 hover:bg-gray-100",
        ].join(" ")}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50"
        aria-label="Menu"
      >
        Menu
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl border bg-white p-2 shadow-lg">
          <Item href="/" label="Home" />
          <Item href="/dashboard" label="Dashboard" />
          <Item href="/new" label="New Lesson" />

          <div className="my-2 border-t" />

          {!isLoggedIn ? (
            <Item href="/login" label="Login" />
          ) : (
            <button
              onClick={async () => {
                await onLogout();
                setOpen(false);
              }}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-800 hover:bg-gray-100"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </div>
  );
}