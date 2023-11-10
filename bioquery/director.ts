import BioQueryExecutor from "./executor"
import SelectQueryBuilder from "builders/select"
import InsertQueryBuilder from "builders/insert"
import DeleteQueryBuilder from "builders/delete"
import UpdateQueryBuilder from "builders/update"
import type { Client } from "pg"
import type NBioQuery from "types/bioquery.types"
import type WrapperBuilders from "types/builders.types"
import type QueryBuilderUtils from "types/utils.types"

// <Database = void> makes the generic becomes optional (it defaults to void)

class BioQuery<Database = void> implements NBioQuery.WrapperBuilderDirector<Database> {

  protected executor: BioQueryExecutor
  protected client: Client

  constructor (client: Client) {
    this.client = client
    this.client.connect()
    this.executor = new BioQueryExecutor(this.client)
  }

  public select
  <Table extends Extract<keyof Database, string>, Column = NBioQuery.AllColumns<Database>>
  (table: Table):
  Omit<WrapperBuilders.SelectQueryBuilderInterface<Table, Column, Database>, "returning"> {
     return new SelectQueryBuilder<Table, Column, Database>(table, this.executor)
  }

  public insert
  <Table extends Extract<keyof Database, string>, Column = NBioQuery.SpecificTableColumn<Database, Table>>
  (table: Table): 
  WrapperBuilders.InsertQueryBuilderInterface<Table, Column> {
    return new InsertQueryBuilder<Table, Column>(table, this.executor)
  }

 public update
 <Table extends Extract<keyof Database, string>, Column = NBioQuery.SpecificTableColumn<Database, Table>>
 (table: Table):
  WrapperBuilders.UpdateQueryBuilderInterface<Table, Column> {
    return new UpdateQueryBuilder(table, this.executor)
 } 

  public delete
  <Table extends Extract<keyof Database, string>, Column = NBioQuery.SpecificTableColumn<Database, Table>>
  (table: Table):
  WrapperBuilders.DeleteQueryBuilderInterface<Table, Column> {
    return new DeleteQueryBuilder<Table, Column>(table, this.executor)
  }

  public raw(query: string, ...values: any[]): QueryBuilderUtils.QueryAndValues {
    return {
      query,
      values
    }
  }

  public async transaction(cb: () => Promise<any>): Promise<any> {
    try {
      await this.client.query("BEGIN")
      await cb() 
      await this.client.query("COMMIT")
    } catch (e) {
      await this.client.query("ROLLBACK")
      console.error("Transaction Failed!")
      // throw the error as to why upwards
      throw e
    }
  }

  public async disconnect (): Promise<void> {
    await this.client.end()
  }
}

export default BioQuery
