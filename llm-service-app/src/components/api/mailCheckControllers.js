import { upload } from '@testing-library/user-event/dist/upload';
//import api from './api'

import io from 'socket.io-client';
import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:5000", // 서버의 기본 URL
  headers: {
    "Content-Type": "application/json", // 모든 요청에 기본 Content-Type 설정
  },
});

// export const UploadFiles = async (files, index, file, setProgress) => {
//   const socket = io('http://165.244.190.28:5000'); // Adjust server address if needed
//   try {
//     const ip = `http://165.244.190.28:5000`;

//     const response = await api.post(`${ip}/upload`, files, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       },
//       onUploadProgress: (progressEvent) => {
//           const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//           setProgress(prevProgress => {
//             const newProgress = [...prevProgress];
//             newProgress[index] = percentCompleted; // 진행률 업데이트
//             return newProgress;
//         });


//         console.log(`파일: ${file.name} 업로드 중... ${percentCompleted}% 완료`);
//         // 서버로 업로드 진행 상태 전송
//         socket.emit('uploadProgress', percentCompleted);

//       },

//     }).then(() => {
//       console.log(`파일 업로드 완료: ${file.name}`);
//   }).catch((error) => {
//     console.error(`파일 업로드 실패: ${file.name}, 오류:`, error);
// });

//     //console.log('setFileDestination', response);

//     return response;
//   } catch (error) {
//     console.log('Error : ', error);
//   }
// }

export const MailCheckStart = async (mailItems) => {
  try {
        const ip = `http://localhost:5000`;
    const response = await api.post(`${ip}/api/datas/mail-compliance-check/start`, mailItems);

    //const { statusCode, data } = response;

    return response;
  } catch (error) {
    if (error.response) {
      // 서버 응답이 있는 경우
      const status = error.response?.status; // 상태 코드
      const data = error.response?.data; // 에러 데이터
      if (status >= 400 && status < 500) {
        console.error("AiCore1 Start 클라이언트 에러 (400대):", status, data);
      } else if (status >= 500 && status < 600) {
        console.error("AiCore1 Start 서버 에러 (500대):", status, data);
      } else {
        console.error("AiCore1 Start 기타 에러:", status, data || error.message);
      }
      return error.response;
    } else if (error.request) {
      // 요청이 서버에 도달했지만 응답을 받지 못한 경우
      console.error("AiCore1 Start 실패 요청 객체:", error, error.request || error.data);
      return error;
    } else {
      // 요청 설정 중 오류 발생
      console.error("AiCore1 Start 에러 메시지:", error, error.message || error.data);
      return error;
    }
  }
}

export const promptFileLoad = async () => {
  try {
    const ip = `http://localhost:5000`;
    const response = await api.post(`${ip}/api/datas/prompt`);
    
    return response;
  } catch (error) {
    if (error.response) {
      // 서버 응답이 있는 경우
      const status = error.response?.status; // 상태 코드
      const data = error.response?.data; // 에러 데이터
      if (status >= 400 && status < 500) {
        console.error("Prompt File Load 클라이언트 에러 (400대):", status, data);
      } else if (status >= 500 && status < 600) {
        console.error("Prompt File Load 서버 에러 (500대):", status, data);
      } else {
        console.error("Prompt File Load 기타 에러:", status, data || error.message);
      }
      return error.response;
    } else if (error.request) {
      // 요청이 서버에 도달했지만 응답을 받지 못한 경우
      console.error("Prompt File Load 실패 요청 객체:", error, error.request || error.data);
      return error;
    } else {
      // 요청 설정 중 오류 발생
      console.error("Prompt File Load 에러 메시지:", error, error.message || error.data);
      return error;
    }
  }
}

export const promptFileUpdate = async (content) => {
  //console.log('content', content);

  try {
    const ip = `http://localhost:5000`;
    const response = await api.post(`${ip}/api/datas/update-prompt`, { content });
    return response;
  } catch (error) {
    if (error.response) {
      // 서버 응답이 있는 경우
      const status = error.response?.status; // 상태 코드
      const data = error.response?.data; // 에러 데이터
      if (status >= 400 && status < 500) {
        console.error("Prompt File Update 클라이언트 에러 (400대):", status, data);
      } else if (status >= 500 && status < 600) {
        console.error("Prompt File Update 서버 에러 (500대):", status, data);
      } else {
        console.error("Prompt File Update 기타 에러:", status, data || error.message);
      }
      return error.response;
    } else if (error.request) {
      // 요청이 서버에 도달했지만 응답을 받지 못한 경우
      console.error("Prompt File Update 실패 요청 객체:", error, error.request || error.data);
      return error;
    } else {
      // 요청 설정 중 오류 발생
      console.error("Prompt File Update 에러 메시지:", error, error.message || error.data);
      return error;
    }
  }
}

export const fileSave = async (fileNames, elapsed_time, fileSize, createTime) => {
  //console.log('filesave', fileNames);

  try {
    const ip = `http://165.244.190.28:5000`;
    const response = await api.post(`${ip}/api/datas/files`, { fileNames, elapsed_time, fileSize, createTime });
    return response;
  } catch (error) {
    if (error.response) {
      // 서버 응답이 있는 경우
      const status = error.response?.status; // 상태 코드
      const data = error.response?.data; // 에러 데이터
      if (status >= 400 && status < 500) {
        console.error("신규 점검 생성 파일 저장 클라이언트 에러 (400대):", status, data);
      } else if (status >= 500 && status < 600) {
        console.error("신규 점검 생성 파일 저장 서버 에러 (500대):", status, data);
      } else {
        console.error("신규 점검 생성 파일 저장 기타 에러:", status, data || error.message);
      }
      return error.response;
    } else if (error.request) {
      // 요청이 서버에 도달했지만 응답을 받지 못한 경우
      console.error("신규 점검 생성 파일 저장 실패 요청 객체:", error, error.request || error.data);
      return error;
    } else {
      // 요청 설정 중 오류 발생
      console.error("신규 점검 생성 파일 저장 에러 메시지:", error, error.message || error.data);
      return error;
    }
  }
}