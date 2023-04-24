// view.js 와 rl_.js 파일 사이에서
// RestAPI 핸들링을 함
/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope Public
*/

define([
    'N/currentRecord',
    'N/url',
    'N/https',
    'N/format',
], function(currentRecord, url, https, format) {

    function pageInit(context) {
        AddStyle(
            "https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css",
            "head"
        );
    };

    function doFind() {
        try {

            window.onbeforeunload = null;
            document.location = url.resolveScript({
                scriptId: getParameterFromURL('script'),
                deploymentId: getParameterFromURL('deploy'),
            })

        } catch(e) {
            log.error(e.name, e);
        }
    };

    async function createCurrencyRowData() {
        try {

        // A. searchDateFld, searchOptionFld의 값을 가져온다.
        const searchDateFld = currentRecord.get().getValue('custpage_test_currency_field_search_date');
        const searchDate = formatDateToString(searchDateFld) // ex) dateObj -> 2022/04/30
                        //    .replace(/\//g, ''); // ex) dateObj -> 20220430

        const searchOptionFld = currentRecord.get().getValue('custpage_test_currency_field_search_option');

        console.log("cl currency_client.js searchDateFld .get().getValue ===== ", searchDateFld);
        console.log("cl currency_client.js searchDate 변경한 날짜 ===== ", searchDate);
        console.log("cl currency_client.js searchOptionFld .get().getValue ===== ", searchOptionFld);

        const response = await createInvoicePromise(searchDate, searchOptionFld);
        console.log("cl currency_client.js response ===== ", response);


        return response;
        } catch(e) {
            throw(e);
        }
    };

    function formatDateToString(dateObj) {
        if (dateObj) {
            const date = format.format({
                value: dateObj,
                type: format.Type.DATE,
                timezone: format.Timezone.ASIA_SEOUL
            });
            
            // ex)  2022/4/30 -> [ '2022', '4', '30' ]
            const yyymmddList = date.split('/');
            const yyyy = yyymmddList[0];
            const mm = yyymmddList[1].length === 2 ? yyymmddList[1] : '0' + yyymmddList[1];
            const dd = yyymmddList[2].length === 2 ? yyymmddList[2] : '0' + yyymmddList[2];

            return yyyy + mm + dd;
        } else {
            return null;
        }
    };

    // function formatDateToString(dateObj) {
    //     // ex) dateObj -> 04/30/2022
    //     if (dateObj) {
    //         const year = dateObj.getFullYear();
    //         const month = dateObj.getFullMonth();
    //         const date = dateObj.getFullDate();
    //         return year + month + date;
    //     } else {
    //         return null; 
    //     }
    // };


    
    
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

    function getParameterFromURL(param) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] === param) {
                return decodeURIComponent(pair[1]);
            }
        }
        return false;
    };

    return {
        pageInit,
        doFind,
        createCurrencyRowData
    }
    
});