namespace SQLTypes {
  export type SQLConditionOperator = "=" | ">" | "<" | ">=" | "<=" | "<>" | "!=" | "LIKE" | "IN" | "BETWEEN"

  export type SQLSeperationOperators = "AND" | "OR" | "NOT"

  export type SQLJoinOperators = "INNER" | "LEFT" | "RIGHT" | "FULL" | "FULL OUTER" | "SELF"

  // ORDER BY category ASC, price DESC
  export type SQLOrderByOperators = "ASC" | "DESC"
}

namespace WrapperUtils {
  export interface Conditions {
    // operator because in a sql WHERE clause you can include a = || > || < || etc
    condition: string
    operator: SQLTypes.SQLConditionOperator
    separator?: SQLTypes.SQLSeperationOperators
  }

  export interface QueryAndValues {
    query: string,
    values: any[]
  }

  export type QueriesAndValues = QueryAndValues[]

  export interface BuildQueryJoin {
    joinOperator: SQLTypes.SQLJoinOperators
    table: string
    condition: string
    operator: SQLTypes.SQLConditionOperator
    value: string
  }
}

namespace WrapperBuilders {
  export interface SetConditionsAndValuesInterface {
    setCondition ({ condition, operator, separator }: WrapperUtils.Conditions): this
    setValue (value: any): this
  }

  export interface InsertQueryBuilderInterface {
    setInsertColumn (column: string): this
    // returnings can include WHERE clauses, ORDER BY and thats it I believe
    setReturning (column: string): this
    build (): WrapperUtils.QueryAndValues
  }

  export interface SelectQueryBuilderInterface extends SetConditionsAndValuesInterface {
    setColumn (column: string): this
    setJoin ({ joinOperator, table, condition, operator }: WrapperUtils.BuildQueryJoin): this
    setOrder (columns: string[], order: SQLTypes.SQLOrderByOperators): this
    setGroup (...columns: string[]): this
    setHavingCondition ({ condition, operator, separator }: WrapperUtils.Conditions): this
    build (): WrapperUtils.QueryAndValues
  }

  export interface UpdateQueryBuilderInterface extends SetConditionsAndValuesInterface{
    setReturning (column: string): this
    build (): WrapperUtils.QueryAndValues
  }
}

export { SQLTypes, WrapperUtils, WrapperBuilders }
