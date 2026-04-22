import React from 'react';

const Header = ({ title }) => {
  return (
    <div className="header">
      <h2 style={{ fontWeight: 700, letterSpacing: '1px' }}>{title}</h2>
      <div className="user-profile" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ width: '32px', height: '32px', background: '#334155', borderRadius: '50%' }}></div>
        <span style={{ fontSize: '14px', fontWeight: 500 }}>Admin</span>
      </div>
    </div>
  );
};

export default Header;
