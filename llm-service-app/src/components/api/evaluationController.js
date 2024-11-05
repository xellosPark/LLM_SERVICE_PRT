import api from './api'


export const LoadResultFile = async (job_id) => {
  try {
    const response = await fetch(`http://localhost:5000/api/datas/excel-data?job_id=${job_id}`);
      if (!response.ok) {
        throw new Error('시트 데이터를 가져오는 데 실패했습니다');
      }
      const dataJson = await response.json();
      //console.log('Fetched result:', dataJson); // 가져온 결과 로그 출력
      return dataJson;
  } catch (error) {
    if (error.status === 500) {
      console.log('MailCheckStart Error Code ', error.status);
      return error.status;
  }
  return undefined;
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
