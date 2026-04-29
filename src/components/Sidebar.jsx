import React, { useState } from 'react';

const Sidebar = ({ buttons, title, subtitle }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile-Friendly Header */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '15px 20px', 
        background: 'white', 
        borderRadius: '15px', 
        marginBottom: '20px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
      }}>
        {/* Hamburger Menu Button */}
        <button 
          onClick={() => setIsOpen(true)}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '5px' }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1a365d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        
        {/* Title */}
        <div style={{ textAlign: 'center', flexGrow: 1, padding: '0 10px' }}>
          <h1 style={{ color: '#1a365d', fontSize: '1.4rem', margin: 0 }}>{title}</h1>
          {subtitle && <p style={{ fontSize: '0.9rem', color: '#666', margin: '5px 0 0 0' }}>{subtitle}</p>}
        </div>
        
        {/* Spacer for centering */}
        <div style={{ width: '32px' }}></div>
      </header>

      {/* Overlay Background */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9998, backdropFilter: 'blur(2px)' }}
        />
      )}

      {/* Sidebar Panel */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: isOpen ? 0 : '-300px',
        width: '280px',
        height: '100%',
        background: 'white',
        zIndex: 9999,
        transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '2px 0 15px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ padding: '25px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa' }}>
          <h2 style={{ margin: 0, color: '#1a365d', fontSize: '1.5rem' }}>Menü</h2>
          <button 
            onClick={() => setIsOpen(false)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e06666" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto' }}>
          {buttons.map((btn, index) => {
            if (btn.isHidden) return null;
            return (
              <button
                key={index}
                onClick={() => {
                  btn.onClick();
                  if (btn.closeOnClick !== false) setIsOpen(false);
                }}
                style={{
                  background: btn.background || '#f5f5f5',
                  color: btn.color || '#333',
                  border: 'none',
                  padding: '15px 20px',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                  transition: 'transform 0.1s'
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <span style={{ fontSize: '1.4rem' }}>{btn.icon}</span>
                {btn.label}
              </button>
            )
          })}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
