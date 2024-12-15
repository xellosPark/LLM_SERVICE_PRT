import axios from 'axios';

const api = axios.create({
  baseURL: "http://165.244.190.28:5000", // 기본 서버 URL
  headers: {
    "Content-Type": "application/json", // 기본 Content-Type 설정
  },
});

export const MailCheckStart = async (mailItems) => {
  try {
    const ip = `http://165.244.190.28:5000`;
    const response = await api.post(`${ip}/api/datas/mail-compliance-check/start`, mailItems);
    return response;
  } catch (error) {
    if (error.response) {
      const status = error.response?.status;
      const data = error.response?.data;
      if (status >= 400 && status < 500) {
        console.error("AiCore1 Start 클라이언트 에러:", status, data);
      } else if (status >= 500 && status < 600) {
        console.error("AiCore1 Start 서버 에러:", status, data);
      } else {
        console.error("AiCore1 Start 기타 에러:", status, data || error.message);
      }
      return error.response;
    } else if (error.request) {
      console.error("AiCore1 Start 요청 실패:", error);
      return error;
    } else {
      console.error("AiCore1 Start 에러 메시지:", error);
      return error;
    }
  }
};

export const promptFileLoad = async () => {
  try {
    const ip = `http://165.244.190.28:5000`;
    const response = await api.post(`${ip}/api/datas/prompt`);
    return response;
  } catch (error) {
    if (error.response) {
      const status = error.response?.status;
      const data = error.response?.data;
      if (status >= 400 && status < 500) {
        console.error("Prompt File Load 클라이언트 에러:", status, data);
      } else if (status >= 500 && status < 600) {
        console.error("Prompt File Load 서버 에러:", status, data);
      } else {
        console.error("Prompt File Load 기타 에러:", status, data || error.message);
      }
      return error.response;
    } else if (error.request) {
      console.error("Prompt File Load 요청 실패:", error);
      return error;
    } else {
      console.error("Prompt File Load 에러 메시지:", error);
      return error;
    }
  }
};

export const promptFileUpdate = async (content) => {
  try {
    const ip = `http://165.244.190.28:5000`;
    const response = await api.post(`${ip}/api/datas/update-prompt`, { content });
    return response;
  } catch (error) {
    if (error.response) {
      const status = error.response?.status;
      const data = error.response?.data;
      if (status >= 400 && status < 500) {
        console.error("Prompt File Update 클라이언트 에러:", status, data);
      } else if (status >= 500 && status < 600) {
        console.error("Prompt File Update 서버 에러:", status, data);
      } else {
        console.error("Prompt File Update 기타 에러:", status, data || error.message);
      }
      return error.response;
    } else if (error.request) {
      console.error("Prompt File Update 요청 실패:", error);
      return error;
    } else {
      console.error("Prompt File Update 에러 메시지:", error);
      return error;
    }
  }
};

export const fileSave = async (fileNames, elapsed_time, fileSize, createTime) => {
  try {
    const ip = `http://165.244.190.28:5000`;
    const response = await api.post(`${ip}/api/datas/files`, { fileNames, elapsed_time, fileSize, createTime });
    return response;
  } catch (error) {
    if (error.response) {
      const status = error.response?.status;
      const data = error.response?.data;
      if (status >= 400 && status < 500) {
        console.error("파일 저장 클라이언트 에러:", status, data);
      } else if (status >= 500 && status < 600) {
        console.error("파일 저장 서버 에러:", status, data);
      } else {
        console.error("파일 저장 기타 에러:", status, data || error.message);
      }
      return error.response;
    } else if (error.request) {
      console.error("파일 저장 요청 실패:", error);
      return error;
    } else {
      console.error("파일 저장 에러 메시지:", error);
      return error;
    }
  }
};