import type SQLTypes from "./sql.types"
import type WrapperUtils from "./utils.types"
import type NBioWrapper from "./bioWrapper.types"

/**
* @namespace WrapperBuilders
*
* */

namespace WrapperBuilders {
  
  export interface Joins<Database> {

    innerJoin
    <JoinTable extends Extract<keyof Database, string>, JoinColumn = NBioWrapper.SpecificTableColumn<Database, JoinTable>>
    (table: JoinTable, c1: JoinColumn, c2: string): this


    fullOuterJoin
    <JoinTable extends Extract<keyof Database, string>, JoinColumn = NBioWrapper.SpecificTableColumn<Database, JoinTable>>
    (table: JoinTable, c1: JoinColumn, c2: string): this


    leftJoin
    <JoinTable extends Extract<keyof Database, string>, JoinColumn = NBioWrapper.SpecificTableColumn<Database, JoinTable>>
    (table: JoinTable, c1: JoinColumn, c2: string): this


    rightJoin
    <JoinTable extends Extract<keyof Database, string>, JoinColumn = NBioWrapper.SpecificTableColumn<Database, JoinTable>>
    (table: JoinTable, c1: JoinColumn, c2: string): this


    fullJoin
    <JoinTable extends Extract<keyof Database, string>, JoinColumn = NBioWrapper.SpecificTableColumn<Database, JoinTable>>
    (table: JoinTable, c1: JoinColumn, c2: string): this
  }

  export interface CommonUtils<Column = string> {
    where(condition: WrapperUtils.Condition<Column> | WrapperUtils.Condition<Column>[]): this
    returning?(...columns: Column[]): this
    execute(): Promise<any>
  }

  export interface InsertAndUpdateValues {
    insertValues(...values: string[]): this
  }

  // still need subqueries and CTEs
  
  export interface SelectQueryBuilderInterface<Table, Column, Database>
  extends 
  Joins<Database>,
  Omit<CommonUtils<Column>, "returning()"> {
    column(...columns: Column[]): this
    distinctOn(...column: Column[] | string[]): this
    orderBy (columns: Column[] | string[], order: SQLTypes.SQLOrderByOperators): this
    groupBy (...columns: Column[] | string[]): this
    having(condition: WrapperUtils.Condition<Column> | WrapperUtils.Condition<Column>[]): this
    limit (limit: number): this
    offset (offset: number): this
  }

  export interface DeleteQueryBuilderInterface<Table, Column> 
  extends 
  CommonUtils<Column> {
    column(...columns: Column[]): this
  }

  export interface InsertQueryBuilderInterface<Table, Column> 
  extends
  InsertAndUpdateValues,
  Omit<CommonUtils<Column>, "where()"> {
    column(...columns: Column[]): this
  }

  export interface UpdateQueryBuilderInterface<Table, Column>
  extends
  InsertAndUpdateValues,
  CommonUtils<Column> {
    column(...columns: Column[]): this
  }

  export interface BuilderUtils<Column> {
    buildCondition(options: WrapperUtils.ConditionBuilderOptions<Column>): this
  }
}

export default WrapperBuilders
