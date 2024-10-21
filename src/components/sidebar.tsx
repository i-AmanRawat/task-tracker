import Image from "next/image";
import Link from "next/link";

import { DottedSeparator } from "./dotted-separator";
import { Navigation } from "./navigation";
import { WorkspaceSwitcher } from "./workspace-switcher";

export function Sidebar() {
  return (
    <aside className="w-full h-full bg-neutral-100 p-4">
      <Link href="/">
        <Image
          src="/task-tracker-01.svg"
          width={164}
          height={48}
          className="rounded-md border"
          alt="logo"
        />
      </Link>
      <DottedSeparator className="my-4" />
      <WorkspaceSwitcher />
      <DottedSeparator className="my-4" />
      <Navigation />
    </aside>
  );
}
