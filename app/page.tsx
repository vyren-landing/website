import Hero from "@/components/Hero";
import Architecture from "@/components/Architecture";
import Why from "@/components/Why";
import Status from "@/components/Status";
import Docs from "@/components/Docs";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Hero />
      <Architecture />
      <Why />
      <Status />
      <Docs />
      <Footer />
    </main>
  );
}
