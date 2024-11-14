import React, { useState, useEffect, Suspense, lazy } from 'react';
import Sider from './Sider'; // Sider component
import './MainScreen.css';  // Import the new CSS file
import Loading from '../../../logos/loading_light.png'
import { BsChevronRight } from "react-icons/bs";

function MainScreen({ setActivePage, activePage }) {
  const [isCollapsed, setIsCollapsed] = useState(false);  // Sidebar state
  const [activeComponent, setActiveComponent] = useState(null);  // Active component state
  const [MainTitle, setMainTitle] = useState(''); // 새로운 상태 추가
  //const [activePage, setActivePage] = useState('DashBoard'); // 현재 페이지 상태 추가
  const [subPage, setSubPage] = useState('Default');
  const [isActivePage, setIsActivePage] = useState(false);

  const [navigationStack, setNavigationStack] = useState([]); // 네비게이션 히스토리를 저장하는 상태

  // 항목 클릭을 처리하고 네비게이션 스택을 업데이트하는 함수
  const handleItemClick = (componentName) => {
    setActivePage(componentName); // 활성 페이지 업데이트

    // 이전 스택에 새 컴포넌트 이름을 추가하여 네비게이션 스택 저장
    setNavigationStack((prevStack) => [...prevStack, componentName]);
  };

  // 전체 네비게이션 스택을 로그로 출력하는 함수
  const logNavigationStack = () => {
    console.log("🔍 현재 네비게이션 스택:", navigationStack);
  };


  // Toggle Sidebar function
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Function to dynamically load components
  const loadComponent = (componentName) => {
    console.log(`컴포넌트를 로드하려고 시도 중: ${componentName}`);
    setActivePage(componentName);  // 페이지 상태 업데이트
    switch (componentName) {
      // case 'DashBoard':
      //   setMainTitle("Mail Compliance 점검  / PIE 챗봇");
      //   return lazy(() => import('../dashboard/DashBoard'));
      case 'DashBoard':
        setMainTitle("Mail Compliance 점검");  // Mail Compliance 점검 타이틀
        return lazy(() => import('../dashboard/DashBoard'));
      case 'PIEChatbot':
        setMainTitle("PIE 챗봇");  // PIE 챗봇 타이틀
        return lazy(() => import('../dashboard/PIEChatbot')); // 새로운 PIE Chatbot 컴포넌트
      case 'LLMOPS':
        setMainTitle("LLMOPS");
        return lazy(() => import('../dashboard/LLMOPS'));
      case 'Evaluation':
        setMainTitle("Mail Compliance 점검 - Evaluation");
        return lazy(() => import('../dashboard/EvalDashBoard'));
      case 'Sub4':
        setMainTitle("Sub4");
        return lazy(() => import('../Sub4/Sub4'));
      // case 'Create':
      //   setMainTitle("신규 점검 생성");
      //   return lazy(() => import('../dashboard/Inspection'));
      default:
        console.log('Unknown component:', componentName);
        return null;
    }
  };

  // // Handle menu item click
  // const handleItemClick = (componentName) => {
  //   setSubPage('Default');
  //   setIsActivePage(false);
  //   const Component = loadComponent(componentName);
  //   if (Component) {
  //     setActiveComponent(() => Component);
  //     //setMainTitle(componentName); // 헤더 제목 설정
  //     localStorage.setItem('activeComponent', componentName);  // Save selected component in localStorage
  //   } else {
  //     console.error(`Component not found: ${componentName}`);
  //   }
  // };

  // Restore last selected component on page refresh
  useEffect(() => {
    const savedComponent = localStorage.getItem('activeComponent');
    if (savedComponent) {
      handleItemClick(savedComponent);
    } else {
      handleItemClick('DashBoard');  // Load Sub1 by default
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage]);

  const ActiveComponent = activeComponent;

  return (
    <div className="container">
      <Sider
        isCollapsed={isCollapsed}
        onToggle={toggleSidebar}
        onItemClick={handleItemClick}  // Change component on Sider menu click
        logNavigationStack={logNavigationStack} // 로그 함수 전달
      />
      <div className="content">
        {/* <div className="maintitle">
          <h1>{MainTitle}</h1>
        </div> */}
        {/* Navigation bar - 조건적으로 DashBoard에서만 표시 */}
        {activePage === 'DashBoard' || activePage === 'PIEChatbot' ? (
          <div className="navigation-bar">
            <div className="navigation-title">
              {
                isActivePage === false ? (
                  <>
                    <button onClick={() => handleItemClick('DashBoard')} className={`nav-item ${activePage === 'DashBoard' ? 'active' : ''}`}>
                      Mail Compliance 점검
                    </button>
                    <div className="separator"></div>
                    <button onClick={() => handleItemClick('PIEChatbot')} className={`nav-item ${activePage === 'PIEChatbot' ? 'active' : ''}`}>
                      PIE 챗봇
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleItemClick('DashBoard')} className="nav-item-create">
                      Mail Compliance 점검
                    </button>
                    <BsChevronRight className="nav-item-create-header" />
                    
                    
                    <div className="nav-item-create-active">신규 점검 생성</div>
                  </>
                )
              }

            </div>
          </div>
        ) : (
          <div className="maintitle">
            <div>{MainTitle}</div>
          </div>
        )}


        <Suspense fallback={
          <div className='fail-loading'>
            <div className='centered-fallback'>
              <img src={Loading} alt='loading...' className='fail-loading' />
            </div>
          </div>
        }>
          {activePage === 'DashBoard' || activePage === 'PIEChatbot' ? (
            <>
              {ActiveComponent && <ActiveComponent subPage={subPage} setSubPage={setSubPage} setIsActivePage={setIsActivePage} handleItemClick={handleItemClick} />}  {/* Load selected component */}
            </>
          ) : (<>{ActiveComponent && <ActiveComponent />}</>)
          }
        </Suspense>
      </div>
    </div>
  );
}

export default MainScreen;