import api from './api'


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
      return error.response.data;
    }
    if (error.status) {
      console.log('MailCheckStart Error Code ', error.status);
      return error.status;
  }
  //return undefined;
  }
}

export const SendEvalData = async (data) => {
    try {
        const ip = `http://localhost:5000`;
        const response = await api.post(`${ip}/api/datas/mail-compliance-check/save_evaluation`, data);
        
        return response;
      } catch (error) {
        if (error.status === 500) {
            console.log('MailCheckStart Error Code ', error.status);
            return error.status;
        }
        return undefined;
      }
}
