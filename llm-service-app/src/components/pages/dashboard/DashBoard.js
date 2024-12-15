import React from 'react';
import LLMTable from './LLMTable';
import './DashBoard.css';
import { Link } from 'react-router-dom';
import newbutton from '../../../logos/createnewcheck.png';

const DashBoard = () => {

  return (
    <div className="dashboard-content">
      <div className="dashboard-navigation-bar">
        <div className="dashboard-navigation-title">
          <Link to="/service/mail-compliance" className="nav-item active">
            Mail Compliance 점검
          </Link>
        </div>

        <div className="dashboard-separator"></div>

        <div className="dashboard-navigation-title-sub">
          <Link to="/service/pie-chabot" className="nav-item">
            PIE 챗봇
          </Link>
        </div>
      </div>

      <div id="dashboard-main">
        <div className="dashboard-main" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div>
            <div className="dashboard-newaddbutton">
              <div>
                <Link to="/service/mail-compliance/new" className="dashboard-icon-button-add">
                  <img src={newbutton} alt="add function icon" />
                  신규 점검 생성
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div>
          <LLMTable />
        </div>
      </div>
    </div>
  );
};

export default DashBoard;