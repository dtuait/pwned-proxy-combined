import EmailChecker from '../features/email/EmailChecker';

export default function EmailPage() {
  return (
    <div>
      <h1>Email Breach Check</h1>
      <p>Check if your email address has been compromised in a data breach.</p>
      <EmailChecker />
    </div>
  );
}
