import React, { useState, FormEvent } from 'react';
import styles from '../styles/PasswordShield.module.css';
import { verifyPassword } from '../utils/passwordVerify';

interface PasswordShieldProps {
  onAuthenticated: () => void;
}

export default function PasswordShield({ onAuthenticated }: PasswordShieldProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Add slight delay for better UX
    setTimeout(() => {
      if (verifyPassword(password)) {
        // Store authentication in localStorage
        localStorage.setItem('gameAuthenticated', 'true');
        onAuthenticated();
      } else {
        setError('Incorrect password');
        setPassword('');
      }
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className={styles.container}>
      <div className={styles.shield}>
        <h1 className={styles.title}>Password Required</h1>
        <p className={styles.subtitle}>Enter the password to access the content</p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className={styles.input}
            disabled={isLoading}
            autoFocus
          />
          
          {error && <div className={styles.error}>{error}</div>}
          
          <button 
            type="submit" 
            className={styles.button}
            disabled={isLoading || !password}
          >
            {isLoading ? 'Verifying...' : 'Enter'}
          </button>
        </form>
        
        <p className={styles.hint}>Hint: Default password is "demo123"</p>
      </div>
    </div>
  );
}
