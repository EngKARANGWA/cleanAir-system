import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HeroSection from "./sections/HeroSection";
import FeaturesSection from "./sections/FeaturesSection";
import HowItWorksSection from "./sections/HowItWorksSection";
import StatsSection from "./sections/StatsSection";
import CTASection from "./sections/CTASection";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 text-slate-900 dark:text-white pt-20">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
