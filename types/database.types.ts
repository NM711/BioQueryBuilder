/*
 * HERE I WISH TO DO SOMETHING SIMILAR TO KYSLEY, WHERE A DEVELOPER IS ABLE TO DEFINE THEIR TABLES WITHIN A TYPE, AND ALSO DEFINE THEIR TABLES DATA AND DATATYPES
 * ENSURING THAT THERE IS TYPESCRIPT SUPPORT!
*/

namespace DatabaseTypes {
  
  interface TestDataTable {
    id: string
    int_field: number
    int_text: string
    int_text2: string
  }

  interface HelloTable {
    txt: string
    num: number
  }

  export interface Database {
    test_data: TestDataTable
    hello: HelloTable
  }

}

export default DatabaseTypes
