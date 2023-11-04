namespace SQLTypes {
  export type SQLConditionOperator = "=" | ">" | "<" | ">=" | "<=" | "<>" | "!=" | "LIKE" | "IN" | "BETWEEN"

  export type SQLSeperationOperators = "AND" | "OR" | "NOT"

  export type ConditionType = "HAVING" | "WHERE"

  export type SQLJoinOperators = "INNER" | "LEFT" | "RIGHT" | "FULL" | "FULL OUTER" | "SELF"

  // ORDER BY category ASC, price DESC
  export type SQLOrderByOperators = "ASC" | "DESC"
}

export default SQLTypes
