/**
 * @namespace SQLTypes
 * Namespace for defining custom TypeScript types related to SQL operations.
 */
namespace SQLTypes {
   
  /** @type SQLConditionOperator Represents various SQL condition operators. */
  export type SQLConditionOperator = "=" | ">" | "<" | ">=" | "<=" | "<>" | "LIKE" | "IN" | "BETWEEN";

  /** @type SQLSeperationOperators Defines SQL separation operators for combining conditions. */
  export type SQLSeperationOperators = "AND" | "OR" | "NOT";

  /** @type ConditionType Represents condition types in SQL. */
  export type ConditionType = "HAVING" | "WHERE";

  /** @type SQLJoinOperators Defines SQL join operators for combining tables. */
  export type SQLJoinOperators = "INNER" | "LEFT" | "RIGHT" | "FULL" | "FULL OUTER" | "SELF";

  /** @type SQLOrderByOperators Represents sorting operators for SQL's "ORDER BY" clause. */
  export type SQLOrderByOperators = "ASC" | "DESC";

  /** @type PSQLSubQueryExpression Represents the available and valid expressions to form a subquery with in psql. */
  export type PSQLSubQueryExpression = "EXIST" | "IN" | "NOT IN" | "SOME" | "ANY" | "ALL"
}

export default SQLTypes

