"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const pathname = usePathname();
  const isSignUp = pathname === "/sign-up";

  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex items-center justify-between">
          <Image
            width={152}
            height={56}
            src={"/task-tracker-01.svg"}
            alt="logo"
            className="rounded-md border"
          />
          <Button asChild variant="secondary">
            <Link href={isSignUp ? "/sign-in" : "/sign-up"}>
              {isSignUp ? "Sign In" : "Sign Up"}
            </Link>
          </Button>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          {children}
        </div>
      </div>
    </main>
  );
}
