/**
 * @NApiVersion 2.1
 * @NModuleScope Public
*/

define([
    'N/record',
    'N/search',
    'N/format',
    'N/runtime',
    'N/url'
], function(record, search, format, runtime, url) {

    function entry(params, method) {

        // 검색조건 기본값
        const today = new Date();
        const searchDate = today;
        const searchOption = 'AP01';

        if(!params.searchDate) params.searchDate = formatDateToString(searchDate);
        if(!params.searchOption) params.searchOption = searchOption;
        

        // DB에서 값을 꺼내어 model에 담음
        if (method === 'GET') {
            return new GetModel(params);
        }
    };

    
    function formatDateToString(dateObj) {
        // ex) dateObj -> 04/30/2022
        if (dateObj) {
            const datetime = format.format({
                value: dateObj,
                type: format.Type.DATETIME,
                timezone: format.Timezone.ASIA_SEOUL
            });
            return datetime.split(' ')[0];
        } else {
            return null;
        }
    };

    class GetModel {
        constructor(params) {

            const PAGE_SIZE = 1000;

            this.resultArray = getResultSet(params, PAGE_SIZE);
            this.params = params
        }
    };

    function getResultSet(params, pageSize) {
        let resultSet = [];

        const currencySearch = createCurrencySearch(params);

        const pagedData = currencySearch.runPaged({ pageSize: pageSize });
        let pageCount = Math.ceil(pagedData.count / pageSize);
        if (pageCount > 0) {
            resultSet = fetchSearchResult(pagedData, pageCount);
        }

        return resultSet;
    };


    function createCurrencySearch(params) {
        const prefix = 'custrecord_test_currency_';
        const columns = [
            'internalId',
            prefix + 'search_date',
            prefix + 'search_type',
            prefix + 'cur_unit',
            prefix + 'cur_nm',
            prefix + 'ttb',
            prefix + 'tts',
            prefix + 'deal_bas_r',
            prefix + 'bkpr',
        ];

        return search.create({
            type: search.Type.CUSTOM_RECORD + '_test_currency',
            columns: columns
        })
    };

    function fetchSearchResult(pagedData, pageCount) {

        let resultSet = [];

        const prefix = 'custrecord_test_currency_';


        // 전체 페이지 데이터 추출
        for (let i = 0; i < pageCount; i++) {
            const page = pagedData.fetch({ index: i });

            page.data.forEach(rowData => {
                resultSet.push({
                    internalId  : rowData.getValue('internalId'),
                    search_date : rowData.getValue(prefix + 'search_date'),
                    search_type  : rowData.getValue(prefix + 'search_type'),
                    cur_unit  : rowData.getValue(prefix + 'cur_unit'),
                    cur_nm   : rowData.getValue(prefix + 'cur_nm'),
                    ttb    : rowData.getValue(prefix + 'ttb'),
                    tts : rowData.getValue(prefix + 'tts'),
                    deal_bas_r   : rowData.getValue(prefix + 'deal_bas_r'),
                    bkpr     : rowData.getValue(prefix + 'bkpr'),
                });
            });
            
        }

        return resultSet;

    };


    return {
        load : entry
    }
});