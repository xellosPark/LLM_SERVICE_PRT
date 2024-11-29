//import api from './api'
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // 서버의 기본 URL
  headers: {
    "Content-Type": "application/json", // 모든 요청에 기본 Content-Type 설정
  },
});

export const LoadAllChecksTable = async () => {
    try {
        const ip = `http://localhost:5000`;
        const response = await api.get(`${ip}/api/datas/checks-table-data`);
        
        return response.data;
      } catch (error) {
        if (error.response) {
          // 서버 응답이 있는 경우
          const status = error.response?.status; // 상태 코드
          const data = error.response?.data; // 에러 데이터
          if (status >= 400 && status < 500) {
            console.error("Checks Table Load 클라이언트 에러 (400대):", status, data);
          } else if (status >= 500 && status < 600) {
            console.error("Checks Table Load 서버 에러 (500대):", status, data);
          } else {
            console.error("Checks Table Load 기타 에러:", status, data || error.message);
          }
          return null;
        } else if (error.request) {
          // 요청이 서버에 도달했지만 응답을 받지 못한 경우
          console.error("Checks Table Load 실패 요청 객체:", error, error.request || error.data);
          return error;
        } else {
          // 요청 설정 중 오류 발생
          console.error("Checks Table Load 에러 메시지:", error, error.message || error.data);
          return error;
        }
      }
}

export const LoadChecksRow = async (job_id) => {
  try {
    const ip = `http://localhost:5000`;
    const response = await api.get(`${ip}/api/datas/checks-table-row?job_id=${job_id}`);
    
    return response.data;
  } catch (error) {

    if (error.response) {
      // 서버 응답이 있는 경우
      const status = error.response?.status; // 상태 코드
      const data = error.response?.data; // 에러 데이터
      if (status >= 400 && status < 500) {
        console.error("Checks Row Load 클라이언트 에러 (400대):", status, data);
      } else if (status >= 500 && status < 600) {
        console.error("Checks Row Load 서버 에러 (500대):", status, data);
      } else {
        console.error("Checks Row Load 기타 에러:", status, data || error.message);
      }
      return [];
    } else if (error.request) {
      // 요청이 서버에 도달했지만 응답을 받지 못한 경우
      console.error("Checks Row Load 실패 요청 객체:", error, error.request || error.data);
      return [];
    } else {
      // 요청 설정 중 오류 발생
      console.error("Checks Row Load 에러 메시지:", error, error.message || error.data);
      return [];
    }
  }
}

export const LoadFilesTable = async (job_id) => {
    try {
        const ip = `http://localhost:5000`;
        const response = await api.get(`${ip}/api/datas/files-table-data?job_id=${job_id}`);
        console.log('LoadFilesTable', response.data);
        
        return response.data;
      } catch (error) {
        if (error.response) {
          // 서버 응답이 있는 경우
          const status = error.response?.status; // 상태 코드
          const data = error.response?.data; // 에러 데이터
          if (status >= 400 && status < 500) {
            console.error("Files Row Load 클라이언트 에러 (400대):", status, data);
          } else if (status >= 500 && status < 600) {
            console.error("Files Row Load 서버 에러 (500대):", status, data);
          } else {
            console.error("Files Row Load 기타 에러:", status, data || error.message);
          }
          return [];
        } else if (error.request) {
          // 요청이 서버에 도달했지만 응답을 받지 못한 경우
          console.error("Files Row Load 실패 요청 객체:", error, error.request || error.data);
          return [];
        } else {
          // 요청 설정 중 오류 발생
          console.error("Files Row Load 에러 메시지:", error, error.message || error.data);
          return [];
        }
      }
}

export const LoadEvaluationRow = async (job_id) => {
  
  try {
    const ip = `http://localhost:5000`;
    const response = await api.get(`${ip}/api/datas/evaluation-table-data?job_id=${job_id}`);
    
    return response.data;
  } catch (error) {
    if (error.response) {
      // 서버 응답이 있는 경우
      const status = error.response?.status; // 상태 코드
      const data = error.response?.data; // 에러 데이터
      if (status >= 400 && status < 500) {
        console.error("Evaluations Row Load 클라이언트 에러 (400대):", status, data);
      } else if (status >= 500 && status < 600) {
        console.error("Evaluations Row Load 서버 에러 (500대):", status, data);
      } else {
        console.error("Evaluations Row Load 기타 에러:", status, data || error.message);
      }
      return [];
    } else if (error.request) {
      // 요청이 서버에 도달했지만 응답을 받지 못한 경우
      console.error("Evaluation Row Load 실패 요청 객체:", error, error.request || error.data);
      return [];
    } else {
      // 요청 설정 중 오류 발생
      console.error("Evaluation Row Load 에러 메시지:", error, error.message || error.data);
      return [];
    }
  }
}

