import type SQLTypes from "./sql.types"

namespace WrapperUtils {
  export interface QueryAndValues {
    query: string,
    values: any[]
  }

  export type QueriesAndValues = QueryAndValues[]
  

  export interface Condition<Column = string> {
    column: Column
    operator: SQLTypes.SQLConditionOperator
    value: any
    seperator?: SQLTypes.SQLSeperationOperators[]
  }

  export interface QueryIngredients {
    columns: string | null
    wheres: string | null
    havings: string | null
    joins: string[] | null
    groupBy: string | null
    distinct: string | null
    orderBy: string | null
    limit: string | null
    offset: string | null
    actionValues: string | null
    returning: string | null
    [key: string]: string | string[] | null
  }


  export interface ConditionBuilderOptions<Column> {
    condition: Condition<Column> | Condition<Column>[]
    conditionType: SQLTypes.ConditionType
    ingredientProp: "wheres" | "havings"
  }

}

export default WrapperUtils
