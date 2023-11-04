import type SQLTypes from "./sql.types"
import type WrapperUtils from "./utils.types"

namespace WrapperBuilders {
    
  export interface Joins {
    // looks like bloat I know but, I want descriptive methods
    innerJoin(table: string, c1: string, c2: string): this
    fullOuterJoin(table: string, c1: string, c2: string): this
    leftJoin(table: string, c1: string, c2: string): this
    rightJoin(table: string, c1: string, c2: string): this
    fullJoin(table: string, c1: string, c2: string): this
  }

  export interface ExecutorAndCondition<Column = string> {
    where(condition: WrapperUtils.Condition<Column> | WrapperUtils.Condition<Column>[]): this
    returning?(...columns: string[]): this
    execute(): Promise<any>
  }

  export interface InsertAndUpdateValues<Column = string> {
    setValues(values: WrapperUtils.ColumnAndValue<Column>[]): this
  }

  export interface SelectAndDeleteColumn<Column = string> {
    column(...columns: Column[]): this
  }

  // still need subqueries and CTEs
  
  // <Table, Column extends keyof Table> we essentially destruct the key as Column from the selected table
  export interface SelectQueryBuilderInterface<Table, Column>
  extends 
  SelectAndDeleteColumn<Column>,
  Joins,
  ExecutorAndCondition<Column> {
    distinctOn(...column: Column[] | string[]): this
    orderBy (columns: Column[] | string[], order: SQLTypes.SQLOrderByOperators): this
    groupBy (...columns: Column[] | string[]): this
    having(condition: WrapperUtils.Condition<Column> | WrapperUtils.Condition<Column>[]): this
    limit (limit: number): this
    offset (offset: number): this
  }

  export interface DeleteQueryBuilderInterface extends SelectAndDeleteColumn, ExecutorAndCondition {
  }

  export interface InsertQueryBuilderInterface<Column> extends InsertAndUpdateValues<Column>, ExecutorAndCondition {
  }

  export interface UpdateQueryBuilderInterface<Column> extends InsertAndUpdateValues<Column>, ExecutorAndCondition {
  }

  export interface BuilderUtils {
    buildCondition(options: WrapperUtils.ConditionBuilderOptions): this
  }
}

export default WrapperBuilders
