import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PublicHome } from './components/PublicHome';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminAuthModal } from './components/admin/AdminAuthModal';
import { AuthPage } from './components/pages/AuthPage';
import { HowItWorksPage } from './components/pages/HowItWorksPage';
import { FeaturesPage } from './components/pages/FeaturesPage';
import { PricingPage } from './components/pages/PricingPage';
import { FaqPage } from './components/pages/FaqPage';
import { ContactPage } from './components/pages/ContactPage';
import { LegalPage } from './components/pages/LegalPage';
import { LogoutPage } from './components/pages/LogoutPage';
import { MetaConnectModal } from './components/MetaConnectModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AiCodeCursor } from './components/AiCodeCursor';
import { motion, AnimatePresence } from 'motion/react';

const AppContent: React.FC = () => {
  const { currentView, isAdminAuthModalOpen, closeAdminAuthModal } = useApp();

  const isLegalView = ['privacy', 'terms', 'refund', 'data-deletion'].includes(currentView);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#141413] selection:bg-[#CC785C]/20 selection:text-[#CC785C] pb-16 md:pb-0 relative overflow-x-hidden">
      {/* High-Tech AI & Programming Custom Cursor */}
      <AiCodeCursor />

      <Navbar />

      <main className="flex-1 w-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 14, filter: 'blur(3px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(3px)' }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {currentView === 'home' && <PublicHome />}
            {currentView === 'how-it-works' && <HowItWorksPage />}
            {currentView === 'features' && <FeaturesPage />}
            {currentView === 'pricing' && <PricingPage />}
            {currentView === 'faq' && <FaqPage />}
            {currentView === 'contact' && <ContactPage />}
            {currentView === 'auth' && <AuthPage />}
            {currentView === 'logout' && <LogoutPage />}
            {isLegalView && <LegalPage />}
            {currentView === 'dashboard' && <UserDashboard />}
            {currentView === 'admin' && <AdminDashboard />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />

      {/* Global Meta Modal */}
      <MetaConnectModal />

      {/* Secret Admin Authentication Modal (unlocked via 6 clicks on logo/notification) */}
      <AdminAuthModal isOpen={isAdminAuthModalOpen} onClose={closeAdminAuthModal} />

      {/* Fully Automatic Responsive Mobile Bottom Navigation for small screens */}
      <div className="md:hidden">
        <MobileBottomNav />
      </div>
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
