import React from 'react';
import { Route, Routes } from 'react-router-dom';
import View4 from '../views/View4';
import View5 from '../views/View5';
import EvalDashBoardFinal from '../components/pages/dashboard/EvalDashBoardFinal';
import EvalDashBoard from '../components/pages/dashboard/EvalDashBoard';
import DashBoard from '../components/pages/dashboard/DashBoard';
import LLMOPS from '../components/pages/dashboard/LLMOPS';

function SidebarRoutes() {
  return (
    <Routes>
      <Route path="main" element={<DashBoard />} />
      <Route path="DashBoard" element={<DashBoard />} />
      <Route path="LLMOps" element={<LLMOPS />} />
      <Route path="view4" element={<View4 />} />
      
    </Routes>
  );
}

export default SidebarRoutes;