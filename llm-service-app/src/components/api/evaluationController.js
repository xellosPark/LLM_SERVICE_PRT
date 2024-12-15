import axios from 'axios';

const api = axios.create({
  baseURL: "http://165.244.190.28:5000", // 기본 서버 URL
  headers: {
    "Content-Type": "application/json", // 기본 Content-Type 설정
  },
});

export const LoadResultFile = async (job_id, sheet, type) => {
  try {
    const response = await api.get(`http://165.244.190.28:5000/api/datas/excel-data?job_id=${job_id}&sheet=${sheet}&type=${type}`);
    return response;
  } catch (error) {
    if (error.response) {
      const status = error.response?.status; // 상태 코드
      const data = error.response?.data; // 에러 데이터
      if (status >= 400 && status < 500) {
        console.error("Evaluation Result File Load 클라이언트 에러:", status, data);
      } else if (status >= 500 && status < 600) {
        console.error("Evaluation Result File Load 서버 에러:", status, data);
      } else {
        console.error("Evaluation Result File Load 기타 에러:", status, data || error.message);
      }
      return error.response;
    } else if (error.request) {
      console.error("Evaluation Result File Load 요청 실패:", error);
      return error;
    } else {
      console.error("Evaluation Result File Load 에러 메시지:", error);
      return error;
    }
  }
};

export const SendEvalData = async (data) => {
  try {
    const ip = `http://165.244.190.28:5000`;
    const response = await api.post(`${ip}/api/datas/mail-compliance-check/save_evaluation`, data);
    return response;
  } catch (error) {
    if (error.response) {
      const status = error.response?.status; // 상태 코드
      const data = error.response?.data; // 에러 데이터
      if (status >= 400 && status < 500) {
        console.error("AiCore2 Start 클라이언트 에러:", status, data);
      } else if (status >= 500 && status < 600) {
        console.error("AiCore2 Start 서버 에러:", status, data);
      } else {
        console.error("AiCore2 Start 기타 에러:", status, data || error.message);
      }
      return error.response;
    } else if (error.request) {
      console.error("AiCore2 Start 요청 실패:", error);
      return error;
    } else {
      console.error("AiCore2 Start 에러 메시지:", error);
      return error;
    }
  }
};