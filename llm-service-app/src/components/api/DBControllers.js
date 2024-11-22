import api from './api'

export const LoadAllChecksTable = async () => {
    try {
        const ip = `http://165.244.190.28:5000`;
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

export const LoadChecksRow = async (job_id) => {
  try {
    const ip = `http://165.244.190.28:5000`;
    const response = await api.get(`${ip}/api/datas/checks-table-row?job_id=${job_id}`);
    
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
        const ip = `http://165.244.190.28:5000`;
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

export const LoadEvaluationRow = async (job_id) => {
  
  try {
    const ip = `http://165.244.190.28:5000`;
    const response = await api.get(`${ip}/api/datas/evaluation-table-data?job_id=${job_id}`);
    
    return response.data;
  } catch (error) {
    if (error.status === 500) {
        console.log('MailCheckStart Error Code ', error.status);
        return error.status;
    }
    return undefined;
  }
}

export const LoadJoinChecksEvalTable = async () => {
  try {
    const ip = `http://165.244.190.28:5000`;
    const response = await api.get(`${ip}/api/datas/checks-eval-table-join`);
    return response.data;
  } catch (error) {
    if (error.status === 500) {
      console.log('LoadJoinChecksEvalTable Error Code ', error.status);
      return error.status;
    }
  }
}

export const DeleteRow = async (job_id) => {
  console.log('DeleteRow',job_id);
  
  try {
    const ip = `http://165.244.190.28:5000`;
    const response = await api.get(`${ip}/api/datas/delete-row?job_id=${job_id}`);
    //console.log('response', response);
    
    return response;
  } catch (error) {
    if (error.status === 500) {
      console.log('LoadJoinChecksEvalTable Error Code ', error.status);
      return error.status;
    }
  }
}

export const LoadLlmsTable = async () => {
  try {
    const ip = `http://165.244.190.28:5000`;
    const response = await api.get(`${ip}/api/datas/load-llms-table`);
    return response.data;
  } catch (error) {
    if (error.status === 500) {
      console.log('LoadLlmsTable Error Code ', error.status);
      return error.status;
    }
  }
}

export const LoadLlmsRow = async (id) => {
  try {
    const ip = `http://165.244.190.28:5000`;
    const response = await api.get(`${ip}/api/datas/load-llms-row?id=${id}`);
    return response.data;
  } catch (error) {
    if (error.status === 500) {
      console.log('LoadLlmsRow Error Code ', error.status);
      return error.status;
    }
  }
}