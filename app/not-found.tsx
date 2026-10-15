import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import NotFoundContent from './(public)/not-found';

export default function RootNotFound() {
  return (
    <>
      <Navbar />
      <NotFoundContent />
      <Footer />
    </>
  );
}

