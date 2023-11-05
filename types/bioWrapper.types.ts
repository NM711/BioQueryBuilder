import type WrapperBuilders from "./builders.types"
import type WrapperUtils from "./utils.types"
namespace NBioWrapper {

  export type AllColumns<DB> = {
    [Table in keyof DB]: `${Table & string}.${keyof DB[Table] & string}`
  }[keyof DB]

  export type SpecificTableColumn<DB, Table extends keyof DB> = `${Table & string}.${keyof DB[Table] & string}`

  export interface WrapperBuilderDirector<Database = void> {

    select <Table extends Extract<keyof Database, string>, Column = keyof AllColumns<Database>> 
    (table: Table):
    Omit<WrapperBuilders.SelectQueryBuilderInterface<Table, Column, Database>, "returning">
    

    insert
    <Table extends Extract<keyof Database, string>, Column extends keyof Database[Table]>
    (table: Table):
    WrapperBuilders.InsertQueryBuilderInterface<Table, Column>


    update 
    <Table extends Extract<keyof Database, string>, Column extends keyof Database[Table]>
    (table: Table):
    WrapperBuilders.UpdateQueryBuilderInterface<Table, Column>
    raw(query: string, ...values: any[]): WrapperUtils.QueryAndValues
  }


  export interface WrapperExecutor {
    execute (qV: WrapperUtils.QueryAndValues | WrapperUtils.QueriesAndValues): Promise<any>
    transaction (cb: () => Promise<any>): Promise<any>
  }
}

export default NBioWrapper
