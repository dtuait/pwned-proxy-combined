import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function RootLayout() {
  return (
    <div>
      <Header />
      <main style={{ padding: '1rem' }}>
        <Outlet /> {/* the current page gets injected RIGHT HERE */}
      </main>
      <Footer />
    </div>
  );
}
