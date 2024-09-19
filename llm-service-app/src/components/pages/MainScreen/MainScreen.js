import React, { useState, useEffect, Suspense, lazy } from 'react';
import Sider from './Sider'; // Sider 컴포넌트 추가

function MainScreen() {
  const [isCollapsed, setIsCollapsed] = useState(false);  // 사이드바 상태
  const [activeComponent, setActiveComponent] = useState(null);  // 활성화된 컴포넌트

  // 사이드바 토글 함수
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // 컴포넌트 동적 로드 함수
  const loadComponent = (componentName) => {
    console.log(`컴포넌트 로드 시도: ${componentName}`);
    switch (componentName) {
      case 'Sub1':
        return lazy(() => import('../Sub1/Sub1'));
      case 'Sub2':
        return lazy(() => import('../Sub2/Sub2'));
      case 'Sub3':
        return lazy(() => import('../Sub3/Sub3'));
      case 'Sub4':
        return lazy(() => import('../Sub4/Sub4'));
      default:
        console.log('알 수 없는 컴포넌트:', componentName);
        return null;
    }
  };

  // 메뉴 항목 클릭 시 호출되는 함수
  const handleItemClick = (componentName) => {
    const Component = loadComponent(componentName);
    if (Component) {
      setActiveComponent(() => Component);
      localStorage.setItem('activeComponent', componentName); // 로컬 스토리지에 선택한 컴포넌트 저장
    } else {
      console.error(`컴포넌트를 찾을 수 없습니다: ${componentName}`);
    }
  };

  // 페이지 새로고침 시 로컬 스토리지에서 마지막으로 선택된 컴포넌트 복원
  useEffect(() => {
    const savedComponent = localStorage.getItem('activeComponent');
    if (savedComponent) {
      handleItemClick(savedComponent);
    } else {
      handleItemClick('Sub1'); // 기본적으로 Sub1 컴포넌트 로드
    }
  }, []);

  const ActiveComponent = activeComponent;

  return (
    <div style={styles.container}>
      <Sider
        isCollapsed={isCollapsed}
        onToggle={toggleSidebar}
        onItemClick={handleItemClick}  // Sider에서 메뉴 클릭 시 컴포넌트 변경
      />
      <div style={styles.content}>
        <Suspense fallback={<div>로딩 중...</div>}>
          {ActiveComponent && <ActiveComponent />}  {/* 선택된 컴포넌트 로드 */}
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
