/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope Public
*/

define([
    'N/record',
    'N/https',
    './common_alias.js'
], function(record, https, alias) {
    
    // 한국수출입은행(https://www.koreaexim.go.kr/) 요청 API 인증키
    const KOREA_EXIM_AUTH_KEY = '3ksFj0B4242OrCSNNRQlKXzqXUaJhsiJ';
    const RECORD = {
      AP01 :  { name : 'test_currency', type : 'AP01', type_ko : '환율', type_en : 'exchange' },
      AP02 :  { name : 'test_cur_ap02', type : 'AP02', type_ko : '대출금리', type_en : 'interest' },
      AP03 :  { name : 'test_cur_ap03', type : 'AP03', type_ko : '국제금리', type_en : 'international'  },
    };

    function post(requestBody) {
        // 날짜와 검색유형이 와야함
        const res = JSON.parse(requestBody);
        log.debug('post 요청 JSON.parse(requestBody) ==== ', res);

        const { searchDateFld, searchOptionFld } = res;
        const searchOptObj = RECORD[searchOptionFld];
        log.debug('post 요청 searchOptObj ==== ', searchOptObj);

        const CURRENCY_DATA_FROM_KOREA_EXIM = getCurrencyData(searchDateFld, searchOptObj); //

        let response = {};

        // result = 1 : 성공, 2 : DATA코드 오류, 3 : 인증코드 오류, 4 : 일일제한횟수 마감
        if(CURRENCY_DATA_FROM_KOREA_EXIM.length === 0 ) {
            response.success = false;
            response.message = '비영업일의 데이터, 혹은 영업당일 11시 이전에 해당일의 데이터를 요청할 경우 null 값이 반환됩니다.';
        } else if (Number(CURRENCY_DATA_FROM_KOREA_EXIM[0].result) === 2) {
            response.success = false;
            response.message = 'DATA 코드 오류 입니다.'
        } else if (Number(CURRENCY_DATA_FROM_KOREA_EXIM[0].result) === 3) {
            response.success = false;
            response.message = '인증코드 오류 입니다.'
        } else if (Number(CURRENCY_DATA_FROM_KOREA_EXIM[0].result) === 4) {
            response.success = false;
            response.message = '일일제한횟수 1000번을 초과하였습니다.'
        } else {
            setRecordRow(CURRENCY_DATA_FROM_KOREA_EXIM, searchDateFld, searchOptObj);
            response.success = true;
            response.message = '레코드 저장에 성공하였습니다.';
        }

        return JSON.stringify(response);
    };

    function getCurrencyData( searchDate, searchOptObj ) {
        const headers = {
            'Accept' : "application/hal+json;charset=utf-8",
            'Content-Type' : 'application/json'
        };

        const res = https.get({
          url:  `https://www.koreaexim.go.kr/site/program/financial/${searchOptObj.type_en}JSON?authkey=${KOREA_EXIM_AUTH_KEY}&searchdate=${searchDate}&data=${searchOptObj.type}`,
          headers
        }); 
        

        log.debug('post 요청 getCurrencyData 함수  res ==== ', res);
        log.debug('post 요청 getCurrencyData 함수  res.body ==== ', res.body);
        return JSON.parse(res.body);

    };


    function setRecordRow(list, searchDate, searchOptObj) {

        if(searchOptObj.type === 'AP03') {
            list = list.sofr_list;
        } 

        for(const obj of list) {
            log.debug("setRecordRow 함수 안에 obj ======= ", obj);
            log.debug("setRecordRow 함수 안에 searchOptObj ======= ", searchOptObj);
            log.debug("setRecordRow 함수 안에 searchOptObj.name ======= ", searchOptObj.name);

            const prefix = `custrecord_${searchOptObj.name}_`;
            const customRecord = record.create({
                type: `customrecord_${searchOptObj.name}`,
                isDynamic: true
            });

            for (const ali_obj of alias[searchOptObj.type] ) {
                const key = ali_obj.id;
                customRecord.setValue({
                    fieldId: prefix + key,
                    value: obj[key]
                });
            };

            customRecord.setValue({
                fieldId: prefix + 'search_date',
                value: searchDate,
            });
            customRecord.setValue({
                fieldId: prefix + 'search_type',
                value: searchOptObj.type_ko,
            });

            customRecord.save();
            
        }

        
    };
    
    return {
        post
    }
});