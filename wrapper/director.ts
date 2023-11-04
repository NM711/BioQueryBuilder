import BioWrapperExecutor from "./executor"
import SelectQueryBuilder from "builders/select"
import type { Client } from "pg"
import type NBioWrapper from "types/bioWrapper.types"
import type WrapperBuilders from "types/builders.types"
import type WrapperUtils from "types/utils.types"
class BioWrapper implements NBioWrapper.WrapperBuilderDirector {
  executor: BioWrapperExecutor

  constructor (client: Client) {
    this.executor = new BioWrapperExecutor(client)
  }

  select(table: string): WrapperBuilders.SelectQueryBuilderInterface {
    return new SelectQueryBuilder(table, this.executor)
  } 

  insert(table: string): WrapperBuilders.InsertQueryBuilderInterface {
    return 
  }

  update(table: string): WrapperBuilders.UpdateQueryBuilderInterface {
    return 
  } 

  raw(query: string, ...values: any[]): WrapperUtils.QueryAndValues {
    return {
      query,
      values
    }
  }
}



export default BioWrapper
