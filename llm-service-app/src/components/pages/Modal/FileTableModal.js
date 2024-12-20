import React from "react";
import "./FileTableModal.css";

const FileTableModal = ({ data, onClose }) => {
  if (!data) return null;
  if (!data[0]) return null;

  const timeReplace = (time) => {
    // 특정 문자 집합 제거
    const date = new Date(time);
    const result = date.toISOString().split('.')[0].replace('T', ' ');
    return result;
  }

  return (
    <div className="table-modal-overlay" onClick={onClose}>
      <div className="table-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="table-close-button" onClick={onClose}>
          &times;
        </button>
        <div className="table-modal-content-title">
          <h3>[{data.id}] {timeReplace(data[0]?.uploaded_time) || 'Nan'}</h3>
          <p style={{ color: 'gray', fontSize: '12px', fontWeight: 'normal', marginLeft: '7px' }}>(Job Id : {data[0]?.job_id || 'Nan'})</p>
        </div>
        <div className="table-modal-model">Model</div>
        <div className="table-modal-content-model"><p>{data.model || 'Nan'}</p></div>

        <div className="table-modal-label">Data</div>

        <div className="table-data-section">
          <div className="table-row">
            <div className="table-data-row">메일 정보</div>
            <span className="table-file-name">{data[0]?.mail_info_csv_name || 'Nan'}</span>
          </div>
          <div className="table-row">
            <div className="table-data-row">메일 본문</div>
            <span className="table-file-name">{data[0]?.mail_body_zip_name || 'Nan'}</span>
          </div>
          <div className="table-row">
            <div className="table-data-row">자료요청 시스템 정보</div>
            <span className="table-file-name">{data[0]?.data_request_system_xlsx_name || 'Nan'}</span>
          </div>
          <div className="table-row">
            <div className="table-data-delete">제거 키워드 정보</div>
            <div className="table-keywords-row">
              <div className="table-keywords">
                <span className="table-keyword">실수취인</span>
                <span className="table-keyword-name">{data[0]?.keyword_receiver_txt_name || 'Nan'}</span>
              </div>
              <div className="table-keywords">
                <span className="table-keyword">제목</span>
                <span className="table-keyword-name">{data[0]?.keyword_title_txt_name || 'Nan'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileTableModal;