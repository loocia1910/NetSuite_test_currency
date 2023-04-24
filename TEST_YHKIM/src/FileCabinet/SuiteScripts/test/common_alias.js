define(['N/ui/serverWidget'], 
function(ui) {
   const AP01 = [
    // {
    //     id: 'internal_id',
    //     type: ui.FieldType.INTEGER,
    //     type: 'Internal ID'
    // },
    {
        id: 'search_date',
        type: ui.FieldType.TEXT,
        label: '조회일자'
    },
    {
        id: 'search_type',
        type: ui.FieldType.TEXT,
        label: '조회유형'
    },
    {
        id: 'cur_unit',
        type: ui.FieldType.TEXT,
        label: '통화코드'
    },
    {
        id: 'cur_nm',
        type: ui.FieldType.TEXT,
        label: '국가/통화명'
    },
    {
        id: 'ttb',
        type: ui.FieldType.TEXT,
        label: '전신환(송금)받으실때'
    },
    {
        id: 'tts',
        type: ui.FieldType.TEXT,
        label: '전신환(송금)보내실때'
    },
    {
        id: 'deal_bas_r',
        type: ui.FieldType.TEXT,
        label: '매매 기준율'
    },
    {
        id: 'bkpr',
        type: ui.FieldType.TEXT,
        label: '장부가격'
    }
   ];

   const AP02 = [
    {
        id: 'search_date',
        type: ui.FieldType.TEXT,
        label: '조회일자'
    },
    {
        id: 'search_type',
        type: ui.FieldType.TEXT,
        label: '조회유형'
    },
    {
        id: 'sfln_intrc_nm',
        type:  ui.FieldType.TEXT,
        label: '대출 기간',
    },
    {
        id: 'int_r',
        type:  ui.FieldType.TEXT,
        label: '고정 기준 금리',
    },
   ];

   const AP03 = [
    {
        id: 'search_date',
        type: ui.FieldType.TEXT,
        label: '조회일자'
    },
    {
        id: 'search_type',
        type: ui.FieldType.TEXT,
        label: '조회유형'
    },
    {
        id: 'cur_fund',
        type:  ui.FieldType.TEXT,
        label: '통화',
    },
    {
        id: 'sfln_intrc_nm',
        type:  ui.FieldType.TEXT,
        label: '기간',
    },
    {
        id: 'int_r',
        type:  ui.FieldType.TEXT,
        label: '금리 정보',
    },
   ];
    
   return {
     AP01,
     AP02,
     AP03,
   }
});