import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/action";
import { SignUpCard } from "@/features/auth/components/sign-up-card";

export default async function SignUpPage() {
  const user = await getCurrent();

  if (user) redirect("/");

  return <SignUpCard />;
}
