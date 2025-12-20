import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Change from "@/components/Change";
import Toward from "@/components/Toward";
import Status from "@/components/Status";
import Docs from "@/components/Docs";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-black text-white">
      <Hero />
      <Problem />
      <Change />
      <Toward />
      <Status />
      <Docs />
      <Footer />
    </main>
  );
}
