import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PublicHome } from './components/PublicHome';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AuthPage } from './components/pages/AuthPage';
import { HowItWorksPage } from './components/pages/HowItWorksPage';
import { FeaturesPage } from './components/pages/FeaturesPage';
import { PricingPage } from './components/pages/PricingPage';
import { FaqPage } from './components/pages/FaqPage';
import { ContactPage } from './components/pages/ContactPage';
import { LegalPage } from './components/pages/LegalPage';
import { MetaConnectModal } from './components/MetaConnectModal';
import { MobileBottomNav } from './components/MobileBottomNav';

const AppContent: React.FC = () => {
  const { currentView, deviceMode } = useApp();

  const isLegalView = ['privacy', 'terms', 'refund', 'data-deletion'].includes(currentView);

  return (
    <div className={`min-h-screen flex flex-col bg-[#FAF9F5] text-[#141413] selection:bg-[#CC785C]/20 selection:text-[#CC785C] ${
      deviceMode === 'mobile' ? 'pb-20' : 'pb-0'
    }`}>
      <Navbar />

      <main className="flex-1">
        {currentView === 'home' && <PublicHome />}
        {currentView === 'how-it-works' && <HowItWorksPage />}
        {currentView === 'features' && <FeaturesPage />}
        {currentView === 'pricing' && <PricingPage />}
        {currentView === 'faq' && <FaqPage />}
        {currentView === 'contact' && <ContactPage />}
        {currentView === 'auth' && <AuthPage />}
        {isLegalView && <LegalPage />}
        {currentView === 'dashboard' && <UserDashboard />}
        {currentView === 'admin' && <AdminDashboard />}
      </main>

      <Footer />

      {/* Global Meta Modal */}
      <MetaConnectModal />

      {/* Mobile Web App Bottom Navigation */}
      {deviceMode === 'mobile' && <MobileBottomNav />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
