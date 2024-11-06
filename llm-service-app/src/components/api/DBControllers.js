import api from './api'

export const LoadAllChecksTable = async () => {
    try {
        const ip = `http://localhost:5000`;
        const response = await api.get(`${ip}/api/datas/checks-table-data`);
        
        return response.data;
      } catch (error) {
        if (error.status === 500) {
            console.log('MailCheckStart Error Code ', error.status);
            return error.status;
        }
        return undefined;
      }
}

export const LoadChecjTable = async () => {
  try {
    const ip = `http://localhost:5000`;
    const response = await api.get(`${ip}/api/datas/checks-table-data`);
    
    return response.data;
  } catch (error) {
    if (error.status === 500) {
        console.log('MailCheckStart Error Code ', error.status);
        return error.status;
    }
    return undefined;
  }
}


export const LoadFilesTable = async (job_id) => {
    try {
        const ip = `http://localhost:5000`;
        const response = await api.get(`${ip}/api/datas/files-table-data?job_id=${job_id}`);
        
        return response.data;
      } catch (error) {
        if (error.status === 500) {
            console.log('MailCheckStart Error Code ', error.status);
            return error.status;
        }
        return undefined;
      }
}