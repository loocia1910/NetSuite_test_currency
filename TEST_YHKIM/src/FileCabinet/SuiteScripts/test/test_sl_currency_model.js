/**
 * @NApiVersion 2.1
 * @NModuleScope Public
*/

define([
    'N/record',
    'N/search',
    'N/format',
    'N/runtime',
    'N/url',
    './common_alias.js'
], function(record, search, format, runtime, url, alias) {

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

            const PAGE_SIZE = 40;


            // rec_prefix, rec_name, type (ap01, ap02..)
            const rec_ap01_name = 'test_currency';
            const rec_ap02_name = 'test_cur_ap02';
            const rec_ap03_name = 'test_cur_ap03';

            this.resultArray = getResultSet(params, PAGE_SIZE, rec_ap01_name, 'AP01');
            this.resultArrayAP02 = getResultSet(params, PAGE_SIZE, rec_ap02_name, 'AP02');
            this.resultArrayAP03 = getResultSet(params, PAGE_SIZE, rec_ap03_name, 'AP03');
            this.params = params
        }
    };

    function getResultSet(params, pageSize, rec_name, type) {
        let resultSet = [];

        const currencySearch = createCurrencySearch(params, rec_name, type);

        const pagedData = currencySearch.runPaged({ pageSize: pageSize });
        let pageCount = Math.ceil(pagedData.count / pageSize);
        if (pageCount > 0) {
            resultSet = fetchSearchResult(pagedData, pageCount,  rec_name, type);
        }

        return resultSet;
    };

    function createCurrencySearch(params, rec_name, type) {
        const prefix = `custrecord_${rec_name}_`;
        let columns = [];
        
        for( let obj of alias[type]) {
            columns.push(prefix + obj.id);
        }

        return search.create({
            type: search.Type.CUSTOM_RECORD + `_${rec_name}`,
            columns: columns
        })
    };

    function fetchSearchResult(pagedData, pageCount, rec_name, type) {

        let resultSet = [];

        const prefix = `custrecord_${rec_name}_`;

        // 전체 페이지 데이터 추출
        for (let i = 0; i < pageCount; i++) {
            const page = pagedData.fetch({ index: i });

            page.data.forEach(rowData => {
                const newRecord = {};
                for( let obj of alias[type]) {
                    newRecord[obj.id] = rowData.getValue(prefix + obj.id);
                }
                resultSet.push(newRecord);
            });
            
        }

        return resultSet;

    };


    return {
        load : entry
    }
});