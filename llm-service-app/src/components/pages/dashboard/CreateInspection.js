import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import io from 'socket.io-client';
import axios from 'axios';
import './CreateInspection.css';
import { MailCheckStart, fileSave, promptFileLoad, promptFileUpdate } from "../../api/mailCheckControllers";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Upload from '../../../logos/file_upload.png'
import Modify from '../../../logos/modify_prompt.png'
import { BsChevronRight } from "react-icons/bs";

const socket = io('ws://localhost:5000', {
    transports: ['websocket'],
    reconnection: true,
}); // 서버 주소 설정

const ModalPrompt = ({ setIsPromteModalOpen, isPromptModalOpen, setPromptContent, promptContent }) => {

    useEffect(() => {
        if (isPromptModalOpen === true) {
            console.log('promptContentssss', promptContent);
            
        }
    }, [isPromptModalOpen])
    const closeModal = () => {
        setIsPromteModalOpen(false);
    }

    const saveModal = () => {
        promptFileUpdate(promptContent);
        setIsPromteModalOpen(false); //마지막에 닫기
    }

    const handlePromptChange = (event) => {
        setPromptContent(event.target.value);
    }

    return (
        <>
            <div className="modal-prompt-overlay">
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <h2>기술자료 prompt 수정하기</h2>
                    <div>
                        <textarea style={{
                            width: '570px', 
                            height: '580px', 
                            fontSize: '16px', 
                            border: '1px solid lightgray',
                            paddingTop: '10px', 
                            paddingLeft: '10px',
                        }}
                        rows={10}
                        value={promptContent} onChange={handlePromptChange} />
                    </div>
                    <div class="modal-prompt-button-container">
                        <button className="modal-prompt-save" onClick={saveModal}>Save</button>
                        <button className="modal-prompt-close" onClick={closeModal}>Close</button>
                    </div>
                </div>
            </div>
        </>
    )
}

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
    const [progress, setProgress] = useState([]); // 파일별 진행률 상태
    const [uploadComplete, setUploadComplete] = useState(false); // 업로드 완료 여부 상태
    const [totalProgress, setTotalProgress] = useState(0); // 전체 업로드 진행률 상태
    const [uuid, setUuid] = useState(null); // UUID 상태
    const [fileCount, setFileCount] = useState(0);
    const [failFileCount, setFailFileCount] = useState(0);
    const [uploadData, setUploadData] = useState(null);
    const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
    const [isPromptModalOpen, setIsPromteModalOpen] = useState(false);
    const [promptContent, setPromptContent] = useState("");
    const [startTime, setStartTime] = useState('');
    const [fileSize, setFileSize] = useState(0);

    useEffect(() => {

        socket.on('uploadProgress', (progress) => {
            console.log(`서버에서 받은 업로드 진행 상태: ${progress}%`);
        });

        return () => {
            socket.off('uploadProgress');
        };
    }, []);

    const promptLoad = async () => {
        const result = await promptFileLoad();
        console.log('result', result);
        
        if (result === undefined) {
            setPromptContent('파일을 불러올수 없습니다');
        } else {
            setPromptContent(result.data);
        }
    }

    const handleDropChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const handleFileChange = (event, fieldName) => {
        const file = event.target.files[0];
        if (file) {
            setFileNames((prevFileNames) => ({
                ...prevFileNames,
                [fieldName]: file.name
            }));
        }
        //console.log('filedName', fieldName, fileNames);
        
    };

    const getFormatUUID = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');
        const second = String(date.getSeconds()).padStart(2, '0');
        const formattedDate = `${year}${month}${day}${hour}${minute}${second}`
        const uuidPart = uuidv4().slice(-4).padStart(4, '0');
        return `${formattedDate}${uuidPart}` //uuid.slice(0, 4); // 앞 4자리 추출
    }

    // const handleFile = (e, fileName) => {
    //     const selectedFiles = Array.from(e.target.files);
    //     setFiles((prevFiles) => [...prevFiles, ...selectedFiles]); // 기존 파일에 새 파일 추가
    //     setProgress((prevProgress) => [...prevProgress, ...selectedFiles.map(() => 0)]); // 각 파일별 진행률 초기화
    //     setUploadComplete(false);
    //     setTotalProgress(0);
    //     setFileCount(0);
    //     setFailFileCount(0);
    //     console.log('fileName', fileName, files, progress);
        
    // };

    const handleFile = (e, fieldName) => {
        const selectedFiles = Array.from(e.target.files);
        console.log("선택된 파일 목록:", selectedFiles); // 선택된 파일의 전체 목록을 배열로 출력
        console.log("선택된 파일 개수:", selectedFiles.length); // 선택된 파일 개수 출력
    
        if (selectedFiles.length > 0) {
            const file = selectedFiles[0]; // 첫 번째 파일을 사용
    
            setFiles((prevFiles) => {
                const updatedFiles = [...prevFiles]; // 이전 파일 배열을 복사하여 새로운 배열 생성
    
                // fieldName에 따라 특정 인덱스의 파일을 설정
                if (fieldName === 'mail_info_csv') {
                    console.log("처리 중: mail_info_csv");
                    updatedFiles[0] = file; // 'mail_info_csv'의 경우 인덱스 0에 파일 추가
                } else if (fieldName === 'mail_body_zip') {
                    console.log("처리 중: mail_body_zip");
                    updatedFiles[1] = file; // 'mail_body_zip'의 경우 인덱스 1에 파일 추가
                } else if (fieldName === 'data_request_system_xlsx') {
                    console.log("처리 중: data_request_system_xlsx");
                    updatedFiles[2] = file; // 'data_request_system_xlsx'의 경우 인덱스 2에 파일 추가
                } else if (fieldName === 'receiver') {
                    console.log("처리 중: receiver");
                    updatedFiles[3] = file; // 'receiver'의 경우 인덱스 3에 파일 추가
                } else if (fieldName === 'title') {
                    console.log("처리 중: title");
                    updatedFiles[4] = file; // 'title'의 경우 인덱스 4에 파일 추가
                } else {
                    console.log("알 수 없는 필드:", fieldName);
                }
    
                console.log("업데이트된 파일 목록:", updatedFiles); // 파일이 업데이트된 배열을 출력
                return updatedFiles; // 새로운 배열을 반환하여 상태 업데이트
            });
    
            // 파일마다 진행률 배열을 초기화
            setProgress((prevProgress) => {
                const updatedProgress = [...prevProgress]; // 기존 진행률 배열 복사
                if (fieldName === 'mail_info_csv') {
                    updatedProgress[0] = 0; // 인덱스 0 진행률 초기화
                } else if (fieldName === 'mail_body_zip') {
                    updatedProgress[1] = 0; // 인덱스 1 진행률 초기화
                } else if (fieldName === 'data_request_system_xlsx') {
                    updatedProgress[2] = 0; // 인덱스 2 진행률 초기화
                } else if (fieldName === 'receiver') {
                    updatedProgress[3] = 0; // 인덱스 3 진행률 초기화
                } else if (fieldName === 'title') {
                    updatedProgress[4] = 0; // 인덱스 4 진행률 초기화
                }
                console.log("초기화된 파일 진행률:", updatedProgress); // 초기화된 진행률 배열 출력
                return updatedProgress;
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

        // if (fileNames.data_request_system_xlsx === '' || fileNames.data_request_system_xlsx === undefined) {
        //     alert('xlsx 파일을 업로드해주세요.');
        //     return;
        // }

        // if (fileNames.title === '' || fileNames.title === undefined) {
        //     alert('제목 txt 파일을 업로드해주세요.');
        //     return;
        // }

        // if (fileNames.receiver === '' || fileNames.receiver === undefined) {
        //     alert('실수취인 txt 파일을 업로드해주세요.');
        //     return;
        // }

        if (selectedOption === '' || selectedOption === undefined) {
            alert('모델을 선택해주세요.');
            return;
        }

        const createUuid = getFormatUUID();
        setUuid(createUuid);
        console.log('createUuid', createUuid);
        

        const keywordTxt = { receiver: fileNames.receiver, title: fileNames.title };
        const mailList = {
            mail_info_csv: fileNames.mail_info_csv,
            mail_body_zip: fileNames.mail_body_zip,
            data_request_system_xlsx: fileNames.data_request_system_xlsx,
            keyword_txt: keywordTxt,
        };

        const uploadDatas = {
            service_name: 'mail_compliance_check',
            job_id: createUuid,
            user: 'jaeyeong.lee',
            file_name_list: mailList,
            model_name: selectedOption,
        };

        setUploadData(uploadDatas);
        setIsProgressModalOpen(true); //로컬에서 테스트를 위해 남겨둠

        // const timer = setTimeout(() => {
        //     setFileCount(prevCount => prevCount + 5); // count 증가
        // }, 2000); // 1초 후 로그 출력

        // return;

        socket.emit('sendUuid', { uuid: createUuid, type: fileNames }, (response) => {
            if (response === 'UUID received') {
                handleFilsSizeAndTime();
                files.forEach((file, index) => {
                    const formData = new FormData();
                    formData.append('file', file);
                    //formData.append('uuid', createUuid);
                    
                    axios.post(`http://localhost:5000/upload`, formData, {
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
                                setFileCount(prevCount => prevCount + 1); // count 증가
                            }, 1000); // 1초 후 로그 출력
                            // 컴포넌트가 언마운트될 때 타이머 정리
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
        const elapsed_time = (time / 1000).toFixed(2); //초 단위 시간 계산
        console.log('uploadData', uploadData);
        
        const fileSaveResult = await fileSave(uploadData, elapsed_time, fileSize.toFixed(2));
        console.log('fileSaveResult', fileSaveResult);

        const result = await MailCheckStart(uploadData);
        console.log('result', result);
        navigate('/main'); // 메인 페이지로 이동
    }

    const handleEditPrompt = async () => {
        await promptLoad();
        console.log('prompt', promptContent);
        
        setIsPromteModalOpen(true);
    }

    const handleFilsSizeAndTime = () => {
        const totalSizeInMB = files.reduce((acc, file) => acc + file.size, 0) / (1024 * 1024); //MB 단위로 변환
        setFileSize(totalSizeInMB);
        const startTime = Date.now();// 타이머 시작
        setStartTime(startTime);
    }

    useEffect(() => {
        if (files.length === 0)
            return;
        console.log('fileCount', fileCount, failFileCount);

        if (files.length === (fileCount + failFileCount)) {
            setUploadComplete(true);
            setTotalProgress(100);
            const elapsed_time = Date.now() - startTime;// 타이머 시작

            const timer = setTimeout(() => {
                console.log('파일 업로드 성공');
                SendMailCheckStart(elapsed_time);
                setFileCount(0);
                setFailFileCount(0);
            }, 1000); // 1초 후 로그 출력

            // 컴포넌트가 언마운트될 때 타이머 정리
            return () => clearTimeout(timer);
        }
    }, [fileCount, failFileCount])

    return (
        <div className="content">
            {/* 네비게이션 바 */}
            <div className="navigation-bar">
                <div className="navigation-title">
                    <Link to="/sidebar/DashBoard"
                        className='nav-item active'
                    >
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
                            <option value="" disabled>사용할 model을 선택하세요.</option>
                            <option value="gemma">gemma</option>
                            <option value="exaone">exaone</option>
                        </select>
                    </div>
                </div>

                {/* Prompt Engineering 섹션 + 점검 시작 버튼 */}
                <div className="section">
                    <div className="section-title">
                        <div className="title">Prompt Engineering</div>
                        <button className="icon-button-edit" onClick={handleEditPrompt}>
                            <img src={Modify} alt="edit icon" />기술자료 prompt 수정하기
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
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <h2>파일 업로드 진행 상태</h2>
                                <ul className="progress-list">
                                    {files.map((file, index) => (
                                        <li key={index} className="progress-item">
                                            <div className="file-info">
                                                <span className="file-name">{file.name}</span>
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
                    <ModalPrompt setIsPromteModalOpen={setIsPromteModalOpen} isPromptModalOpen={isPromptModalOpen} setPromptContent={setPromptContent} promptContent={promptContent} />
                )
                }
            </div>
        </div>
    );
};

export default CreateInspection;