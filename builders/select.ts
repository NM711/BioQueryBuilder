import type WrapperUtils from "types/utils.types";
import type SQLTypes from "types/sql.types";
import WrapperBuilders from "types/builders.types";
import BioWrapperExecutor from "wrapper/executor";
import BuilderUtils from "./util";

class SelectQueryBuilder<Table, Column, Database>
extends BuilderUtils<Column>
implements WrapperBuilders.SelectQueryBuilderInterface<Table, Column, Database> {

  constructor (table: string, executor: BioWrapperExecutor) {
    super(table, executor)
  }

  public distinctOn(...column: string[] | Column[]): this {
    this.ingredients.distinct = `DISTINCT ON (${column.join(", ")})`
    return this
  }

  private joinQueryBuilder<NewTable, NewColumn>(joinType: SQLTypes.SQLJoinOperators, table: NewTable, c1: NewColumn, c2: string) {
    if (!this.ingredients.joins) this.ingredients.joins = []
    this.ingredients.joins.push(`${joinType} JOIN ${table} ON ${c1} = ${c2}`)
  }

  public fullJoin<JoinTable extends Extract<keyof Database, string>, JoinColumn = `${JoinTable & string}.${keyof Database[JoinTable] & string}`>(table: JoinTable, c1: JoinColumn, c2: string): this {
    this.joinQueryBuilder<JoinTable, JoinColumn>("FULL", table, c1, c2)
    return this
  } 

  public innerJoin<JoinTable extends Extract<keyof Database, string>, JoinColumn = `${JoinTable & string}.${keyof Database[JoinTable] & string}`>(table: JoinTable, c1: JoinColumn, c2: string): this {
    this.joinQueryBuilder<JoinTable, JoinColumn>("INNER", table, c1, c2)
    return this
  }

  public rightJoin<JoinTable extends Extract<keyof Database, string>, JoinColumn = `${JoinTable & string}.${keyof Database[JoinTable] & string}`>(table: JoinTable, c1: JoinColumn, c2: string): this {
    this.joinQueryBuilder<JoinTable, JoinColumn>("RIGHT", table, c1, c2)
    return this
  }

  public leftJoin<JoinTable extends Extract<keyof Database, string>, JoinColumn = `${JoinTable & string}.${keyof Database[JoinTable] & string}`>(table: JoinTable, c1: JoinColumn, c2: string): this {
    this.joinQueryBuilder<JoinTable, JoinColumn>("LEFT", table, c1, c2)
    return this
  }

  public fullOuterJoin<JoinTable extends Extract<keyof Database, string>, JoinColumn = `${JoinTable & string}.${keyof Database[JoinTable] & string}`>(table: JoinTable, c1: JoinColumn, c2: string): this {
    this.joinQueryBuilder<JoinTable, JoinColumn>("FULL OUTER", table, c1, c2)
    return this
  }

  public orderBy(columns: string[], order: SQLTypes.SQLOrderByOperators): this {
    this.ingredients.orderBy = `ORDER BY ${columns.join(", ")} ${order}`
    return this
  }

  public groupBy(...columns: string[]): this {
    this.ingredients.groupBys = `GROUP BY ${columns.join(", ")}`
    return this
  }

  public having(condition: WrapperUtils.Condition<Column> | WrapperUtils.Condition<Column>[]): this {
    this.buildCondition({ condition, conditionType: "WHERE", ingredientProp: "havings" })
    return this
  }

  public limit(limit: number): this {
    this.ingredients.limit = `LIMIT ${limit}`
    return this
  }

  public offset(offset: number): this {
    this.ingredients.offset = `OFFSET ${offset}`
    return this
  }

  public async execute(): Promise<any> {
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
