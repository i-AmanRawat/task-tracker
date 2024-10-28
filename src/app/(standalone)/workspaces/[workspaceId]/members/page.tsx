import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";
import { MembersList } from "@/features/workspaces/components/members-list";

export default async function MembersPage() {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  //won't fetch the members server side this time rather will utilize client side this time would be helpful in infinite loading

  return (
    <div className="w-full lg:max-w-2xl">
      <MembersList />
    </div>
  );
}
