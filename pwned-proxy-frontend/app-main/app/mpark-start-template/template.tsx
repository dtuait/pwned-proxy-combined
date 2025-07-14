import React, { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');

  const handleClick = () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      alert('Please enter an email address!');
      return;
    }
    alert(`You entered: ${trimmedEmail}`);
  };

  return (
    <>
      <style jsx global>{`
        html,
        body {
          margin: 0;
          padding: 0;
          font-family: 'Arial', sans-serif;
          height: 100%;
          width: 100%;
          background: #f7f7f7; /* Light gray background */
          color: #333333; /* Dark text color */
          text-align: center;
        }
      `}</style>

      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          box-sizing: border-box;
          padding: 0 20px;
        }

        .title {
          font-size: 2.5rem;
          margin: 0 0 0.5rem;
          font-weight: bold;
          color: #990000; /* DTU red */
        }

        .subtitle {
          font-size: 1.2rem;
          margin: 0 0 2rem;
          color: #333333;
        }

        .search-box {
          display: inline-flex;
          align-items: center;
          border-radius: 4px;
          overflow: hidden;
          background: #ffffff;
          max-width: 400px;
          width: 100%;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow */
        }

        .search-box input {
          flex: 1;
          border: 1px solid #cccccc;
          outline: none;
          padding: 12px;
          font-size: 1rem;
          color: #333333;
        }

        .search-box button {
          background-color: #990000; /* DTU red */
          border: none;
          color: #ffffff;
          font-size: 1rem;
          padding: 12px 16px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .search-box button:hover {
          background-color: #660000; /* Darker DTU red */
        }

        @media (max-width: 500px) {
          .title {
            font-size: 2rem;
          }
          .subtitle {
            font-size: 1rem;
          }
        }
      `}</style>

      <div className="container">
        <h1 className="title">';-- have i been pwned?</h1>
        <p className="subtitle">Check if your email address is in a data breach</p>
        <div className="search-box">
          <input
            type="text"
            placeholder="email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleClick}>pwned?</button>
        </div>
      </div>
    </>
  );
}