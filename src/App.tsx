import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { StickyBottomCta } from './components/StickyBottomCta';
import { RegisterModal } from './components/RegisterModal';
import { HeroSection } from './sections/HeroSection';
import { ProofSection } from './sections/ProofSection';
import { GrowthChartSection } from './sections/GrowthChartSection';
import { PainSection } from './sections/PainSection';
import { CurriculumSection } from './sections/CurriculumSection';
import { ShowcaseSection } from './sections/ShowcaseSection';
import { TargetSection } from './sections/TargetSection';
import { InstructorSection } from './sections/InstructorSection';
import { RegisterSection } from './sections/RegisterSection';
import { FaqSection } from './sections/FaqSection';
import { SuccessPage } from './pages/SuccessPage';

export const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Simple routing for /success and /checkout
  const pathname = window.location.pathname;
  if (pathname === '/success' || pathname === '/checkout') {
    return <SuccessPage />;
  }

  const openRegister = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-amber-400 selection:text-black">
      <Navbar onOpenRegister={openRegister} />
      <main>
        <HeroSection onOpenRegister={openRegister} />
        <ProofSection />
        <GrowthChartSection />
        <PainSection />
        <CurriculumSection onOpenRegister={openRegister} />
        <ShowcaseSection />
        <TargetSection />
        <InstructorSection />
        <RegisterSection />
        <FaqSection />
      </main>
      <Footer />
      <StickyBottomCta onOpenRegister={openRegister} />
      <RegisterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
