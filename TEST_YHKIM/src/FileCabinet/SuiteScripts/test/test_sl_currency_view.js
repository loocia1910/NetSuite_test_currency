/**
 * @NApiVersion 2.1
 * @NModuleScope Public
*/

// 인풋창 : 날짜, 요청값
// 버튼 : 저장 버튼, 조회 버튼
// 테이블 : 저장된 record 맵핑 테이블

define([
    'N/ui/serverWidget',
    './common_alias.js'
], function(ui, alias) {

    // test_sl_currency_controller.js 에서
    // view.load(m) 을 통해 전달된 model
    // 최종적으로 리턴되는 객체
    const entry = (model) => {
        return new View(model);
    };

    // entry 객체에서 리턴되는 View 클래스 선언
    class View {
        constructor(model) {
            this.form = createForm(model);
        }
    };

    function createForm(model) {
        const form = ui.createForm({
            title : 'TEST_YH : 환율 조회'
        });

        const sublist = createSublist(form, model);
        setSublistValue(sublist, model);

        createField(form, model);
        addButton(form, model);

        form.clientScriptModulePath = './test_cl_currency_client.js'
        
        return form;
    };

    function createField(form, model) { 
        form.addFieldGroup({
            id: 'fldgrp1_id',
            label: '검색조건'
        });

        const searchDateFld = form.addField({
            id: 'custpage_test_currency_field_search_date',
            type: ui.FieldType.DATE,
            container: 'fldgrp1_id', 
            label: '조회일자'
        });

        searchDateFld.isMandatory = true;

        const searchOptionFld = form.addField({
            id: 'custpage_test_currency_field_search_option',
            type: ui.FieldType.SELECT,
            container: 'fldgrp1_id',
            label: '조회유형'
        });

        searchOptionFld.addSelectOption({ value: 'AP01', text: '환율' });
        searchOptionFld.addSelectOption({ value: 'AP02', text: '대출금리' });
        searchOptionFld.addSelectOption({ value: 'AP03', text: '국제금리' });
        searchOptionFld.isMandatory = true;


        // set field default value
        const params = model.params;

        if(params.searchDate) searchDateFld.defaultValue = params.searchDate;
        if(params.searchOption) searchOptionFld.defaultValue = params.searchOption;
    };

    function createSublist(form, model) {
        const params = model.params;

        const AP01_Tab = form.addSubtab({
            id: 'custpage_ap01_tab',
            label: "환율조회"
        });

        const AP02_Tab = form.addSubtab({
            id: 'custpage_ap02_tab',
            label: "대출금리 조회"
        });

        const AP03_Tab = form.addSubtab({
            id: 'custpage_ap03_tab',
            label: "국제금리 조회"
        });

        const AP01_sublist = form.addSublist({
            id: 'custpage_test_currency_sublist_01',
            type: ui.SublistType.LIST,
            label: 'TEST currency grid 1',
            tab: 'custpage_ap01_tab'
        });

        const AP02_sublist = form.addSublist({
            id: 'custpage_test_currency_sublist_02',
            type: ui.SublistType.LIST,
            label: 'TEST currency grid 2',
            tab: 'custpage_ap02_tab'
        });

        const AP03_sublist = form.addSublist({
            id: 'custpage_test_currency_sublist_03',
            type: ui.SublistType.LIST,
            label: 'TEST currency grid 3',
            tab: 'custpage_ap03_tab'
        });

        for( let obj of alias.AP01 ) {
            AP01_sublist.addField({
                id: obj.id,
                type: obj.type,
                label: obj.label
            });
        };

        for( let obj of alias.AP02 ) {
            AP02_sublist.addField({
                id: obj.id,
                type: obj.type,
                label: obj.label
            });
        };

        for( let obj of alias.AP03 ) {
            AP03_sublist.addField({
                id: obj.id,
                type: obj.type,
                label: obj.label
            });
        };

        
        // 숨김
        // AP01_sublist.getField({ id: 'internal_id' }).updateDisplayType({
        //     displayType : ui.FieldDisplayType.HIDDEN
        // });

        return {
            AP01_sublist,
            AP02_sublist,
            AP03_sublist,
        };
    };

    function setSublistValue(sublist, model) {
        log.debug('model 이 있나??==== ', model);

        const AP01_result = model.resultArray;
        const AP02_result = model.resultArrayAP02;
        const AP03_result = model.resultArrayAP03;
        const params = model.params;

        if(AP01_result) {
            AP01_result.forEach((row, index) => {
                // sublist.setSublistValue({
                //     id: 'internal_id',
                //     line: index,
                //     value: emptyToNull(row.internalId)
                // });

                for(let obj of alias.AP01) {
                    sublist.AP01_sublist.setSublistValue({
                        id: obj.id,
                        line: index,
                        value: emptyToNull(row[obj.id])
                    });
                }
            });
        } 
        if(AP02_result) {
            AP02_result.forEach((row, index) => {
                for(let obj of alias.AP02) {
                    sublist.AP02_sublist.setSublistValue({
                        id: obj.id,
                        line: index,
                        value: emptyToNull(row[obj.id])
                    });
                }
            });
        } 
        if(AP03_result) {
            AP03_result.forEach((row, index) => {
                for(let obj of alias.AP03) {
                    sublist.AP03_sublist.setSublistValue({
                        id: obj.id,
                        line: index,
                        value: emptyToNull(row[obj.id])
                    });
                }
            });
        }
    };

    function addButton(form, model) {
        form.addButton({
            id: 'custpage_test_currency_button_save',
            label: 'Save',
            functionName: 'createCurrencyRowData()' // cl_XXX_client.js 에서 리턴하는 함수
        });

        form.addButton({
            id: 'custpage_test_currency_button_search',
            label: 'Find All Record',
            functionName: 'doFind()'
        });
    };

    function emptyToNull(value) {
        return value ? value : null;
    };


    return {
        load : entry
    };
});