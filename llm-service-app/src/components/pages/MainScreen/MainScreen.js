import React, { useState, Suspense, lazy } from 'react';
import Sider from './Sider'; // Sider 컴포넌트 추가

function MainScreen() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeComponent, setActiveComponent] = useState(null);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const loadComponent = (componentName) => {
    console.log(`컴포넌트 로드 시도: ${componentName}`);
    switch (componentName) {
      case 'Sub1':
        console.log('Sub1 컴포넌트 로드');
        return lazy(() => import('../Sub1/Sub1'));
      case 'Sub2':
        console.log('Sub2 컴포넌트 로드');
        return lazy(() => import('../Sub2/Sub2'));
      case 'Sub3':
        console.log('Sub3 컴포넌트 로드');
        return lazy(() => import('../Sub3/Sub3'));
      case 'Sub4':
        console.log('Sub4 컴포넌트 로드');
        return lazy(() => import('../Sub4/Sub4'));
      default:
        console.log('알 수 없는 컴포넌트:', componentName);
        return null;
    }
  };

  const handleItemClick = (componentName) => {
    const Component = loadComponent(componentName);
    if (Component) {
      setActiveComponent(() => Component);
    }
  };

  const ActiveComponent = activeComponent;

  return (
    <div style={styles.container}>
      <Sider
        isCollapsed={isCollapsed}
        onToggle={toggleSidebar}
        onItemClick={handleItemClick}
      />
      <div style={styles.content}>
        <Suspense fallback={<div>로딩 중...</div>}>
          {ActiveComponent && <ActiveComponent />}
        </Suspense>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
  },
  content: {
    flex: 1,
    padding: '20px',
    paddingTop: '80px', // 상단 고정된 헤더 아래로 여백 설정
    backgroundColor: '#ecf0f1',
  },
};

export default MainScreen;
