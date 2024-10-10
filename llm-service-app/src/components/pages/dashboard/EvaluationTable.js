import { useEffect, useRef, useState } from "react";
import Pagination from "../Pagination/Pagination";
import './EvaluationTable.css'

const EvaluationTable = () => {
    const columns = [
        { key: 'id', label: 'Id', minWidth: '1', },
        { key: 'file', label: 'File', minWidth: '0', },
        { key: 'send', label: '보낸사람/사용자', minWidth: '0', },
        { key: 'receive', label: '받는사람/대화상대/호스트', minWidth: '0', },
        { key: 'title', label: '제목/서브 URL/인스턴트 메신저/웹하드', minWidth: '0', },
        { key: 'time', label: '시각', minWidth: '0', },
        { key: 'fileName', label: '파일이름', minWidth: '0', },
        { key: 'reference', label: '참조인', minWidth: '0', },
        { key: 'hiddenRef', label: '실수취인/숨은참조/POP3서버 ID', minWidth: '0', },
        { key: 'analyzeFiles', label: '파일 분석 여부', minWidth: '0', },
        { key: 'name', label: '이름', minWidth: '0', },
        { key: 'mainContent', label: '본문', minWidth: '0', },
        { key: 'content', label: '판단 근거 문장', minWidth: '5', },

        { key: 'blenk', label: '', minWidth: '0', },

        { key: 'complianceRisk', label: 'Compliance Risk', minWidth: '5', },
        { key: 'result', label: '평가 기록(선택)', minWidth: '5', },
    ];

    const datas = [
        {
            id: 1, file: '파일 없음', send: 'nakyeong1.kim@lge.com', receive: 'nan', title: 'FW: 로보테크쇼 전시회 부스 디자인 공유',
            time: '2024-06-01 4:11', fileName: 'nan', reference: 'nan', hiddenRef: '<a@naver.com>', analyzeFiles: '파일 없음',
            name: '김나경', mainContent: 'Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 ', content: '데이터1', complianceRisk: 'true', result: '데이터1',
        },
        { id: 2, mainContent: 'Table 두번째 데이터', content: '데이터2', complianceRisk: 'true', result: '', },
        { id: 3, mainContent: 'Table 세번째 데이터', content: '데이터3', complianceRisk: 'false', result: '데이터3', },
        { id: 4, mainContent: 'Table 네번째 데이터', content: '데이터4', complianceRisk: 'true', result: '데이터4', },
        { id: 5, mainContent: 'Table 네번째 데이터', content: '데이터4', complianceRisk: 'true', result: '데이터4', },
        { id: 6, mainContent: 'Table 네번째 데이터', content: '데이터4', complianceRisk: 'true', result: '데이터4', },
        { id: 7, mainContent: 'Table 네번째 데이터', content: '데이터4', complianceRisk: 'true', result: '데이터4', },
        { id: 8, mainContent: 'Table 네번째 데이터', content: '데이터4', complianceRisk: 'true', result: '데이터4', },
        { id: 9, mainContent: 'Table 네번째 데이터', content: '데이터4', complianceRisk: 'true', result: '데이터4', },
        { id: 10, mainContent: 'Table 네번째 데이터', content: '데이터4', complianceRisk: 'true', result: '데이터4', },
        { id: 11, mainContent: 'Table 네번째 데이터', content: '데이터4', complianceRisk: 'true', result: '데이터4', },
        { id: 12, mainContent: 'Table 네번째 데이터', content: '데이터4', complianceRisk: 'true', result: '데이터4', },
        { id: 13, mainContent: 'Table 네번째 데이터', content: 'Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 ', complianceRisk: 'true', result: '데이터4', },
        { id: 14, mainContent: 'Table 네번째 데이터', content: '데이터4', complianceRisk: 'true', result: '데이터4', },
        { id: 15, mainContent: 'Table 네번째 데이터', content: '데이터4', complianceRisk: 'true', result: '데이터4', },
        { id: 16, mainContent: 'Table 네번째 데이터', content: 'Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 ', complianceRisk: 'true', result: '데이터4', },
        { id: 17, mainContent: 'Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 Table 첫번째 데이터 테스트를 위해 많은 내용을 표시 ', content: '데이터4', complianceRisk: 'true', result: '데이터4', },
        { id: 18, mainContent: 'Table 네번째 데이터', content: '데이터4', complianceRisk: 'true', result: '데이터4', },
        { id: 19, mainContent: 'Table 네번째 데이터', content: '데이터4', complianceRisk: 'true', result: '데이터4', },
        { id: 20, mainContent: 'Table 네번째 데이터', content: '데이터4', complianceRisk: 'true', result: '데이터4', },
        { id: 21, mainContent: 'Table 네번째 데이터', content: '데이터4', complianceRisk: 'true', result: '데이터4', },
        { id: 22, mainContent: 'Table 네번째 데이터', content: '데이터4', complianceRisk: 'true', result: '데이터4', },
        { id: 23, mainContent: 'Table 네번째 데이터', content: '데이터4', complianceRisk: 'true', result: '데이터4', },
        { id: 24, mainContent: 'Table 네번째 데이터', content: '데이터4', complianceRisk: 'true', result: '데이터4', },
        { id: 25, mainContent: 'Table 네번째 데이터', content: '데이터4', complianceRisk: 'true', result: '데이터4', },
        { id: 26, mainContent: 'Table 네번째 데이터', content: '데이터4', complianceRisk: 'true', result: '데이터4', },
        { id: 27, mainContent: 'Table 네번째 데이터', content: '데이터4', complianceRisk: 'true', result: '데이터4', },
        { id: 28, mainContent: 'Table 네번째 데이터', content: '데이터4', complianceRisk: 'true', result: '데이터4', },
    ];

    const [columnWidths, setColumnWidths] = useState({
        id: 2,
        file: 0,
        send: 0,
        receive: 0,
        title: 0,
        time: 0,
        fileName: 0,
        reference: 0,
        hiddenRef: 0,
        analyzeFiles: 0,
        name: 0,
        mainContent: 40,
        content: 40,
        blenk: 0,
        complianceRisk: 40,
        result: 40,
    });

    const [value, setData] = useState(datas);

    const handleChange = (index, event) => {
        const newData = [...value];
        newData[index].result = event.target.value;
        setData(newData);
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);

    const [tooltip, setTooltip] = useState({ visible: false, content: '', top: 0, left: 0 });
    const tooltipRef = useRef(null); // 툴팁 요소를 참조하기 위한 useRef

    const handleColumnClick = (event, content) => {
        if (content === undefined || content === "")
            return;
        const clickY = event.clientY;
        const clickX = event.clientX;
    
        setTooltip({
            visible: true,
            content,
            top: clickY, // 초기 top 값은 임시로 설정
            left: clickX + 15,
        });
    };

      const closeTooltip = () => {
        setTooltip({ visible: false, content: '', top: 0, left: 0 });
      };

    // 현재 페이지에 맞는 데이터를 계산
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = value.slice(indexOfFirstItem, indexOfLastItem);

    // columnRefs를 빈 객체로 초기화합니다.
    const columnRefs = useRef({});
    const resizingState = useRef({ startX: 0, startWidth: 0 });

    const startResizing = (e, column) => {
        // 현재 열의 너비와 클릭 위치 간의 차이 보정
        const boundingRect = columnRefs.current[column.key].getBoundingClientRect();
        const diff = e.clientX - boundingRect.right;

        resizingState.current.startX = e.clientX;
        resizingState.current.startWidth = columnRefs.current[column.key].offsetWidth;
        resizingState.current.diff = diff;

        const onMouseMove = (moveEvent) => {
            // 보정된 위치에서 너비 계산
            const newWidth =
                resizingState.current.startWidth + (moveEvent.clientX - resizingState.current.startX) - resizingState.current.diff;

            setColumnWidths((prevWidths) => ({
                ...prevWidths,
                [column.key]: newWidth > column.minWidth ? newWidth : column.minWidth,
            }));
        };

        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
            closeTooltip();
          }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

      useEffect(() => {
        if (tooltip.content === undefined || tooltip.content === "")
            return;
        
        if (tooltip.visible && tooltipRef.current) {
          const tooltipElement = tooltipRef.current;
          const windowHeight = window.innerHeight;
          const tooltipHeight = tooltipElement.offsetHeight; // 실제 툴팁 높이 측정
          const tooltipTop = tooltip.top;
    
          // 화면 아래로 나가는지 여부 확인 후 조정
          const adjustedTop =
            tooltipTop + tooltipHeight > windowHeight
              ? windowHeight - tooltipHeight - 10 // 화면 아래로 나가지 않도록 조정
              : tooltipTop;
    
          // 툴팁의 top 값을 다시 업데이트
          setTooltip((prevTooltip) => ({
            ...prevTooltip,
            top: adjustedTop,
          }));
        }
      }, [tooltip.visible, tooltip.top]);

    return (
        <div>
            <div className="eval-table-container">
                <table className='eval-table'>
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    ref={(el) => {
                                        if (el) columnRefs.current[column.key] = el;
                                    }}
                                    style={{ width: `${columnWidths[column.key]}%`, position: 'relative', position: 'sticky', top: '0' }}
                                >
                                    <div className="table-th">
                                        <div>{column.label}</div>
                                        {
                                            column.key === 'complianceRisk' && <div className="risk-th-button" type='button' onClick={() => alert(`Action on row: ${column.id}`)}>적용</div>
                                        }
                                    </div>
                                    <div
                                        onMouseDown={(e) => startResizing(e, column)}
                                        style={{
                                            position: "absolute",
                                            right: 0,
                                            top: 0,
                                            width: "5px",
                                            height: "100%",
                                            cursor: "col-resize",
                                        }}
                                    />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item, index) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td onClick={(e) => handleColumnClick(e, item.file)}>
                                    {item.file}
                                </td>
                                <td onClick={(e) => handleColumnClick(e, item.send)}>
                                    {item.send}
                                </td>
                                <td onClick={(e) => handleColumnClick(e, item.receive)}>
                                    {item.receive}
                                </td>
                                <td onClick={(e) => handleColumnClick(e, item.title)}>
                                    {item.title}
                                </td>
                                <td onClick={(e) => handleColumnClick(e, item.time)}>
                                    {item.time}
                                </td>
                                <td onClick={(e) => handleColumnClick(e, item.fileName)}>
                                    {item.fileName}
                                </td>
                                <td onClick={(e) => handleColumnClick(e, item.reference)}>
                                    {item.reference}
                                </td>
                                <td onClick={(e) => handleColumnClick(e, item.hiddenRef)}>
                                    {item.hiddenRef}
                                </td>
                                <td onClick={(e) => handleColumnClick(e, item.analyzeFiles)}>
                                    {item.analyzeFiles}
                                </td>
                                <td onClick={(e) => handleColumnClick(e, item.name)}>
                                    {item.name}
                                </td>
                                <td onClick={(e) => handleColumnClick(e, item.mainContent)}>
                                    {item.mainContent}
                                </td>
                                <td onClick={(e) => handleColumnClick(e, item.content)}>
                                    {item.content}
                                </td>
                                <td>{item.blenk}</td>
                                <td>
                                    <button className="risk-td-button" style={{ backgroundColor: item.complianceRisk === 'true' ? 'red' : 'gray' }}>Risk</button>
                                </td>
                                <td>
                                    <input className="eval-td-textarea"
                                        value={item.result}
                                        onChange={(event) => handleChange(index, event)}
                                        placeholder="Type something here..." />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {tooltip.visible && (
                    <div 
                    className="tooltip"
                    ref={tooltipRef} // 툴팁 요소를 참조
                    style={{ top: tooltip.top, left: tooltip.left, position: 'absolute' }}
                    >
                    {tooltip.content}
                    </div>
                )}
            </div>
            <div>
                <Pagination
                    postsPerPage={itemsPerPage} // 페이지 당 포스트 수
                    totalPosts={datas.length} // 전체 포스트 수
                    paginate={(pageNumber) => setCurrentPage(pageNumber)} // 페이지 번호를 변경하는 함수
                    currentPage={currentPage} // 현재 페이지 번호
                />
            </div>
        </div>
    );
};

export default EvaluationTable;