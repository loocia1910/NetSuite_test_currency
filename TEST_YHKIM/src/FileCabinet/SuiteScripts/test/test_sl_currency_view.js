/**
 * @NApiVersion 2.1
 * @NModuleScope Public
*/

// 인풋창 : 날짜, 요청값
// 버튼 : 저장 버튼, 조회 버튼
// 테이블 : 저장된 record 맵핑 테이블

define([
    'N/ui/serverWidget'
], function(ui) {

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

        const mainTab = form.addSubtab({
            id: 'custpage_main_tab',
            label: "조회결과"
        });

        const sublist = form.addSublist({
            id: 'custpage_test_currency_sublist',
            type: ui.SublistType.LIST,
            label: 'TEST currency grid',
            tab: 'custpage_main_tab'
        });

        sublist.addField({
            id: 'internal_id',
            type: ui.FieldType.INTEGER,
            label: 'Internal ID'
        });

        sublist.addField({
            id: 'search_date',
            type: ui.FieldType.TEXT,
            label: '조회일자'
        });
        sublist.addField({
            id: 'search_type',
            type: ui.FieldType.TEXT,
            label: '조회유형'
        });
        sublist.addField({
            id: 'cur_unit',
            type: ui.FieldType.TEXT,
            label: '통화코드'
        });
        sublist.addField({
            id: 'cur_nm',
            type: ui.FieldType.TEXT,
            label: '국가/통화명'
        });
        sublist.addField({
            id: 'ttb',
            type: ui.FieldType.TEXT,
            label: '전신환(송금)받으실때'
        });
        sublist.addField({
            id: 'tts',
            type: ui.FieldType.TEXT,
            label: '전신환(송금)보내실때'
        });
        sublist.addField({
            id: 'deal_bas_r',
            type: ui.FieldType.TEXT,
            label: '매매 기준율'
        });
        sublist.addField({
            id: 'bkpr',
            type: ui.FieldType.TEXT,
            label: '장부가격'
        });

        
        // 숨김
        // sublist.getField({ id: 'internal_id' }).updateDisplayType({
        //     displayType : ui.FieldDisplayType.HIDDEN
        // });

        return sublist;
    };

    function setSublistValue(sublist, model) {
        const resultSet = model.resultArray;
        const params = model.params;

        if(resultSet) {
            resultSet.forEach((row, index) => {
                sublist.setSublistValue({
                    id: 'internal_id',
                    line: index,
                    value: emptyToNull(row.internalId)
                });

                sublist.setSublistValue({
                    id: 'search_date',
                    line: index,
                    value: emptyToNull(row.search_date)
                });
                sublist.setSublistValue({
                    id: 'search_type',
                    line: index,
                    value: emptyToNull(row.search_type)
                });
                sublist.setSublistValue({
                    id: 'cur_unit',
                    line: index,
                    value: emptyToNull(row.cur_unit)
                });
                sublist.setSublistValue({
                    id: 'cur_nm',
                    line: index,
                    value: emptyToNull(row.cur_nm)
                });
                sublist.setSublistValue({
                    id: 'ttb',
                    line: index,
                    value: emptyToNull(row.ttb)
                });
                sublist.setSublistValue({
                    id: 'tts',
                    line: index,
                    value: emptyToNull(row.tts)
                });
                sublist.setSublistValue({
                    id: 'deal_bas_r',
                    line: index,
                    value: emptyToNull(row.deal_bas_r)
                });
                sublist.setSublistValue({
                    id: 'bkpr',
                    line: index,
                    value: emptyToNull(row.bkpr)
                });


            });
        }
    };

    function addButton(form, model) {
        const params = model.params;

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