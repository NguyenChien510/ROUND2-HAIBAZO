import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ onPageChange }) => {
  const [openSection, setOpenSection] = useState('Authors');
  const navigate = useNavigate();
  const location = useLocation();

  const sections = [
    { name: 'Authors', paths: ['/authors', '/authors/create'] },
    { name: 'Books', paths: ['/books', '/books/create'] },
    { name: 'Reviews', paths: ['/reviews', '/reviews/create'] }
  ];

  const handleSubClick = (name, sub, path) => {
    onPageChange(`${name} > ${sub}`);
    navigate(path);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3 style={{fontSize: '12px', color: '#64748b', textTransform: 'uppercase'}}>Management</h3>
      </div>

      <nav className="nav-section">
        {sections.map((section) => (
          <div key={section.name}>
            <div 
              className="nav-item" 
              onClick={() => setOpenSection(openSection === section.name ? '' : section.name)}
            >
              <b>{section.name}</b>
              <span>{openSection === section.name ? '▲' : '▼'}</span>
            </div>
            
            {openSection === section.name && (
              <div className="sub-nav">
                <div 
                  className={`sub-item ${location.pathname === section.paths[0] ? 'active' : ''}`}
                  onClick={() => handleSubClick(section.name, 'List', section.paths[0])}
                >
                  List
                </div>
                {section.paths[1] && (
                  <div 
                    className={`sub-item ${location.pathname === section.paths[1] ? 'active' : ''}`}
                    onClick={() => handleSubClick(section.name, 'Create', section.paths[1])}
                  >
                    Create
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
