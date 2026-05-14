import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import BottomPlayer from "../components/BottomPlayer";
import MobileNav from "../components/MobileNav";

export default function MainLayout({ children }) {
  return (
    <div className="bg-black text-white min-h-screen flex">
      {/* Desktop sidebar — hidden on mobile */}
      <Sidebar />

      <div className="flex-1 min-w-0">
        <Navbar />

        {/*
         * Bottom padding accounts for fixed bars:
         *   Mobile:  MobileNav (~60px) + BottomPlayer (68px) = ~140px → pb-36 (144px)
         *   Desktop: BottomPlayer (68px) → pb-20 (80px)
         */}
        <div className="p-4 pb-36 md:pb-24">
          {children}
        </div>

        {/* Mobile-only bottom tab navigation */}
        <MobileNav />

        {/* Fixed bottom music player (all screen sizes) */}
        <BottomPlayer />
      </div>
    </div>
  );
}