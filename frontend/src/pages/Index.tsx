import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import GallerySection from "@/components/GallerySection";
import RoomsGallery from "@/components/RoomsGallery";
import AmenitiesSection from "@/components/AmenitiesSection";
import LocationSection from "@/components/LocationSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <GallerySection />
      <RoomsGallery />
      <AmenitiesSection />
      <LocationSection />
      <ContactSection />
      <Footer />
      <Toaster />
    </div>
  );
};

export default Index;