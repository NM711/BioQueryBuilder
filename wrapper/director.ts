import BioWrapperExecutor from "./executor"
import SelectQueryBuilder from "builders/select"
import type { Client } from "pg"
import type NBioWrapper from "types/bioWrapper.types"
import type WrapperBuilders from "types/builders.types"
import type WrapperUtils from "types/utils.types"
import InsertQueryBuilder from "builders/insert"
import DeleteQueryBuilder from "builders/delete"
import UpdateQueryBuilder from "builders/update"

// <Database = void> makes the type param optional if necessary
// if this occurs then we can just default the builders table and anything under it to type string

class BioWrapper<Database = void> implements NBioWrapper.WrapperBuilderDirector<Database> {

  protected executor: BioWrapperExecutor
  protected client: Client

  constructor (client: Client) {
    this.client = client
    this.client.connect()
    this.executor = new BioWrapperExecutor(this.client)
  }

  public select<Table extends Extract<keyof Database, string>, Column = NBioWrapper.AllColumns<Database>>
  (table: Table):
  Omit<WrapperBuilders.SelectQueryBuilderInterface<Table, Column, Database>, "returning"> {
     return new SelectQueryBuilder<Table, Column, Database>(table, this.executor)
  }

  public insert
  <Table extends Extract<keyof Database, string>, Column = NBioWrapper.SpecificTableColumn<Database, Table>>
  (table: Table): 
  WrapperBuilders.InsertQueryBuilderInterface<Table, Column> {
    return new InsertQueryBuilder<Table, Column>(table, this.executor)
  }

 public update
 <Table extends Extract<keyof Database, string>, Column = NBioWrapper.SpecificTableColumn<Database, Table>>
 (table: Table):
  WrapperBuilders.UpdateQueryBuilderInterface<Table, Column> {
    return new UpdateQueryBuilder(table, this.executor)
 } 

  public delete
  <Table extends Extract<keyof Database, string>, Column = NBioWrapper.SpecificTableColumn<Database, Table>>
  (table: Table):
  WrapperBuilders.DeleteQueryBuilderInterface<Table, Column> {
    return new DeleteQueryBuilder<Table, Column>(table, this.executor)
  }

  public raw(query: string, ...values: any[]): WrapperUtils.QueryAndValues {
    return {
      query,
      values
    }
  }

  public async disconnect (): Promise<void> {
    await this.client.end()
  }
}



export default BioWrapper
