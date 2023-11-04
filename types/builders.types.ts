import type SQLTypes from "./sql.types"
import type WrapperUtils from "./utils.types"

namespace WrapperBuilders {
  export interface Joins {
    // looks like bloat I know but, I want descriptive props
    innerJoin(table: string, c1: string, c2: string): this
    fullOuterJoin(table: string, c1: string, c2: string): this
    leftJoin(table: string, c1: string, c2: string): this
    rightJoin(table: string, c1: string, c2: string): this
    fullJoin(table: string, c1: string, c2: string): this
  }

  export interface ExecutorAndCondition {
    where(condition: WrapperUtils.Condition | WrapperUtils.Condition[]): this
    returning?(...columns: string[]): this
    execute(): Promise<any>
  }

  export interface InsertAndUpdateValues {
    setValues(values: WrapperUtils.ColumnAndValue[]): this
  }

  export interface SelectAndDeleteColumn {
    column(...columns: string[]): this
  }

  // still need subqueries and CTEs
  
  export interface SelectQueryBuilderInterface extends SelectAndDeleteColumn, Joins, ExecutorAndCondition {
    distinctOn(...column: string[]): this
    orderBy (columns: string[], order: SQLTypes.SQLOrderByOperators): this
    groupBy (...columns: string[]): this
    having(condition: WrapperUtils.Condition | WrapperUtils.Condition[]): this
    limit (limit: number): this
    offset (offset: number): this
  }

  export interface DeleteQueryBuilderInterface extends SelectAndDeleteColumn, ExecutorAndCondition {
  }

  export interface InsertQueryBuilderInterface extends InsertAndUpdateValues, ExecutorAndCondition {
  }

  export interface UpdateQueryBuilderInterface extends InsertAndUpdateValues, ExecutorAndCondition {
  }

  export interface BuilderUtils {
    buildCondition(options: WrapperUtils.ConditionBuilderOptions): this
  }
}

export default WrapperBuilders
