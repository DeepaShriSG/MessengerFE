import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = ({ statusCode, message }) => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Oops! {statusCode} Error</h1>
      <p style={styles.message}>{message}</p>
      <p style={styles.message}>Please try refreshing the page, or go back to <Link to="/" style={styles.link}>home</Link>.</p>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
  },
  heading: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  message: {
    fontSize: '1.2rem',
    marginBottom: '0.5rem',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

export default ErrorPage;