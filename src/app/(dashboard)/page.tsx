import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/action";

export default async function Home() {
  const user = await getCurrent();

  if (!user) redirect("/sign-in");

  return <div className="h-full flex justify-center">This is a home page</div>;
}
