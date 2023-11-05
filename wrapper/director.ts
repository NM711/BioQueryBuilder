import BioWrapperExecutor from "./executor"
import SelectQueryBuilder from "builders/select"
import type { Client } from "pg"
import type NBioWrapper from "types/bioWrapper.types"
import type WrapperBuilders from "types/builders.types"
import type WrapperUtils from "types/utils.types"
import InsertQueryBuilder from "builders/insert"

// <Database = void> makes the type param optional if necessary
// if this occurs then we can just default the builders table and anything under it to type string

class BioWrapper<Database = void> implements NBioWrapper.WrapperBuilderDirector<Database> {

  executor: BioWrapperExecutor

  constructor (client: Client) {
    this.executor = new BioWrapperExecutor(client)
  }

  select
  <Table extends Extract<keyof Database, string>, Column = keyof NBioWrapper.AllColumns<Database>>
  (table: Table):
  Omit<WrapperBuilders.SelectQueryBuilderInterface<Table, Column, Database>, "returning"> {
     return new SelectQueryBuilder<Table, Column, Database>(table, this.executor)
  } 
  
  insert
  <Table extends Extract<keyof Database, string>, Column extends keyof Database[Table]>
  (table: Table): 
  Omit<WrapperBuilders.InsertQueryBuilderInterface<Table, Column>, "where()"> {
    return new InsertQueryBuilder<Table, Column>(table, this.executor)
  }

  update(table: keyof Database | string): WrapperBuilders.UpdateQueryBuilderInterface {
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
