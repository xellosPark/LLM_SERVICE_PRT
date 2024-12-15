import axios from "axios";

const api = axios.create({
  baseURL: "http://165.244.190.28:5000",
  headers: {
    "Content-Type": "application/json", // 기본 Content-Type 설정
  },
});

export const LoadAllChecksTable = async () => {
  try {
    const ip = `http://165.244.190.28:5000`;
    const response = await api.get(`${ip}/api/datas/checks-table-data`);
    return response.data;
  } catch (error) {
    if (error.response) {
      const status = error.response?.status;
      const data = error.response?.data;
      if (status >= 400 && status < 500) {
        console.error("Checks Table Load 클라이언트 에러:", status, data);
      } else if (status >= 500 && status < 600) {
        console.error("Checks Table Load 서버 에러:", status, data);
      } else {
        console.error("Checks Table Load 기타 에러:", status, data || error.message);
      }
      return null;
    } else if (error.request) {
      console.error("Checks Table Load 실패 요청 객체:", error);
      return error;
    } else {
      console.error("Checks Table Load 에러 메시지:", error);
      return error;
    }
  }
};

export const LoadChecksRow = async (job_id) => {
  try {
    const ip = `http://165.244.190.28:5000`;
    const response = await api.get(`${ip}/api/datas/checks-table-row?job_id=${job_id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      const status = error.response?.status;
      const data = error.response?.data;
      if (status >= 400 && status < 500) {
        console.error("Checks Row Load 클라이언트 에러:", status, data);
      } else if (status >= 500 && status < 600) {
        console.error("Checks Row Load 서버 에러:", status, data);
      } else {
        console.error("Checks Row Load 기타 에러:", status, data || error.message);
      }
      return [];
    } else if (error.request) {
      console.error("Checks Row Load 실패 요청 객체:", error);
      return [];
    } else {
      console.error("Checks Row Load 에러 메시지:", error);
      return [];
    }
  }
};

export const LoadFilesTable = async (job_id) => {
  try {
    const ip = `http://165.244.190.28:5000`;
    const response = await api.get(`${ip}/api/datas/files-table-data?job_id=${job_id}`);
    console.log('LoadFilesTable', response.data);

    return response.data;
  } catch (error) {
    if (error.response) {
      const status = error.response?.status;
      const data = error.response?.data;
      if (status >= 400 && status < 500) {
        console.error("Files Row Load 클라이언트 에러:", status, data);
      } else if (status >= 500 && status < 600) {
        console.error("Files Row Load 서버 에러:", status, data);
      } else {
        console.error("Files Row Load 기타 에러:", status, data || error.message);
      }
      return [];
    } else if (error.request) {
      console.error("Files Row Load 실패 요청 객체:", error);
      return [];
    } else {
      console.error("Files Row Load 에러 메시지:", error);
      return [];
    }
  }
};

export const LoadEvaluationRow = async (job_id) => {
  try {
    const ip = `http://165.244.190.28:5000`;
    const response = await api.get(`${ip}/api/datas/evaluation-table-data?job_id=${job_id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      const status = error.response?.status;
      const data = error.response?.data;
      if (status >= 400 && status < 500) {
        console.error("Evaluations Row Load 클라이언트 에러:", status, data);
      } else if (status >= 500 && status < 600) {
        console.error("Evaluations Row Load 서버 에러:", status, data);
      } else {
        console.error("Evaluations Row Load 기타 에러:", status, data || error.message);
      }
      return [];
    } else if (error.request) {
      console.error("Evaluation Row Load 실패 요청 객체:", error);
      return [];
    } else {
      console.error("Evaluation Row Load 에러 메시지:", error);
      return [];
    }
  }
};

export const LoadJoinChecksEvalTable = async () => {
  try {
    const ip = `http://165.244.190.28:5000`;
    const response = await api.get(`${ip}/api/datas/checks-eval-table-join`);
    return response.data;
  } catch (error) {
    if (error.response) {
      const status = error.response?.status;
      const data = error.response?.data;
      if (status >= 400 && status < 500) {
        console.error("Join Checks, Evaluations Table Load 클라이언트 에러:", status, data);
      } else if (status >= 500 && status < 600) {
        console.error("Join Checks, Evaluations Table Load 서버 에러:", status, data);
      } else {
        console.error("Join Checks, Evaluations Table Load 기타 에러:", status, data || error.message);
      }
      return null;
    } else if (error.request) {
      console.error("Join Checks, Evaluations Table Load 실패 요청 객체:", error);
      return null;
    } else {
      console.error("Join Checks, Evaluations Table Load 에러 메시지:", error);
      return null;
    }
  }
};

export const DeleteRow = async (job_id) => {
  try {
    const ip = `http://165.244.190.28:5000`;
    const response = await api.get(`${ip}/api/datas/delete-row?job_id=${job_id}`);
    return response;
  } catch (error) {
    if (error.response) {
      const status = error.response?.status;
      const data = error.response?.data;
      if (status >= 400 && status < 500) {
        console.error("Delete Row 클라이언트 에러:", status, data);
      } else if (status >= 500 && status < 600) {
        console.error("Delete Row 서버 에러:", status, data);
      } else {
        console.error("Delete Row 기타 에러:", status, data || error.message);
      }
      return error.response;
    } else if (error.request) {
      console.error("Delete Row 실패 요청 객체:", error);
      return error;
    } else {
      console.error("Delete Row 에러 메시지:", error);
      return error;
    }
  }
};

export const LoadLlmsTable = async () => {
  try {
    const ip = `http://165.244.190.28:5000`;
    const response = await api.get(`${ip}/api/datas/load-llms-table`);
    return response.data;
  } catch (error) {
    if (error.response) {
      const status = error.response?.status;
      const data = error.response?.data;
      if (status >= 400 && status < 500) {
        console.error("Llms Table Load 클라이언트 에러:", status, data);
      } else if (status >= 500 && status < 600) {
        console.error("Llms Table Load 서버 에러:", status, data);
      } else {
        console.error("Llms Table Load 기타 에러:", status, data || error.message);
      }
      return [];
    } else if (error.request) {
      console.error("Llms Table Load 실패 요청 객체:", error);
      return [];
    } else {
      console.error("Llms Table Load 에러 메시지:", error);
      return [];
    }
  }
};

export const CheckUserName = async (name) => {
  try {
    const ip = `http://165.244.190.28:5000`;
    const response = await api.get(`${ip}/api/users/${name}`);
    return response;
  } catch (error) {
    if (error.response) {
      const status = error.response?.status;
      const data = error.response?.data;
      if (status >= 400 && status < 500) {
        console.error("Users Row Load 클라이언트 에러:", status, data);
      } else if (status >= 500 && status < 600) {
        console.error("Users Row Load 서버 에러:", status, data);
      } else {
        console.error("Users Row Load 기타 에러:", status, data || error.message);
      }
      return error.response;
    } else if (error.request) {
      console.error("Users Row Load 실패 요청 객체:", error);
      return error;
    } else {
      console.error("Users Row Load 에러 메시지:", error);
      return error;
    }
  }
};