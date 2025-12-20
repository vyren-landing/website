import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Change from "@/components/Change";
import Toward from "@/components/Toward";
import Status from "@/components/Status";
import Docs from "@/components/Docs";
import Footer from "@/components/Footer";
import Divider from "@/components/Divider";

export default function Home() {
  return (
    <main className="bg-black text-white">
      <Hero />

      <Divider />
      <Problem />

      <Change />

      <Divider />
      <Toward />

      <Divider />
      <Status />

      <Docs />
      <Footer />
    </main>
  );
}
