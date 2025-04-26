import React, { useState, Component, useEffect} from 'react';
import '../css/Tabs_component.css';
import '../App.css';

function Tabs({ tabs, onTabChange }) {
  const [activeTab, setActiveTab] = useState();
  const [firstTabComing, setFirstTabComing] = useState(true);

  useEffect(() =>{
    if(tabs.length===0)
      setFirstTabComing(true);
    else if(tabs.length===1 && firstTabComing)
      setActiveTab(tabs[0]);
    else if(tabs.length>1)
      setFirstTabComing(false);
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