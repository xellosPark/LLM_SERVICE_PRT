import { useEffect, useState } from "react";
import './CreateInspection.css'


const CreateInspection = () => {
  // 각 파일 선택 버튼의 파일 이름을 객체로 상태 관리
  const [fileNames, setFileNames] = useState({
    mailInfo: '',
    mailContent: '',
    systemInfo: ''
  });

  // 파일 선택 핸들러 (각 버튼에 따라 파일 상태를 업데이트)
  const handleFileChange = (event, fieldName) => {
    const file = event.target.files[0];  // 첫 번째 파일만 선택
    if (file) {
      setFileNames((prevFileNames) => ({
        ...prevFileNames,
        [fieldName]: file.name  // 특정 필드에 파일 이름 저장
      }));
    }
  };

  // 파일 선택 버튼 클릭 시 숨겨진 파일 선택 창 트리거
  const triggerFileSelect = (inputId) => {
    document.getElementById(inputId).click();
  };

  return (
    <div className="create-container">
      {/* 첫 번째 섹션 */}
      <div className="section">
        <div className="section-title">
          <div className="title">Data</div>

          <div>
            <div className="file-item">
              <div className="file-info">
                <img
                  src="https://img.icons8.com/?size=100&id=2577&format=png&color=000000"
                  alt="pdf icon"
                  className="file-icon"
                />

                <div className="file-details">
                  <p className="file-name file-margin">메일 정보</p>
                </div>
                <button className="csv-open-btn" onClick={() => triggerFileSelect('file-input-mailInfo')}>
                  <img

                    src="https://img.icons8.com/?size=50&id=17137&format=png&color=000000"
                    alt="csvfileOpen"
                    className="csvfileOpen-icon"
                  />
                </button>

                <div className="file-upload-list">{fileNames.mailInfo ? fileNames.mailInfo : 'csv 파일만 업로드 가능합니다.'}</div>
              </div>
            </div>
            <input
              id="file-input-mailInfo"
              type="file"
              style={{ display: 'none' }}
              onChange={(e) => handleFileChange(e, 'mailInfo')}
              accept=".csv"
            />

          </div>
          <div className="file-item">
            <div className="file-info">
              <img
                src="https://img.icons8.com/?size=100&id=312&format=png&color=000000"
                alt="pdf icon"
                className="file-icon"
              />

              <div className="file-details">
                <p className="file-name file-margin">메일 본문</p>
              </div>
              <button className="csv-open-btn" onClick={() => triggerFileSelect('file-input-mailContent')}>
                <img
                  src="https://img.icons8.com/?size=50&id=17137&format=png&color=000000"
                  alt="csvfileOpen"
                  className="csvfileOpen-icon"
                />
              </button>

              <div className="file-upload-list">{fileNames.mailContent ? fileNames.mailContent : 'zip 파일만 업로드 가능합니다.'}</div>

            </div>
            <input
              id="file-input-mailContent"
              type="file"
              style={{ display: 'none' }}
              onChange={(e) => handleFileChange(e, 'mailContent')}
              accept=".zip"
            />

          </div>
          <div className="file-item">
            <div className="file-info">
              <img
                src="https://img.icons8.com/?size=100&id=2937&format=png&color=000000"
                alt="pdf icon"
                className="file-icon"
              />

              <div className="file-details">
                <p className="file-name">자료요청 시스템 정보</p>
              </div>
              <button className="csv-open-btn" onClick={() => triggerFileSelect('file-input-senduser')}>
                <img

                  src="https://img.icons8.com/?size=50&id=17137&format=png&color=000000"
                  alt="csvfileOpen"
                  className="csvfileOpen-icon"
                />
              </button>

              <div className="file-upload-list">{fileNames.systemInfo ? fileNames.systemInfo : 'xlsx 파일만 업로드 가능합니다.'}</div>
            </div>
          </div>
          <input
            id="file-input-systemInfo"
            type="file"
            style={{ display: 'none' }}
            onChange={(e) => handleFileChange(e, 'systemInfo')}
            accept=".xlsx"
          />

          <div className="field-wrapper ">
            <label>제거 키워드 정보</label>
            <div className="custom-field-wrapper">
              <div className="flex-row">

                <label className="file-delete-label">보낸사람</label>

                <button className="icon-button" type="button" onClick={() => triggerFileSelect('file-input-senduser')}>
                  <img
                    src="https://img.icons8.com/?size=50&id=17137&format=png&color=000000"
                    alt="csvfileOpen"
                    className="csvfileOpen-icon"
                  />
                </button>

                <input
                  id="file-input-senduser"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileChange(e, 'senduser')}
                  accept=".txt"
                />
                <div className="file-upload-list">{fileNames.senduser ? fileNames.senduser : 'txt파일만 업로드 가능합니다.'}</div>
              </div>

              {/* 제목 */}
              <div className="flex-row">
                <label className="file-delete-label">제목</label>
                <button className="icon-button" type="button" onClick={() => triggerFileSelect('file-input-title')}>
                  <img
                    src="https://img.icons8.com/?size=50&id=17137&format=png&color=000000"
                    alt="csvfileOpen"
                    className="csvfileOpen-icon"
                  />
                </button>
                <input
                  id="file-input-title"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileChange(e, 'title')}
                  accept=".txt"
                />
                <div className="file-upload-list">{fileNames.title ? fileNames.title : 'txt파일만 업로드 가능합니다.'}</div>
              </div>

              {/* 실수취인 */}
              <div className="flex-row">
                <label className="file-delete-label">실수취인</label>

                <button className="icon-button" type="button" onClick={() => triggerFileSelect('file-input-user')}>
                <img
                    src="https://img.icons8.com/?size=50&id=17137&format=png&color=000000"
                    alt="csvfileOpen"
                    className="csvfileOpen-icon"
                  />
                </button>

                <input
                  id="file-input-user"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileChange(e, 'user')}
                  accept=".txt"
                />
                <div className="file-upload-list">{fileNames.user ? fileNames.user : 'txt파일만 업로드 가능합니다.'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 두 번째 섹션 */}
      <div className="section">
        <div className="section-title">
          <div className="title">Model</div>
          <select className="dropdown">
            <option value="">Model을 선택하세요.</option>
            <option value="model1">Gemma2:27b</option>
          </select>
        </div>
      </div>

      {/*세 번째 섹션 */}
      <div className="section">
        <div className="section-title">
          <div className="title">Prompt Engineering</div>
          <button className="icon-button-edit">
            {/* Run 아이콘 설정 */}
            <img src="https://img.icons8.com/?size=100&id=71201&format=png&color=e25977" alt="edit icon" />
            기술 자료 prompt 수정하기
          </button>
        </div>
        <div className="run-button">
          <div>
            {/* 하단 버튼 */}
            <button className="icon-button-run">
              {/* Run 아이콘 설정 */}
              <img src="https://img.icons8.com/ios-filled/50/c9415e/play.png" alt="run icon" />
              점검 시작
            </button>
          </div>
        </div>
      </div>

    

    </div>
  );
};

export default CreateInspection;