import type { WrapperBuilders, WrapperUtils } from "./sql.types"

namespace NBioWrapper {

  export interface WrapperBuilderDirector {
    setSelect(table: string): WrapperBuilders.SelectQueryBuilderInterface
    setInsert(table: string): WrapperBuilders.InsertQueryBuilderInterface
    setUpdate(table: string):  WrapperBuilders.UpdateQueryBuilderInterface
    setCustom (query: string, ...values: any[]): WrapperUtils.QueryAndValues
    disconnect (): Promise<void>
    runner: WrapperExecutor
  }


  export interface WrapperExecutor {
    execute (qV: WrapperUtils.QueryAndValues | WrapperUtils.QueriesAndValues): Promise<any>
    transaction (cb: () => Promise<any>): Promise<any>
  }
}

export default NBioWrapper
