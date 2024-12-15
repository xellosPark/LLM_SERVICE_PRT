import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import io from 'socket.io-client';
import axios from 'axios';
import './CreateInspection.css';
import { MailCheckStart, fileSave, promptFileLoad, promptFileUpdate } from "../../api/mailCheckControllers";
import { Link, useNavigate } from 'react-router-dom';
import Upload from '../../../logos/file_upload.png';
import Modify from '../../../logos/modify_prompt.png';
import { BsChevronRight } from "react-icons/bs";
import { CheckUserName, LoadLlmsTable } from "../../api/DBControllers";

const socket = io('ws://localhost:5000', {
    transports: ['websocket'],
    reconnection: true,
}); // 서버 주소 설정

const ModalPrompt = ({ setIsPromteModalOpen, setPromptContent, promptContent }) => {
    const closeModal = () => {
        setIsPromteModalOpen(false);
    };

    const saveModal = async () => {
        const result = await promptFileUpdate(promptContent);
        if (result.status >= 200 && result.status < 300) {
            
        } else if (result.status >= 300 && result.status < 400) {
            console.error('Prompt File 업로드 Error', result);
            //alert('Prompt File 업로드 중 에러가 발생했습니다. (300대 에러)');
            
        } else if (result.status >= 400 && result.status < 500) {
            console.error('Prompt File 업로드 Error', result);
            //alert('Prompt File 업로드 중 에러가 발생했습니다. (400대 에러)');
            
        } else if (result.status >= 500 && result.status < 600) {
            console.error('Prompt File 업로드 Error', result);
            //alert('Prompt File 업로드 중 에러가 발생했습니다. (500대 에러)');
            
        } else {
            console.error('Prompt File 업로드 Error', result);
            alert('Prompt File 업로드 중 에러가 발생했습니다.');
        }
        setIsPromteModalOpen(false);
    };

    const handlePromptChange = (event) => {
        setPromptContent(event.target.value);
    };

    return (
        <div className="modal-prompt-overlay">
            <div className="modal-content-prompt" onClick={(e) => e.stopPropagation()}>
                <h2>기술자료 Prompt 수정하기</h2>
                <textarea
                    style={{
                        width: '560px',
                        height: '580px',
                        fontSize: '16px',
                        border: '1px solid lightgray',
                        paddingTop: '10px',
                        paddingLeft: '10px',
                        marginBottom: '10px',
                    }}
                    rows={10}
                    value={promptContent}
                    onChange={handlePromptChange}
                />
                <div className="modal-prompt-button-container">
                    <button className="modal-prompt-save" onClick={saveModal}>Save</button>
                    <button className="modal-prompt-close" onClick={closeModal}>Close</button>
                </div>
            </div>
        </div>
    );
};

