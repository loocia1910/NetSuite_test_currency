/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope Public
*/

define([
    'N/record',
    'N/https'
], function(record, https) {
    
    // 한국수출입은행(https://www.koreaexim.go.kr/) 요청 API 인증키
    const KOREA_EXIM_AUTH_KEY = '3ksFj0B4242OrCSNNRQlKXzqXUaJhsiJ'

    function post(requestBody) {
        // 날짜와 검색유형이 와야함
        const res = JSON.parse(requestBody);
        log.debug('post 요청 JSON.parse(requestBody) ==== ', res);

        const { searchDateFld, searchOptionFld } = res;
        const CURRENCY_DATA_FROM_KOREA_EXIM = getCurrencyData(searchDateFld, searchOptionFld);
        setRecordRow(CURRENCY_DATA_FROM_KOREA_EXIM, searchDateFld, searchOptionFld);
        
        const response = {
            success: true,
            testTex: '저장 성공 응답 도착'
        };

        return JSON.stringify(response);
    };

    function getCurrencyData( searchDate, searchOption ) {
        log.debug('post 요청 getCurrencyData 함수에 넘어온 searchDate ==== ', searchDate);
        log.debug('post 요청 getCurrencyData 함수에 넘어온 searchOption ==== ', searchOption);

        const requsttype = searchOption === 'AP01' ? 'exchange' : 
                           searchOption === 'AP02' ? 'interest' : 
                           searchOption === 'AP03' ? 'international' : null;

        const headers = {
            'Accept' : "application/hal+json;charset=utf-8",
            'Content-Type' : 'application/json'
        };

        const res = https.get({
          url:  `https://www.koreaexim.go.kr/site/program/financial/${requsttype}JSON?authkey=${KOREA_EXIM_AUTH_KEY}&searchdate=${searchDate}&data=${searchOption}`,
          headers
        }); 

        log.debug('post 요청 getCurrencyData 함수 res ==== ', res);
        log.debug('post 요청 getCurrencyData 함수  res.body ==== ', res.body);
        return JSON.parse(res.body);
    };

    function setRecordRow(list, searchDate, searchOption) {
        const searchOptionCodeToTxt = searchOption === 'AP01' ? '환율' : 
                                      searchOption === 'AP02' ? '대출금리' : 
                                      searchOption === 'AP03' ? '국제금리' : '존재하지 않는 유형'
        
        for(const obj of list) {
            const { result, cur_unit, ttb, tts, deal_bas_r, bkpr, cur_nm } = obj;
            log.debug("setRecordRow 함수 안에 obj ======= ", obj);

            const prefix = 'custrecord_test_currency_';
            const customRecord = record.create({
                type: 'customrecord_test_currency',
                isDynamic: true
            });

            customRecord.setValue({
                fieldId: prefix + 'search_date',
                value: searchDate,
            });
            customRecord.setValue({
                fieldId: prefix + 'search_type',
                value: searchOptionCodeToTxt,
            });
            customRecord.setValue({
                fieldId: prefix + 'cur_unit',
                value: cur_unit,
            });
            customRecord.setValue({
                fieldId: prefix + 'cur_nm',
                value: cur_nm,
            });
            customRecord.setValue({
                fieldId: prefix + 'ttb',
                value: ttb,
            });
            customRecord.setValue({
                fieldId: prefix + 'tts',
                value: tts,
            });
            customRecord.setValue({
                fieldId: prefix + 'deal_bas_r',
                value: deal_bas_r,
            });
            customRecord.setValue({
                fieldId: prefix + 'bkpr',
                value: bkpr,
            });

            customRecord.save();
            
        }

        
    };
    
    return {
        post
    }
});