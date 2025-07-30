import React, { useState, Component, useEffect} from 'react';
import '../css/TabsComponent.css';
import '../App.css';

function Tabs({ tabs, onTabChange }) {
  const [activeTab, setActiveTab] = useState();

  useEffect(() =>{
      setActiveTab(tabs[0]);
  }, [tabs])

  const handleTabClick = (item) => {
    if(activeTab!==item)
      setActiveTab(item);
    onTabChange(item);
  };

  return (
    <div className="tabs">
      {tabs?.map((tab, index) => (
        <button
          key={index}
          className={`tab-button ${activeTab === tab? 'active' : ''}`}
          onClick={() => handleTabClick(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export default Tabs;