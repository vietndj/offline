import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './sections/HeroSection';
import { ProofSection } from './sections/ProofSection';
import { BannerCta } from './sections/BannerCta';
import { GrowthChartSection } from './sections/GrowthChartSection';
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

export const App: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const isSuccessPage = window.location.pathname === '/success';

  if (isSuccessPage) {
    return <SuccessPage />;
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-amber-500 selection:text-zinc-950">
      <Navbar onOpenRegister={() => setModalOpen(true)} />
      <main>
        <HeroSection onOpenRegister={() => setModalOpen(true)} />
        <ProofSection />
        <BannerCta onOpenRegister={() => setModalOpen(true)} title="Đăng Ký Giữ Chỗ Sớm — Chỉ Còn 5 Suất Cuối Cùng" badge="ƯU ĐÃI KHÓA HỌC OFFLINE" />
        <GrowthChartSection />
        <PainSection />
        <BannerCta onOpenRegister={() => setModalOpen(true)} title="Thực Hành Cầm Tay Chỉ Việc 1-1 Cùng Thầy Nguyễn Đức Việt" badge="PHÒNG STUDIO CHUẨN FEDU" />
        <CurriculumSection />
        <ShowcaseSection />
        <CaseStudySection />
        <TargetSection />
        <InstructorSection />
        <BannerCta onOpenRegister={() => setModalOpen(true)} title="Đóng Gói Chuyên Môn Của Bạn Thành Cỗ Máy Video Marketing Ngay Hôm Nay" badge="SĨ SỐ ≤ 30 HỌC VIÊN" />
        <RegisterSection />
        <FaqSection />
      </main>
      <Footer />
      <StickyBottomCta onOpenRegister={() => setModalOpen(true)} />
      <RegisterModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};
