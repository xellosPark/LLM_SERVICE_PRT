import axios from "axios";

const api = axios.create({
  baseURL: "http://165.244.190.28:5000", // 기본 서버 URL
  headers: {
    "Content-Type": "application/json", // 기본 Content-Type 설정
  },
});

export const DownloadResultFile = async (job_id, filename) => {
  try {
    const ip = `http://165.244.190.28:5000`;
    const response = await api.get(`${ip}/api/datas/download-result/${filename}?job_id=${job_id}`, {
      responseType: 'blob', // 파일 다운로드를 위해 필요
    });

    if (response.status === 200) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename); // 파일 이름 설정
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } else {
      console.error('파일 다운로드 실패: 상태 코드', response.status, response);
    }
    return response;
  } catch (error) {
    if (error.response) {
      const status = error.response?.status; // 상태 코드
      const data = error.response?.data; // 에러 데이터
      if (status >= 400 && status < 500) {
        console.error("파일 다운로드 클라이언트 에러:", status, data);
      } else if (status >= 500 && status < 600) {
        console.error("파일 다운로드 서버 에러:", status, data);
      } else {
        console.error("파일 다운로드 기타 에러:", status, data || error.message);
      }
      return error.response;
    } else if (error.request) {
      console.error("파일 다운로드 요청 실패:", error);
      return error;
    } else {
      console.error("파일 다운로드 에러 메시지:", error);
      return error;
    }
  }
};