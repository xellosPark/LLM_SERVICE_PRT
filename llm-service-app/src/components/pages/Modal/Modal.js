import React from "react";
import "./Modal.css"; // 모달에 대한 스타일을 별도 파일로 분리

const Modal = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="modal-content-title"><h2>[{data.id}] {data.title}</h2><p>(Job Id: {data.jobId})</p></div>
        <label>Model</label>
        <div className="modal-content-model"><p>{data.model}</p></div>

        <label>Data</label>

        <div className="data-section">
          <div className="row">
            <div className="data-row">메일 정보</div>
            <span className="file-name" data-tooltip="롷럴러ㅛㄹ허ㅕㅛㅕㅛ허ㅗ허하허ㅗ호ㅓㅎㄹ쇼ㅏㄹ하ㅗㅗ하ㅓㅗ하ㅓ허홀쇼하ㅗ홯csv">롷럴러ㅛㄹ허ㅕㅛㅕㅛ허ㅗ허하허ㅗ호ㅓㅎㄹ쇼ㅏㄹ하ㅗㅗ하ㅓㅗ하ㅓ허홀쇼하ㅗ홯csv</span>
          </div>
          <div className="row">
            <div className="data-row">메일 본문</div>
            <span className="file-name" data-tooltip="zip">zip</span>
          </div>
          <div className="row">
            <div className="data-row">자료요청 시스템 정보</div>
            <span className="file-name" data-tooltip="xlsx">xlsx</span>
          </div>
          <div className="row">
            <div className="data-delete">제거 키워드 정보</div>
            <div className="keywords-row">
              <div className="keywords">
                <span className="keyword">실수취인</span>
                <span className="keyword-name" data-tooltip="txt">txt</span>
              </div>
              <div className="keywords">
                <span className="keyword">제목</span>
                <span className="keyword-name" data-tooltip="txt">txt</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-close">
        <button className="modal-close-button" onClick={onClose}>Close</button>
        </div>
        
      </div>
    </div>
  );
};

export default Modal;