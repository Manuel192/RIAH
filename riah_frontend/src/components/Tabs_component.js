import React, { useState } from 'react';
import '../App.css';

function Tabs({ tabs, onTabChange }) {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
    onTabChange(index);
  };

  return (
    <div className="tabs">
      {tabs.map((tab, index) => (
        <button
          key={index}
          className={`tab-button ${activeTab === index ? 'active' : ''}`}
          onClick={() => handleTabClick(index)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export default Tabs;