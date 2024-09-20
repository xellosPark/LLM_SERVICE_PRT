import React from 'react';

const Sider = ({ isCollapsed, onToggle, onItemClick }) => {
  return (
    <aside className={`sider ${isCollapsed ? 'collapsed' : ''}`} style={styles.sider}>
      <button onClick={onToggle} style={styles.toggleButton}>
        {isCollapsed ? '열기' : '닫기'}
      </button>
      <ul style={styles.menu}>
        <li onClick={() => onItemClick('Sub1')} style={styles.menuItem}>Service</li>
        <li onClick={() => onItemClick('Sub2')} style={styles.menuItem}>Sub2</li>
        <li onClick={() => onItemClick('Sub3')} style={styles.menuItem}>Sub3</li>
        <li onClick={() => onItemClick('Sub4')} style={styles.menuItem}>Sub4</li>
      </ul>
    </aside>
  );
};

const styles = {
  sider: {
    width: '200px',
    background: '#2c3e50',
    color: 'white',
    padding: '20px',
  },
  toggleButton: {
    display: 'block',
    marginBottom: '20px',
    padding: '10px',
    backgroundColor: '#1abc9c',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  menu: {
    listStyleType: 'none',
    padding: 0,
  },
  menuItem: {
    padding: '10px',
    cursor: 'pointer',
    backgroundColor: '#34495e',
    marginBottom: '10px',
    textAlign: 'center',
    color: 'white',
  },
};

export default Sider;