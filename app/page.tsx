import About from "@/components/home/About";
import CTA from "@/components/home/CTA";
import Feature from "@/components/home/Feature";
import Footer from "@/components/home/Footer";
import Hero from "@/components/home/Hero";

export default function RootPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#111214] text-white overflow-hidden">
      <Hero />
      <About />
      <Feature />
      <CTA />
      <Footer />
    </div>
  );
}
