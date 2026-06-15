import PasswordChecker from '../features/passwords/PasswordChecker';

export default function PasswordsPage() {
  return (
    <div>
      <h1>🔑 Pwned Passwords</h1>
      <p>Find out if a password appears in known data breaches.</p>
      <PasswordChecker />
    </div>
  );
}
