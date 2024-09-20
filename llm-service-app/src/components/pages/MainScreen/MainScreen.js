import React, { useState, useEffect, Suspense, lazy } from 'react';
import Sider from './Sider'; // Sider component
import './MainScreen.css';  // Import the new CSS file

function MainScreen() {
  const [isCollapsed, setIsCollapsed] = useState(false);  // Sidebar state
  const [activeComponent, setActiveComponent] = useState(null);  // Active component state
  const [MainTitle, setMainTitle] = useState(''); // 새로운 상태 추가

  // Toggle Sidebar function
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Function to dynamically load components
  const loadComponent = (componentName) => {
    console.log(`Attempting to load component: ${componentName}`);
    switch (componentName) {
      case 'Sub1':
        setMainTitle("메일 Compliance 점검");
        return lazy(() => import('../Sub1/Sub1'));
      case 'Sub2':
        setMainTitle("Sub2");
        return lazy(() => import('../Sub2/Sub2'));
      case 'Sub3':
        setMainTitle("Sub3");
        return lazy(() => import('../Sub3/Sub3'));
      case 'Sub4':
        setMainTitle("Sub4");
        return lazy(() => import('../Sub4/Sub4'));
      default:
        console.log('Unknown component:', componentName);
        return null;
    }
  };

  // Handle menu item click
  const handleItemClick = (componentName) => {
    const Component = loadComponent(componentName);
    if (Component) {
      setActiveComponent(() => Component);
      //setMainTitle(componentName); // 헤더 제목 설정
      localStorage.setItem('activeComponent', componentName);  // Save selected component in localStorage
    } else {
      console.error(`Component not found: ${componentName}`);
    }
  };

  // Restore last selected component on page refresh
  useEffect(() => {
    const savedComponent = localStorage.getItem('activeComponent');
    if (savedComponent) {
      handleItemClick(savedComponent);
    } else {
      handleItemClick('Sub1');  // Load Sub1 by default
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ActiveComponent = activeComponent;

  return (
    <div className="container">
      <Sider
        isCollapsed={isCollapsed}
        onToggle={toggleSidebar}
        onItemClick={handleItemClick}  // Change component on Sider menu click
      />
      <div className="content">
        <div className="maintitle">
          <h1>{MainTitle}</h1>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          {ActiveComponent && <ActiveComponent />}  {/* Load selected component */}
        </Suspense>
      </div>
    </div>
  );
}

export default MainScreen;