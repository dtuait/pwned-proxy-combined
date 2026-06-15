import { Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PasswordsPage from './pages/PasswordsPage';
import EmailPage from './pages/EmailPage';

export default function App() {
  return (
    <Routes>
      {/* This parent route has NO path — it just provides the layout.
          Its children render inside RootLayout's <Outlet />. */}
      <Route element={<RootLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/passwords" element={<PasswordsPage />} />
        <Route path="/email" element={<EmailPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>
    </Routes>
  );
}
