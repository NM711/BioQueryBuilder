import SelectQueryBuilder from "builders/select"
import BioWrapperExecutor from "./executor"
import type { Client } from "pg"
import type NBioWrapper from "types/bioWrapper.types"
import type { WrapperBuilders, WrapperUtils } from "types/sql.types"

class BioWrapper implements NBioWrapper.WrapperBuilderDirector {
  client: Client
  runner: NBioWrapper.WrapperExecutor

  constructor (client: Client) {
    this.client = client
    this.client.connect()
    this.runner = new BioWrapperExecutor(client)
  }

  setSelect(table: string): WrapperBuilders.SelectQueryBuilderInterface {
    return new SelectQueryBuilder(table)
  } 

  setInsert(table: string): WrapperBuilders.InsertQueryBuilderInterface {
    return
  }

  setUpdate(table: string): WrapperBuilders.UpdateQueryBuilderInterface {
    return 
  } 

  setCustom(query: string, ...values: any[]): WrapperUtils.QueryAndValues {
    return {
      query,
      values
    }
  }

  async disconnect(): Promise<void> {
    await this.client.end()
  }
}

export default BioWrapper
