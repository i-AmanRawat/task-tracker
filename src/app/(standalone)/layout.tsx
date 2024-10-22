import Image from "next/image";
import Link from "next/link";

interface StandaloneLayoutProps {
  children: React.ReactNode;
}
export default function StandaloneLayout({ children }: StandaloneLayoutProps) {
  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl h-full p-4">
        <nav className="flex justify-between items-center h-[73px]">
          <Link href="/">
            <Image
              src={"/task-tracker-01.svg"}
              width={152}
              height={56}
              alt="logo"
            />
          </Link>
        </nav>
        <div className="flex flex-col items-center justify-center py-4">
          {children}
        </div>
      </div>
    </main>
  );
}
