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
        
        log.debug('post 요청 JSON.parse(requestBody) ==== ', res);

        const prefix = 'custrecord_test_currency_';

        const customRecord = record.create({
            type: 'customrecord_test_currency',
            isDynamic: true
        });

        customRecord.setValue({
            fieldId: prefix + 'search_date',
            value: searchDateFld ,
        });
        customRecord.setValue({
            fieldId: prefix + 'search_type',
            value: searchOptionFld,
        });
        customRecord.setValue({
            fieldId: prefix + 'cur_unit',
            value: 'hello wordl cur_unit',
        });
        customRecord.setValue({
            fieldId: prefix + 'cur_nm',
            value: 'hello wordl',
        });
        customRecord.setValue({
            fieldId: prefix + 'ttb',
            value: 'hello wordl',
        });
        customRecord.setValue({
            fieldId: prefix + 'tts',
            value: 'hello wordl',
        });
        customRecord.setValue({
            fieldId: prefix + 'deal_bas_r',
            value: 'hello wordl',
        });
        customRecord.setValue({
            fieldId: prefix + 'bkpr',
            value: 'hello wordl',
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