export const LoadJoinChecksEvalTable = async () => {
  try {
    const ip = `http://localhost:5000`;
    const response = await api.get(`${ip}/api/datas/checks-eval-table-join`);
    
    return response.data;
  } catch (error) {
    if (error.response) {
      // 서버 응답이 있는 경우
      const status = error.response?.status; // 상태 코드
      const data = error.response?.data; // 에러 데이터
      if (status >= 400 && status < 500) {
        console.error("Join Checks, Evaluations Table Load 클라이언트 에러 (400대):", status, data);
      } else if (status >= 500 && status < 600) {
        console.error("Join Checks, Evaluations Table Load 서버 에러 (500대):", status, data);
      } else {
        console.error("Join Checks, Evaluations Table Load 기타 에러:", status, data || error.message);
      }
      return null;
    } else if (error.request) {
      // 요청이 서버에 도달했지만 응답을 받지 못한 경우
      console.error("Join Checks, Evaluations Table Load 실패 요청 객체:", error, error.request || error.data);
      return null;
    } else {
      // 요청 설정 중 오류 발생
      console.error("Join Checks, Evaluations Table Load 에러 메시지:", error, error.message || error.data);
      return null;
    }
  }
}

export const DeleteRow = async (job_id) => {
  try {
    const ip = `http://localhost:5000`;
    const response = await api.get(`${ip}/api/datas/delete-row?job_id=${job_id}`);
    //console.log('response', response);
    
    return response;
  } catch (error) {
    if (error.response) {
      // 서버 응답이 있는 경우
      const status = error.response?.status; // 상태 코드
      const data = error.response?.data; // 에러 데이터
      if (status >= 400 && status < 500) {
        console.error("Delete Row 클라이언트 에러 (400대):", status, data);
      } else if (status >= 500 && status < 600) {
        console.error("Delete Row 서버 에러 (500대):", status, data);
      } else {
        console.error("Delete Row 기타 에러:", status, data || error.message);
      }
      return error.response;
    } else if (error.request) {
      // 요청이 서버에 도달했지만 응답을 받지 못한 경우
      console.error("Delete Row 실패 요청 객체:", error, error.request || error.data);
      return error;
    } else {
      // 요청 설정 중 오류 발생
      console.error("Delete Row 에러 메시지:", error, error.message || error.data);
      return error;
    }
  }
}

export const LoadLlmsTable = async () => {
  try {
    const ip = `http://localhost:5000`;
    const response = await api.get(`${ip}/api/datas/load-llms-table`);
    
    return response.data;
  } catch (error) {
    if (error.response) {
      // 서버 응답이 있는 경우
      const status = error.response?.status; // 상태 코드
      const data = error.response?.data; // 에러 데이터
      if (status >= 400 && status < 500) {
        console.error("Llms Table Load 클라이언트 에러 (400대):", status, data);
      } else if (status >= 500 && status < 600) {
        console.error("Llms Table Load 서버 에러 (500대):", status, data);
      } else {
        console.error("Llms Table Load 기타 에러:", status, data || error.message);
      }
      return error.response;
    } else if (error.request) {
      // 요청이 서버에 도달했지만 응답을 받지 못한 경우
      console.error("Llms Table Load 실패 요청 객체:", error, error.request || error.data);
      return error;
    } else {
      // 요청 설정 중 오류 발생
      console.error("Llms Table Load 에러 메시지:", error, error.message || error.data);
      return error;
    }
  }
}

export const LoadLlmsRow = async (id) => {
  try {
    const ip = `http://localhost:5000`;
    const response = await api.get(`${ip}/api/datas/load-llms-row?id=${id}`);
    return response.data;
  } catch (error) {

    if (error.response) {
      // 서버 응답이 있는 경우
      const status = error.response?.status; // 상태 코드
      const data = error.response?.data; // 에러 데이터
      if (status >= 400 && status < 500) {
        console.error("Llms Row Load 클라이언트 에러 (400대):", status, data);
      } else if (status >= 500 && status < 600) {
        console.error("Llms Row Load 서버 에러 (500대):", status, data);
      } else {
        console.error("Llms Row Load 기타 에러:", status, data || error.message);
      }
      return error.response;
    } else if (error.request) {
      // 요청이 서버에 도달했지만 응답을 받지 못한 경우
      console.error("Llms Row Load 실패 요청 객체:", error, error.request || error.data);
      return error;
    } else {
      // 요청 설정 중 오류 발생
      console.error("Llms Row Load 에러 메시지:", error, error.message || error.data);
      return error;
    }
  }
}

export const CheckUserName = async (name) => {
  try {
    const ip = `http://localhost:5000`;
    const response = await api.get(`${ip}/api/users/${name}`);
    return response;
  } catch (error) {
    if (error.response) {
      // 서버 응답이 있는 경우
      const status = error.response?.status; // 상태 코드
      const data = error.response?.data; // 에러 데이터
      if (status >= 400 && status < 500) {
        console.error("Users Row Load 클라이언트 에러 (400대):", status, data);
      } else if (status >= 500 && status < 600) {
        console.error("Users Row Load 서버 에러 (500대):", status, data);
      } else {
        console.error("Users Row Load 기타 에러:", status, data || error.message);
      }
      return error.response;
    } else if (error.request) {
      // 요청이 서버에 도달했지만 응답을 받지 못한 경우
      console.error("Users Row Load 실패 요청 객체:", error, error.request || error.data);
      return error;
    } else {
      // 요청 설정 중 오류 발생
      console.error("Users Row Load 에러 메시지:", error, error.message || error.data);
      return error;
    }
  }
}