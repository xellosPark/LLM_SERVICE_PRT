//import api from './api'
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000", // 서버의 기본 URL
    headers: {
      "Content-Type": "application/json", // 모든 요청에 기본 Content-Type 설정
    },
  });

export const DownloadResultFile = async (job_id, filename) => {
    try {
        const ip = `http://localhost:5000`;
        const response = await api.get(`${ip}/api/datas/download-result/${filename}?job_id=${job_id}`, {
            responseType: 'blob', // 파일 다운로드를 위해 필요합니다.
        });
        // if (!response.ok) {
        //     throw new Error('파일 다운로드를 실패했습니다');
        // }
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
            // 서버 응답이 있는 경우
            const status = error.response?.status; // 상태 코드
            const data = error.response?.data; // 에러 데이터
            if (status >= 400 && status < 500) {
              console.error("파일 다운로드 클라이언트 에러 (400대):", status, data);
            } else if (status >= 500 && status < 600) {
              console.error("파일 다운로드 서버 에러 (500대):", status, data);
            } else {
              console.error("파일 다운로드 기타 에러:", status, data || error.message);
            }
            return error.response;
          } else if (error.request) {
            // 요청이 서버에 도달했지만 응답을 받지 못한 경우
            console.error("파일 다운로드 실패 요청 객체:", error, error.request || error.data);
            return error;
          } else {
            // 요청 설정 중 오류 발생
            console.error("파일 다운로드 에러 메시지:", error, error.message || error.data);
            return error;
          }
    }
}