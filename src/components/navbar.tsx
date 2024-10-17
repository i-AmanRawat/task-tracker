import { UserButton } from "@/features/auth/components/user-button";
import { MoblileSidebar } from "./mobile-sidebar";

export function Navbar() {
  return (
    <nav className="pt-4 px-6 flex items-center justify-between w-full">
      <div className="flex-col hidden lg:flex">
        <h1 className="text-2xl font-semibold ">Home</h1>
        <p className="text-muted-foreground">
          Monitor all of your project and tasks here
        </p>
      </div>
      <MoblileSidebar />
      <UserButton />
    </nav>
  );
}
