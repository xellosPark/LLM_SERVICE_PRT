//import api from './api'
import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:5000", // 서버의 기본 URL
  headers: {
    "Content-Type": "application/json", // 모든 요청에 기본 Content-Type 설정
  },
});

export const LoadResultFile = async (job_id, sheet, type) => {
  try {
    const response = await api.get(`http://localhost:5000/api/datas/excel-data?job_id=${job_id}&sheet=${sheet}&type=${type}`);
      // if (!response.ok) {
      //   throw new Error('시트 데이터를 가져오는 데 실패했습니다');
      // }
      //const dataJson = await response.json();
      //console.log('Fetched result:', dataJson); // 가져온 결과 로그 출력
      return response;
  } catch (error) {

    if (error.response) {
      // 서버 응답이 있는 경우
      const status = error.response?.status; // 상태 코드
      const data = error.response?.data; // 에러 데이터
      if (status >= 400 && status < 500) {
        console.error("Evaluation Result File Load 클라이언트 에러 (400대):", status, data);
      } else if (status >= 500 && status < 600) {
        console.error("Evaluation Result File Load 서버 에러 (500대):", status, data);
      } else {
        console.error("Evaluation Result File Load 기타 에러:", status, data || error.message);
      }
      return error.response;
    } else if (error.request) {
      // 요청이 서버에 도달했지만 응답을 받지 못한 경우
      console.error("Evaluation Result File Load 실패 요청 객체:", error, error.request || error.data);
      return error;
    } else {
      // 요청 설정 중 오류 발생
      console.error("Evaluation Result File Load 에러 메시지:", error, error.message || error.data);
      return error;
    }
  }
}

export const SendEvalData = async (data) => {
    try {
        const ip = `http://localhost:5000`;
        const response = await api.post(`${ip}/api/datas/mail-compliance-check/save_evaluation`, data);
        
        return response;
      } catch (error) {
        if (error.response) {
          // 서버 응답이 있는 경우
          
          const status = error.response?.status; // 상태 코드
          const data = error.response?.data; // 에러 데이터
          if (status >= 400 && status < 500) {
            console.error("AiCore2 Start 클라이언트 에러 (400대):", status, data);
          } else if (status >= 500 && status < 600) {
            console.error("AiCore2 Start 서버 에러 (500대):", status, data);
          } else {
            console.error("AiCore2 Start 기타 에러:", status, data || error.message);
          }
          return error.response;
        } else if (error.request) {
          // 요청이 서버에 도달했지만 응답을 받지 못한 경우
          console.error("AiCore2 Start 실패 요청 객체:", error, error.request || error.data);
          return error;
        } else {
          // 요청 설정 중 오류 발생
          console.error("AiCore2 Start 에러 메시지:", error, error.message || error.data);
          return error;
        }
      }
}
