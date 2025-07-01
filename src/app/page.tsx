import ChatContainer from "@/components/ChatContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flixscode.id - Transform Ideas into UI/UX",
  description: "Transform your ideas into stunning UI/UX with a single prompt",
};

export default function Home() {
  return (
    <main className="h-screen">
      <ChatContainer />
    </main>
  );
}
