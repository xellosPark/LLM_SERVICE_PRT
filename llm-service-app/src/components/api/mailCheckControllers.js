import { upload } from '@testing-library/user-event/dist/upload';
import api from './api'

import io from 'socket.io-client';


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
        if (error.status === 500) {
            console.log('MailCheckStart Error Code ', error.status);
            return error.status;
        }
        return undefined;
      }
}

export const promptFileLoad = async () => {
  try {
    const ip = `http://localhost:5000`;
        const response = await api.post(`${ip}/api/datas/prompt`);
        return response;
  } catch (error) {
    console.log('MailCheckStart Error Code ', error, error.status);
      return error.status;
  }
}

export const promptFileUpdate = async (content) => {
  //console.log('content', content);
  
  try {
    const ip = `http://localhost:5000`;
        const response = await api.post(`${ip}/api/datas/update-prompt`, { content });
        return response;
  } catch (error) {
    console.log('MailCheckStart Error Code ', error, error.status);
      return error.status;
  }
}

export const fileSave = async (fileNames, elapsed_time, fileSize) => {
  //console.log('filesave', fileNames);
  
  try {
    const ip = `http://localhost:5000`;
        const response = await api.post(`${ip}/api/datas/files`, {fileNames, elapsed_time, fileSize});

        
        return response;
  } catch (error) {
    if (error.status === 500) {
      console.log('MailCheckStart Error Code ', error, error.status);
      return error.status;
  }
  return undefined;
  }
}