const CreateInspection = () => {
    const navigate = useNavigate();
    const [fileNames, setFileNames] = useState({
        mail_info_csv: '',
        mail_body_zip: '',
        data_request_system_xlsx: '',
        title: '',
        receiver: '',
    });

    const [files, setFiles] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [progress, setProgress] = useState([]);
    const [uploadComplete, setUploadComplete] = useState(false);
    const [totalProgress, setTotalProgress] = useState(0);
    const [uuid, setUuid] = useState(null);
    const [fileCount, setFileCount] = useState(0);
    const [failFileCount, setFailFileCount] = useState(0);
    const [uploadData, setUploadData] = useState(null);
    const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
    const [isPromptModalOpen, setIsPromteModalOpen] = useState(false);
    const [promptContent, setPromptContent] = useState("");
    const [startTime, setStartTime] = useState('');
    const [fileSize, setFileSize] = useState(0);
    const [llmsData, setLlmsData] = useState([]);
    const [createTime, setCreateTime] = useState("");

    useEffect(() => {
        LoadLlmDatas();
        socket.on('uploadProgress', (progress) => {
            console.log(`서버에서 받은 업로드 진행 상태: ${progress}%`);
        });

        return () => {
            socket.off('uploadProgress');
        };
    }, []);

    const LoadLlmDatas = async () => {
        const data = await LoadLlmsTable();
        if (data) setLlmsData(data);
    };

    const promptLoad = async () => {
        const result = await promptFileLoad();
        if (result.status >= 200 && result.status < 300) {
            setPromptContent(result.data);
        } else if (result.status >= 300 && result.status < 400) {
            setPromptContent(result.data.message);
        } else if (result.status >= 400 && result.status < 500) {
            setPromptContent(result.data.message);
        } else if (result.status >= 500 && result.status < 600) {
            console.error("서버 에러:", result.status, result.data);
        } else {
            console.error("Prompt File Load Error:", result);
            setPromptContent(result);
        }
    };

    const handleDropChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const handleFileChange = (event, fieldName) => {
        const file = event.target.files[0];
        if (file) {
            setFileNames((prevFileNames) => ({
                ...prevFileNames,
                [fieldName]: file.name,
            }));
        }
    };

    const getFormatUUID = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');
        const second = String(date.getSeconds()).padStart(2, '0');
        const millisecond = String(date.getMilliseconds()).padStart(3, '0');
        const formattedDate = `${year}${month}${day}${hour}${minute}${second}`
        const uuidPart = uuidv4().slice(-4).padStart(4, '0');
        const time = `${year}-${month}-${day} ${hour}:${minute}:${second}.${millisecond}`;
        setCreateTime(time);
        return `${formattedDate}${uuidPart}`
    }

    const handleFile = (e, fieldName) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length > 0) {
            const file = selectedFiles[0];
            setFiles((prevFiles) => {
                const updatedFiles = [...prevFiles];
                if (fieldName === 'mail_info_csv') updatedFiles[0] = file;
                else if (fieldName === 'mail_body_zip') updatedFiles[1] = file;
                else if (fieldName === 'data_request_system_xlsx') updatedFiles[2] = file;
                else if (fieldName === 'receiver') updatedFiles[3] = file;
                else if (fieldName === 'title') updatedFiles[4] = file;
                return updatedFiles;
            });

            setProgress((prevProgress) => {
                const updatedProgress = [...prevProgress];
                if (fieldName === 'mail_info_csv') updatedProgress[0] = 0;
                else if (fieldName === 'mail_body_zip') updatedProgress[1] = 0;
                else if (fieldName === 'data_request_system_xlsx') updatedProgress[2] = 0;
                else if (fieldName === 'receiver') updatedProgress[3] = 0;
                else if (fieldName === 'title') updatedProgress[4] = 0;

                const filteredData = updatedProgress.filter(item => item != null && item !== "");
                return filteredData;
            });

            setUploadComplete(false); // 업로드 완료 상태 초기화
            setTotalProgress(0); // 전체 진행률 초기화
            setFileCount(0); // 파일 개수 초기화
            setFailFileCount(0); // 실패한 파일 개수 초기화
        }
    };

    const updateTotalProgress = (individualProgress) => {
        const total = individualProgress.reduce((sum, fileProgress) => sum + fileProgress, 0);
        const averageProgress = total / individualProgress.length;
        setTotalProgress(averageProgress);
    };

    const handleMailCheckStart = async () => {
        if (fileNames.mail_info_csv === '' || fileNames.mail_info_csv === undefined) {
            alert('csv 파일을 업로드해주세요.');
            return;
        }

        if (fileNames.mail_body_zip === '' || fileNames.mail_body_zip === undefined) {
            alert('zip 파일을 업로드해주세요.');
            return;
        }

        if (selectedOption === '' || selectedOption === undefined) {
            alert('모델을 선택해주세요.');
            return;
        }

        const createUuid = getFormatUUID();
        setUuid(createUuid);

        const mailList = {
            mail_info_csv: fileNames.mail_info_csv,
            mail_body_zip: fileNames.mail_body_zip,
            data_request_system_xlsx: fileNames.data_request_system_xlsx,
            keyword_txt: { receiver: fileNames.receiver, title: fileNames.title },
        };

        const uploadDatas = {
            service_name: 'mail_compliance_check',
            job_id: createUuid,
            user: 'jaeyeong.lee',
            file_name_list: mailList,
            model_name: selectedOption,
        };

        const result = await CheckUserName(uploadDatas.user);
        if (result.status !== 200) {
            alert('유저 명이 잘못되었습니다.');
            return;
        }

        setUploadData(uploadDatas);
        setIsProgressModalOpen(true);
    

        const filteredData = files.filter(item => item != null && item !== "");
        setFiles(filteredData);

        socket.emit('sendUuid', { uuid: createUuid, type: fileNames }, (response) => {
            if (response === 'UUID received') {
                handleFilsSizeAndTime(filteredData);
                filteredData.forEach((file, index) => {
                    const formData = new FormData();
                    formData.append('file', file);

                    axios.post(`http://165.244.190.28:5000/upload`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                        onUploadProgress: (progressEvent) => {
                            const percentCompleted = Math.min(
                                Math.round((progressEvent.loaded * 100) / progressEvent.total),
                                90
                            );
                            setProgress((prevProgress) => {
                                const newProgress = [...prevProgress];
                                newProgress[index] = percentCompleted;
                                updateTotalProgress(newProgress);
                                return newProgress;
                            });
                            socket.emit('uploadProgress', percentCompleted);
                        },
                    })
                        .then(() => {
                            console.log(`파일 업로드 완료: ${file.name}`);
                            const timer = setTimeout(() => {
                                setProgress((prevProgress) => {
                                    const newProgress = [...prevProgress];
                                    newProgress[index] = 100;
                                    updateTotalProgress(newProgress);
                                    return newProgress;
                                });
                                setFileCount(prevCount => prevCount + 1)
                            }, 1000); // 1초 후 로그 출력
                            return () => clearTimeout(timer);

                        })
                        .catch((error) => {
                            console.error(`파일 업로드 실패: ${file.name}, 오류:`, error);
                            setFailFileCount(prevCount => prevCount + 1);
                        });
                });

            }
        });
    };
    
    const SendMailCheckStart = async (time) => {
        const elapsed_time = (time / 1000).toFixed(2);

        const fileSaveResult = await fileSave(uploadData, elapsed_time, fileSize.toFixed(2), createTime);

        if (fileSaveResult.status >= 200 && fileSaveResult.status < 300) {
            
        } else if (fileSaveResult.status >= 300 && fileSaveResult.status < 400) {
            console.error('AiCore1 Start Error', fileSaveResult);
            alert('신규 점검 생성 파일 저장 중 에러가 발생했습니다. (300번대 에러)');
            setIsProgressModalOpen(false);
            return
        } else if (fileSaveResult.status >= 400 && fileSaveResult.status < 500) {
            console.error('AiCore1 Start Error', fileSaveResult);
            alert('신규 점검 생성 파일 저장 중 에러가 발생했습니다. (400번대 에러)');
            setIsProgressModalOpen(false);
            return
        } else if (fileSaveResult.status >= 500 && fileSaveResult.status < 600) {
            console.error('AiCore1 Start Error', fileSaveResult);
            alert('신규 점검 생성 파일 저장 중 에러가 발생했습니다. (500번대 에러)');
            setIsProgressModalOpen(false);
            return
        } else {
            console.error('AiCore1 Start Error', fileSaveResult);
            alert('신규 점검 생성 파일 저장 중 에러가 발생했습니다.');
            setIsProgressModalOpen(false);
            return
        }
        const result = await MailCheckStart(uploadData);

        if (result.status >= 200 && result.status < 300) {
            
        } else if (result.status >= 300 && result.status < 400) {
            console.error('AiCore1 Start Error', result);
        } else if (result.status >= 400 && result.status < 500) {
            console.error('AiCore1 Start Error', result);
        } else if (result.status >= 500 && result.status < 600) {
            console.error('AiCore1 Start Error', result);
        } else {
            console.error('AiCore1 Start Error', result);
            alert('AiCore1 Start 중 에러가 발생했습니다.');
        }

        navigate('/service/mail-compliance');
    }
    const handleEditPrompt = async () => {
        await promptLoad();
        setIsPromteModalOpen(true);
    };

    const handleFilsSizeAndTime = (filteredData) => {
        const totalSizeInMB = filteredData.reduce((acc, file) => acc + file?.size, 0) / (1024 * 1024); //MB 단위로 변환
        setFileSize(totalSizeInMB);
        const startTime = Date.now();
        setStartTime(startTime);
    }

    useEffect(() => {
        if (files.length === 0)
            return;
        console.log('fileCount',files.length, fileCount, failFileCount);

        if (files.length === (fileCount + failFileCount)) {
            setUploadComplete(true);
            setTotalProgress(100);
            const elapsed_time = Date.now() - startTime;

            const timer = setTimeout(() => {
                console.log('파일 업로드 성공');
                SendMailCheckStart(elapsed_time);
                setFileCount(0);
                setFailFileCount(0);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [fileCount, failFileCount])

    return (
        <div className="create-content">
            {/* 네비게이션 바 */}
            <div className="create-navigation-bar">
                <div className="create-navigation-title">
                    <Link to="/service/mail-compliance" className="nav-item active">
                        Mail Compliance 점검
                    </Link>
                    <BsChevronRight className="nav-item-create-header" />
                    <div className="nav-item-create-active">신규 점검 생성</div>
                </div>
            </div>
            <div className="create-container">
                {/* Data 섹션 */}
                <div className="section">
                    <div className="section-title">
                        <div className="title">Data</div>
                        <div>
                            {/* 메일 정보 */}
                            <div className="file-item">
                                {/* 메일 정보 박스 */}
                                <div className="file-details">
                                    <p className="file-names">
                                        <span className="red-star">* </span>메일 정보
                                    </p>
                                </div>
                                {/* csv 버튼 박스 */}
                                <div className="file-info">
                                    <button className="open-btn" onClick={() => document.getElementById('file-input-mail_info_csv').click()}>
                                        <img
                                            src={Upload}
                                            alt="csvfileOpen"
                                            className="csvfileOpen-icon"
                                        />
                                    </button>
                                    <input
                                        id="file-input-mail_info_csv"
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={(e) => { handleFileChange(e, 'mail_info_csv'); handleFile(e, 'mail_info_csv'); }}
                                        accept=".csv"
                                        multiple
                                    />
                                    <div className="file-upload-list">{fileNames.mail_info_csv || 'csv 파일만 업로드 가능합니다.'}</div>
                                </div>
                            </div>

                            {/* 메일 본문 */}
                            <div className="file-item">
                                {/* 메일 본문 박스 */}
                                <div className="file-details">
                                    <p className="file-names">
                                        <span className="red-star">* </span>메일 본문
                                    </p>
                                </div>
                                {/* zip 버튼 박스 */}
                                <div className="file-info">
                                    <button className="open-btn" onClick={() => document.getElementById('file-input-mail_body_zip').click()}>
                                        <img
                                            src={Upload}
                                            alt="csvfileOpen"
                                            className="csvfileOpen-icon"
                                        />
                                    </button>
                                    <input
                                        id="file-input-mail_body_zip"
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={(e) => { handleFileChange(e, 'mail_body_zip'); handleFile(e, 'mail_body_zip'); }}
                                        accept=".zip"
                                        multiple
                                    />
                                    <div className="file-upload-list">{fileNames.mail_body_zip ? fileNames.mail_body_zip : 'zip 파일만 업로드 가능합니다.'}</div>
                                </div>
                            </div>

                            {/* 자료요청 시스템 정보 */}
                            <div className="file-item">
                                {/* 자료요청 시스템 정보 박스 */}
                                <div className="file-details">
                                    <p className="file-names">자료요청 시스템 정보</p>
                                </div>
                                {/* xlsx 버튼 박스 */}
                                <div className="file-info">
                                    <button className="open-btn" onClick={() => document.getElementById('file-input-data_request_system_xlsx').click()}>
                                        <img
                                            src={Upload}
                                            alt="csvfileOpen"
                                            className="csvfileOpen-icon"
                                        />
                                    </button>
                                    <input
                                        id="file-input-data_request_system_xlsx"
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={(e) => { handleFileChange(e, 'data_request_system_xlsx'); handleFile(e, 'data_request_system_xlsx'); }}
                                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                        multiple
                                    />
                                    <div className="file-upload-list">{fileNames.data_request_system_xlsx ? fileNames.data_request_system_xlsx : 'xlsx 파일만 업로드 가능합니다.'}</div>
                                </div>
                            </div>

                            {/* 제거 키워드 정보 - 실수취인 */}
                            <div className="file-item">
                                {/* 제거 키워드 정보 박스 */}
                                <div className="file-details">
                                    <p className="file-names">제거 키워드 정보</p>
                                </div>
                                {/* 실수취인 박스 */}
                                <label className="file-delete-label" style={{ display: 'flex', justifyContent: 'center' }}>실수취인</label>
                                {/* 실수취인 txt 버튼 박스 */}
                                <div className="file-info">
                                    <button className="open-btn" onClick={() => document.getElementById('file-input-receiver').click()}>
                                        <img
                                            src={Upload}
                                            alt="csvfileOpen"
                                            className="csvfileOpen-icon"
                                        />
                                    </button>
                                    <input
                                        id="file-input-receiver"
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={(e) => { handleFileChange(e, 'receiver'); handleFile(e, 'receiver'); }}
                                        accept="text/plain"
                                        multiple
                                    />
                                    <div className="file-upload-list">{fileNames.receiver ? fileNames.receiver : 'txt 파일만 업로드 가능합니다.'}</div>
                                </div>
                            </div>

                            {/* 제거 키워드 정보 - 제목 */}
                            <div className="file-item">
                                {/* 빈 박스 */}
                                <div className="file-details-empty">
                                    <p className="file-names"> </p>
                                </div>
                                {/* 제목 박스 */}
                                <label className="file-delete-label" style={{ display: 'flex', justifyContent: 'center' }}>제목</label>
                                {/* 제목 txt 버튼 박스 */}
                                <div className="file-info">
                                    <button className="open-btn" onClick={() => document.getElementById('file-input-title').click()}>
                                        <img
                                            src={Upload}
                                            alt="csvfileOpen"
                                            className="csvfileOpen-icon"
                                        />
                                    </button>
                                    <input
                                        id="file-input-title"
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={(e) => { handleFileChange(e, 'title'); handleFile(e, 'title'); }}
                                        accept="text/plain"
                                        multiple
                                    />
                                    <div className="file-upload-list">{fileNames.title ? fileNames.title : 'txt 파일만 업로드 가능합니다.'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Model 섹션 */}
                <div className="section">
                    <div className="section-title">
                        <div className="title">Model</div>
                        <select className="dropdown" value={selectedOption} onChange={handleDropChange}>
                            <option value="" disabled>{llmsData?.length !== 0 ? 'Model을 선택하세요.' : '모델 불러오기 실패'}</option>
                            {
                                llmsData?.map((item) => (
                                    <option key={item.id} value={item.name}>
                                        {item.name_show}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                </div>

                {/* Prompt Engineering 섹션 + 점검 시작 버튼 */}
                <div className="section">
                    <div className="section-title">
                        <div className="title">Prompt Engineering</div>
                        <button className="icon-button-edit" onClick={handleEditPrompt}>
                            <img src={Modify} alt="edit icon" />기술자료 Prompt 수정하기
                        </button>
                    </div>
                    <div className="run-button">
                        <div>
                            <button className="icon-button-run" onClick={handleMailCheckStart}>
                                점검 시작
                            </button>
                        </div>
                    </div>
                </div>
                {
                    isProgressModalOpen && (
                        <div className="modal-overlay">
                            <div className="modal-content-create" onClick={(e) => e.stopPropagation()}>
                                <h2>파일 업로드 진행 상태</h2>
                                <ul className="progress-list">
                                    {files.map((file, index) => (
                                        <li key={index} className="progress-item">
                                            <div className="modal-file-info">
                                                <span className="file-name">{file?.name}</span>
                                                <span className="progress-text">{progress[index]}%</span>
                                            </div>
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{ width: `${progress[index]}%` }} />
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                            </div>
                        </div>
                    )
                }
                {isPromptModalOpen && (
                    <ModalPrompt setIsPromteModalOpen={setIsPromteModalOpen} setPromptContent={setPromptContent} promptContent={promptContent} />
                    )
                }
            </div>
        </div>
    );
};

export default CreateInspection;