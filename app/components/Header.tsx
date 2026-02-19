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
        <div className="flex h-14 items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900 text-white font-bold">
              C
            </span>
            <div className="leading-tight">
              <div className="text-sm font-semibold">ClassAssist</div>
              <div className="text-[11px] text-gray-500">Lesson planning</div>
            </div>
          </Link>

          {/* Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "rounded-md px-3 py-2 text-sm font-medium transition",
                    active
                      ? "bg-gray-900 text-white"
                      : "text-gray-700 hover:bg-gray-100",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {!isLoggedIn ? (
              <Link
                href="/login"
                className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-50"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-50"
              >
                Logout
              </button>
            )}

            {/* Mobile menu simple fallback */}
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

  const Item = ({
    href,
    label,
  }: {
    href: string;
    label: string;
  }) => {
    const active =
      pathname === href || (href !== "/" && pathname?.startsWith(href));
    return (
      <Link
        href={href}
        onClick={() => setOpen(false)}
        className={[
          "block rounded-md px-3 py-2 text-sm font-medium",
          active ? "bg-gray-900 text-white" : "hover:bg-gray-100 text-gray-800",
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
        className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-50"
        aria-label="Menu"
      >
        Menu
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl border bg-white p-2 shadow-lg">
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
              className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium hover:bg-gray-100 text-gray-800"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </div>
  );
}
