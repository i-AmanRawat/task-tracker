import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="w-full h-full flex items-center justify-center gap-10">
      <Button variant={"primary"}>primary</Button>
      <Button variant={"destructive"}>destructive</Button>
      <Button variant={"ghost"}>ghost</Button>
      <Button variant={"muted"}>muted</Button>
      <Button variant={"outline"}>outline</Button>
      <Button variant={"secondary"}>secondary</Button>
      <Button variant={"teritary"}>teritary</Button>
    </div>
  );
}
