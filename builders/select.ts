import type WrapperUtils from "types/utils.types";
import type SQLTypes from "types/sql.types";
import WrapperBuilders from "types/builders.types";
import BioWrapperExecutor from "wrapper/executor";
import BuilderUtils from "./util";
// NOTE THAT WE SUPPOSE USERS KNOW HOW TO WRITE SQL, MEANING QUERIES SHOULD BE IN ORDER. FOR EXAMPLE
// AN ORDER CANT GO BEFORE A CONDITION AND A JOIN CANT GO AFTER A CONDITION
// error handle so everything is done in order tbh

class SelectQueryBuilder extends BuilderUtils implements WrapperBuilders.SelectQueryBuilderInterface {

  constructor (table: string, executor: BioWrapperExecutor) {
    super(table, executor)
  }

  column(...columns: string[]): this {
    this.ingredients.columns = columns.join(", ")
    return this
  }

  where(condition: WrapperUtils.Condition | WrapperUtils.Condition[]): this {
    this.buildCondition({ condition, conditionType: "WHERE", ingredientProp: "wheres" })
    return this
  }

  distinctOn(...column: string[]): this {
    this.ingredients.distinct = `DISTINCT ON (${column.join(", ")})`
    return this
  }

  private joinQueryBuilder (joinType: SQLTypes.SQLJoinOperators, table: string, c1: string, c2: string) {
    if (!this.ingredients.joins) this.ingredients.joins = []
    this.ingredients.joins.push(`${joinType} JOIN ${table} ON ${c1} = ${c2}`)
  }

  fullJoin(table: string, c1: string, c2: string): this {
    this.joinQueryBuilder("FULL", table, c1, c2)
    return this
  }

  innerJoin(table: string, c1: string, c2: string): this {
    this.joinQueryBuilder("INNER", table, c1, c2)
    return this
  }

  rightJoin(table: string, c1: string, c2: string): this {
    this.joinQueryBuilder("RIGHT", table, c1, c2)
    return this
  }

  leftJoin(table: string, c1: string, c2: string): this {
    this.joinQueryBuilder("LEFT", table, c1, c2)
    return this
  }

  fullOuterJoin(table: string, c1: string, c2: string): this {
    this.joinQueryBuilder("FULL OUTER", table, c1, c2)
    return this
  }

  orderBy(columns: string[], order: SQLTypes.SQLOrderByOperators): this {
    this.ingredients.orderBy = `ORDER BY ${columns.join(", ")} ${order}`
    return this
  }

  groupBy(...columns: string[]): this {
    this.ingredients.groupBys = `GROUP BY ${columns.join(", ")}`
    return this
  }

  having(condition: WrapperUtils.Condition | WrapperUtils.Condition[]): this {
    this.buildCondition({ condition, conditionType: "WHERE", ingredientProp: "havings" })
    return this
  }

  limit(limit: number): this {
    this.ingredients.limit = `LIMIT ${limit}`
    return this
  }

  offset(offset: number): this {
    this.ingredients.offset = `OFFSET ${offset}`
    return this
  }

  async execute(): Promise<any> {
    let query: string[] = ["SELECT"]

    // now we need to glue all the ingredients together
    // we would obviously strucutre the condition in the correct order
    //
    // example
    // if (this.ingredients.where) {
    //   query.push(this.ingredients.where)
    // }
    
    const { distinct, columns, wheres, groupBy, havings, joins, limit, offset, orderBy  } = this.ingredients

    if (distinct) query.push(distinct)
    if (columns) query.push(columns)
    
    query.push(`FROM ${this.table}`)

    if (joins) {
      for (const j of joins) {
        query.push(j)
      }
    }

    if (wheres) query.push(wheres)
    if (groupBy) query.push(groupBy)
    if (havings) query.push(havings)
    if (orderBy) query.push(orderBy)
    if (limit) query.push(limit)
    if (offset) query.push(offset)
    
    return await this.executor.execute({
      query: query.join(" "),
      values: this.values
    })
  }

}

export default SelectQueryBuilder
