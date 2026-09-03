import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './sections/HeroSection';
import { ProofSection } from './sections/ProofSection';
import { DefinitionSection } from './sections/DefinitionSection';
import { GrowthChartSection } from './sections/GrowthChartSection';
import { MetaphorsSection } from './sections/MetaphorsSection';
import { PainSection } from './sections/PainSection';
import { CurriculumSection } from './sections/CurriculumSection';
import { ShowcaseSection } from './sections/ShowcaseSection';
import { CaseStudySection } from './sections/CaseStudySection';
import { TargetSection } from './sections/TargetSection';
import { InstructorSection } from './sections/InstructorSection';
import { RegisterSection } from './sections/RegisterSection';
import { FaqSection } from './sections/FaqSection';
import { Footer } from './components/Footer';
import { StickyBottomCta } from './components/StickyBottomCta';
import { RegisterModal } from './components/RegisterModal';
import { SuccessPage } from './pages/SuccessPage';
import { BannerCta } from './sections/BannerCta';

export function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState<'landing' | 'success'>('landing');

  // Check URL query on mount (for success redirect if needed)
  React.useEffect(() => {
    if (window.location.pathname === '/success') {
      setPage('success');
    }
  }, []);

  if (page === 'success') {
    return <SuccessPage onBackHome={() => {
      window.history.pushState({}, '', '/');
      setPage('landing');
    }} />;
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-orange-500 selection:text-black">
      <Navbar onOpenRegister={() => setModalOpen(true)} />
      
      <main>
        <HeroSection onOpenRegister={() => setModalOpen(true)} />
        <ProofSection />
        <DefinitionSection onOpenRegister={() => setModalOpen(true)} />
        <GrowthChartSection />
        <MetaphorsSection onOpenRegister={() => setModalOpen(true)} />
        <PainSection />
        <CurriculumSection onOpenRegister={() => setModalOpen(true)} />
        <BannerCta onOpenRegister={() => setModalOpen(true)} title="Thực hành cầm tay chỉ việc 1-1 cùng Nguyễn Đức Việt" badge="PHÒNG STUDIO CHUYÊN NGHIỆP" />
        <ShowcaseSection />
        <TargetSection />
        <InstructorSection />
        <RegisterSection />
        <FaqSection />
      </main>

      <Footer />
      <StickyBottomCta onOpenRegister={() => setModalOpen(true)} />
      <RegisterModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

export default App;
