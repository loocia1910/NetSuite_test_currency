// view.js 와 rl_.js 파일 사이에서
// RestAPI 핸들링을 함
/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope Public
*/

define([
    'N/currentRecord',
    'N/runtime',
    'N/url',
    'N/ui/dialog',
    'N/https',
    'N/format',
], function(currentRecord, runtime, url, dialog, https, format) {

    function pageInit(context) {
        AddStyle(
            "https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css",
            "head"
        );
    };

    async function createCurrencyRowData() {
        try {

        // A. searchDateFld, searchOptionFld의 값을 가져온다.
        const searchDateFld = currentRecord.get().getValue('custpage_test_currency_field_search_date');
        const searchOptionFld = currentRecord.get().getValue('custpage_test_currency_field_search_option');

        console.log("cl currency_client.js searchDateFld .get().getValue ===== ", searchDateFld);
        console.log("cl currency_client.js searchOptionFld .get().getValue ===== ", searchOptionFld);

        const response = await createInvoicePromise(formatDateToString(searchDateFld), searchOptionFld);
        console.log("cl currency_client.js response ===== ", response);
        return response;
        } catch(e) {
            throw(e);
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
    }
    
    function createInvoicePromise( searchDateFld, searchOptionFld ) { 
        
        const restletUrl = url.resolveScript({
            scriptId: 'customscript_test_rl_currency_crt',
            deploymentId: 'customdeploy_test_rl_currency_crt'
        });
    
        const body = { searchDateFld, searchOptionFld };
        const headerObj = new Array();
        headerObj['Content-Type'] = 'application/json';
    
        return https.post.promise({
            url: restletUrl,
            body: JSON.stringify(body),
            headers: headerObj
        });
    };


    function AddStyle(cssLink, pos) {
        // 외부 CSS 넣는 함수 (부트스트랩 등)
        var tag = document.getElementsByTagName(pos)[0];
        var addLink = document.createElement("link");
        //addLink.setAttribute('type', 'text / css');
        addLink.setAttribute("rel", "stylesheet");
        addLink.setAttribute("href", cssLink);
        tag.appendChild(addLink);
    };

    return {
        pageInit,
        createCurrencyRowData
    }
    
});