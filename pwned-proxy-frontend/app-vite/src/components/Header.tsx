import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header style={{ borderBottom: '1px solid #ccc', padding: '1rem' }}>
      <nav style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/">Home</Link>
        <Link to="/passwords">Passwords</Link>
        <Link to="/email">Email</Link>
        <Link to="/about">About</Link>
      </nav>
    </header>
  );
}
