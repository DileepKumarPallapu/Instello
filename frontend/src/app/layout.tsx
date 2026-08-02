import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { CreatePostModal } from '@/components/feed/CreatePostModal';
import { AuthModal } from '@/components/auth/AuthModal';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { VideoCallModal } from '@/components/chat/VideoCallModal';

export const metadata: Metadata = {
  title: 'Instello - Next-Gen Social App',
  description: 'Instello designed and created by Pallapu Dileep Kumar. Built with Next.js 15, React 19 & Express.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0B0F17] text-slate-100 min-h-screen relative selection:bg-indigo-500 selection:text-white">
        
        {/* Ambient Background Glows */}
        <div className="glow-blob glow-indigo w-[500px] h-[500px] -top-20 -left-20" />
        <div className="glow-blob glow-pink w-[400px] h-[400px] top-1/3 -right-20" />
        <div className="glow-blob glow-purple w-[600px] h-[600px] -bottom-20 left-1/3" />

        <Providers>
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1 max-w-7xl w-full mx-auto flex gap-6 px-4">
              <Sidebar />
              <main className="flex-1 py-6 max-w-2xl mx-auto w-full">
                {children}
              </main>
            </div>
          </div>
          <CreatePostModal />
          <AuthModal />
          <EditProfileModal />
          <VideoCallModal />
        </Providers>
      </body>
    </html>
  );
}
