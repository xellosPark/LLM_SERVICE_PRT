import React from 'react';

function Header() {
  return (
    <header style={styles.header}>
      <div>
        UbiSam
      </div>
      <div style={styles.userSection}>
        <span style={styles.userName}>UbiSam</span>
        <button style={styles.logoutButton}>로그아웃</button>
      </div>
    </header>
  );
}

const styles = {
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '60px',
    backgroundColor: '#34495e',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    color: '#ecf0f1',
    zIndex: 1000,
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    marginLeft: '10px',
    fontSize: '18px',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
  },
  userName: {
    marginRight: '10px',
    backgroundColor: '#7f8c8d',
    padding: '5px 10px',
    borderRadius: '5px',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    color: '#ecf0f1',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
  },
};

export default Header;