/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope Public
*/

define([
    'N/record',
    'N/format',
    'N/runtime'
], function(record, format, runtime) {

    function post(requestBody) {
        // 날짜와 검색유형이 와야함
        const res = JSON.parse(requestBody);
        const { searchDateFld, searchOptionFld } = res;
        
        log.debug('post 요청 requestBody ==== ', requestBody);
        log.debug('post 요청 JSON.parse(requestBody) ==== ', res);
        log.debug('post 요청 searchDateFld ==== ', searchDateFld); 
        log.debug('post 요청 searchOptionFld ==== ', searchOptionFld); 

        const prefix = 'custrecord_test_currency_';

        var customRecord = record.create({
            type: 'customrecord_test_currency',
            isDynamic: true
        });

        customRecord.setValue({
            fieldId: prefix + 'search_date',
            value: 'hello wordl 양현',
        });

        customRecord.save();

        const response = {
            success: true,
            testTex: '저장에 성공 응답이 도착'
        };

        return JSON.stringify(response);
    };

    
    return {
        post
    }
});