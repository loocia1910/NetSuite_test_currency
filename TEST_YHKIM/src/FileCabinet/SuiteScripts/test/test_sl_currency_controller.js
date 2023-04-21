/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope Public
*/

define([
    './test_sl_currency_model',
    './test_sl_currency_view'
], function(model, view) {
    
    const onRequest = (context) => {
        const method = context.request.method;
        const params = context.request.parameters;

        if(method === 'GET') {
            const m = model.load(params, method);
            const v = view.load(m);

            context.response.writePage(v.form);
        }
    }

    return {
        onRequest
    }
    
});