import type WrapperBuilders from "./builders.types"
import type WrapperUtils from "./utils.types"

/** @namespace NBioWrapper This namespace is meant to store some of the main types associated to the Builders Director and Executor */

namespace NBioWrapper {
  /**
  * @type AllColumns<DB> This type is meant to take a generic type which we are expecting to be the Database interface, and then
  * we iterate over all the keys of every table under the Database interface. 
  * And then the output of this type is essentially a string literal
  * type that has merged every column of every table in the Database interface.
  * For example if we have two tables such as "hello" and "test"
  * and each table has an id then, we can get the types of every in the following order: "hello.id" || "test.id"
  */

  export type AllColumns<DB> = {
    [Table in keyof DB]: `${Table & string}.${keyof DB[Table] & string}`
  }[keyof DB]

  /**
  * @type SpecificTableColumn<DB, Table extends keyof DB> Similarly to the AllColumns<DB> type we take two two generics.
  * <DB> and <Table> DB is expected to be the database interface passed initially, and the Table is supposed to be one of the tables
  * that are keys of the DB generic. Unlike AllColumns<DB> this type only gets
  * the columns that are associated to the selected Table.
  * For example If I have tables of "hello" and "test" and each has an id once again,
  * if you call a variable as:  const foo: SpecificTableColumn<DatabaseTypes.Database, "hello"> = "hello.txt"
  * You will only be able to get type support for the columns that are associated with the "hello" Table.
  */

  export type SpecificTableColumn<DB, Table extends keyof DB> = `${Table & string}.${keyof DB[Table] & string}`
  
  /** @interface WrapperBuilderDirector<Database = void>
   *  This is the main interface which will be implemented in the 
   *  WrapperBuilderDirector class which is in charge of calling all the SQL QueryBuilders.
   * *
   * */

  export interface WrapperBuilderDirector<Database = void> {

  /**
  *  @field select<Table extends Extract<keyof Database, string>, Column = keyof AllColumns<Database>>
  *  Select field which takes two generics <Table> and <Column>, 
  *  Table converts the keys of the interfaces Database generic to a string.
  *  Column makes use of the AllColumns type to get all columns of all tables associated to a Database interface.
  * */ 

    select <Table extends Extract<keyof Database, string>, Column = keyof AllColumns<Database>> 
    (table: Table):
    Omit<WrapperBuilders.SelectQueryBuilderInterface<Table, Column, Database>, "returning">
    
  /**
  *  @field insert<Table extends Extract<keyof Database, string>, Column extends keyof Database[Table]>
  *  Insert field which takes two generics <Table> and <Column>
  *  Table converts the keys of the interfaces Database generic to a string.
  *  Column grabs the keys of a databse tables columns in tge SpecificTableColumn<Database, Table> format
  * */ 
    insert
    <Table extends Extract<keyof Database, string>, Column = keyof SpecificTableColumn<Database, Table>>
    (table: Table):
    WrapperBuilders.InsertQueryBuilderInterface<Table, Column>

  /**
  *  @field update<Table extends Extract<keyof Database, string>, Column extends keyof Database[Table]>
  *  Update field which takes two generics <Table> and <Column>
  *  Table converts the keys of the interfaces Database generic to a string.
  *  Column grabs the keys of a databse tables columns in tge SpecificTableColumn<Database, Table> format
  * */ 
    update 
    <Table extends Extract<keyof Database, string>, Column = keyof SpecificTableColumn<Database, Table>>
    (table: Table):
    WrapperBuilders.UpdateQueryBuilderInterface<Table, Column>
    raw(query: string, ...values: any[]): WrapperUtils.QueryAndValues
  }

  /** @interface WrapperExecutor Outlines the structure of the WrapperExecutor class */

  export interface WrapperExecutor {
    execute (qV: WrapperUtils.QueryAndValues | WrapperUtils.QueriesAndValues): Promise<any>
    transaction (cb: () => Promise<any>): Promise<any>
  }
}

export default NBioWrapper
