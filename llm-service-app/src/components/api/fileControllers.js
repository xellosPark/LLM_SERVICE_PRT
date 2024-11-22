import api from './api'


export const DownloadResultFile = async (job_id, filename) => {
    try {
        const ip = `http://165.244.190.28:5000`;
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
            console.error('다운로드 실패: 상태 코드', response.status);
        }
    } catch (error) {
        console.error('파일 다운로드 중 오류 발생', error);
    }
    return undefined;
}