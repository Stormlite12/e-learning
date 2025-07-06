import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h2>Hello</h2>
      <Button>Click on me</Button>
      <UserButton />
    </div>
  );
}
