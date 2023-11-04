import type WrapperBuilders from "./builders.types"
import type WrapperUtils from "./utils.types"

namespace NBioWrapper {
  export interface WrapperBuilderDirector<Database = void> {
    // after type system completion, overload the methods that require types so that they only take type string
    // this is just in case a developer or someone doesnt feel like declaring his database types.
    select <Table extends Extract<keyof Database, string>, Column extends keyof Database[Table]> 
    (table: Table):
    WrapperBuilders.SelectQueryBuilderInterface<Column>
    

    insert
    <Table extends Extract<keyof Database, string>, Column extends keyof Table>
    (table: Table):
    WrapperBuilders.InsertQueryBuilderInterface


    update 
    <Table extends Extract<keyof Database, string>, Column extends keyof Table>
    (table: Table):
    WrapperBuilders.UpdateQueryBuilderInterface
    raw(query: string, ...values: any[]): WrapperUtils.QueryAndValues
  }


  export interface WrapperExecutor {
    execute (qV: WrapperUtils.QueryAndValues | WrapperUtils.QueriesAndValues): Promise<any>
    transaction (cb: () => Promise<any>): Promise<any>
  }
}

export default NBioWrapper
