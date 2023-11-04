import type WrapperBuilders from "./builders.types"
import type WrapperUtils from "./utils.types"

namespace NBioWrapper {

  export interface WrapperBuilderDirector {
    select(table: string): WrapperBuilders.SelectQueryBuilderInterface
    insert(table: string): WrapperBuilders.InsertQueryBuilderInterface
    update(table: string):  WrapperBuilders.UpdateQueryBuilderInterface
    raw(query: string, ...values: any[]): WrapperUtils.QueryAndValues
    runner: WrapperExecutor
  }


  export interface WrapperExecutor {
    execute (qV: WrapperUtils.QueryAndValues | WrapperUtils.QueriesAndValues): Promise<any>
    transaction (cb: () => Promise<any>): Promise<any>
  }
}

export default NBioWrapper
