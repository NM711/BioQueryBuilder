import type SQLTypes from "./sql.types"
import type QueryBuilderUtils from "./utils.types"
import type NBioQuery from "./bioquery.types"
 /**
  * @namespace WrapperBuilders
  * @description
  * This namespace contains a set of interfaces for building SQL queries in a strongly typed manner.
  **/

namespace WrapperBuilders {
  
  /**
   * @interface Joins
   * @description
   * This interface provides methods for defining various types of SQL joins, including inner, outer, left, right, and full joins.
   * @typeParam Database - The database schema.
   **/

  export interface Joins<Database> {

    innerJoin
    <JoinTable extends Extract<keyof Database, string>, JoinColumn = NBioQuery.SpecificTableColumn<Database, JoinTable>>
    (table: JoinTable, c1: JoinColumn, c2: string): this


    fullOuterJoin
    <JoinTable extends Extract<keyof Database, string>, JoinColumn = NBioQuery.SpecificTableColumn<Database, JoinTable>>
    (table: JoinTable, c1: JoinColumn, c2: string): this


    leftJoin
    <JoinTable extends Extract<keyof Database, string>, JoinColumn = NBioQuery.SpecificTableColumn<Database, JoinTable>>
    (table: JoinTable, c1: JoinColumn, c2: string): this


    rightJoin
    <JoinTable extends Extract<keyof Database, string>, JoinColumn = NBioQuery.SpecificTableColumn<Database, JoinTable>>
    (table: JoinTable, c1: JoinColumn, c2: string): this


    fullJoin
    <JoinTable extends Extract<keyof Database, string>, JoinColumn = NBioQuery.SpecificTableColumn<Database, JoinTable>>
    (table: JoinTable, c1: JoinColumn, c2: string): this
  }

  /**
   * @interface CommonUtils
   * @description
   * This interface provides common query building methods like 'where,' 'returning,' and 'execute.'
   * @typeParam Column - The type of column.
   **/

  export interface CommonUtils {

    /**
     * @method execute
     * @description
     * Executes the query and returns a Promise for the result.
     * @returns A Promise with the query result.
     **/

    execute(): Promise<any>
  }

  // still need subqueries and CTEs
 

  /**
   * @interface SelectQueryBuilderInterface
   * @description
   * This interface is used for building SELECT queries and includes methods for defining columns, distinct, ordering, grouping, and more.
   * @typeParam Table - The table to select from.
   * @typeParam Column - The type of column.
   * @typeParam Database - The database schema.
   **/

  export interface SelectQueryBuilderInterface<Table, Column, Database>
  extends 
  Joins<Database>{
    // inner workings still need to be documented
    column(...columns: Column[]): this
    where(condition: QueryBuilderUtils.Condition<Column> | QueryBuilderUtils.Condition<Column>[]): this
    distinctOn(...column: Column[] | string[]): this
    orderBy (columns: Column[] | string[], order: SQLTypes.SQLOrderByOperators): this
    groupBy (...columns: Column[] | string[]): this
    having(condition: QueryBuilderUtils.Condition<Column> | QueryBuilderUtils.Condition<Column>[]): this
    limit (limit: number): this
    offset (offset: number): this
  }

  /**
   * @interface DeleteQueryBuilderInterface
   * @description
   * This interface is used for building DELETE queries and includes methods for specifying columns to delete.
   * @typeParam Table - The table to delete from.
   * @typeParam Column - The type of column.
   **/

  export interface DeleteQueryBuilderInterface<Table, Column> extends CommonUtils {
    where(condition: QueryBuilderUtils.Condition<Column> | QueryBuilderUtils.Condition<Column>[]): this
    returning(...columns: Column[]): this
  }

  /**
   * @interface InsertQueryBuilderInterface
   * @description
   * This interface is used for building INSERT queries and includes methods for specifying columns and values.
   * @typeParam Table - The table to insert into.
   * @typeParam Column - The type of column.
   **/

  export interface InsertQueryBuilderInterface<Table, Column> 
  extends
  CommonUtils {
    column(...columns: Column[]): this
    /**
     * @method insertValues
     * @description
     * Specifies values to be inserted in the query.
     * @param values - The values to insert.
     * @returns This query builder instance.
     */

    insertValues(...values: any[]): this
    returning(...columns: Column[]): this
  }

  /**
   * @interface UpdateQueryBuilderInterface
   * @description
   * This interface is used for building UPDATE queries and includes methods for specifying columns, values, and conditions.
   * @typeParam Table - The table to update.
   * @typeParam Column - The type of column.
   **/

  export interface UpdateQueryBuilderInterface<Table, Column>
  extends
  CommonUtils {
    column(...columns: Column[]): this
    where(condition: QueryBuilderUtils.Condition<Column> | QueryBuilderUtils.Condition<Column>[]): this
    setValues(...values: any[]): this
    returning(...columns: Column[]): this
  }
}

export default WrapperBuilders
