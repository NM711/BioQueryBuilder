import WrapperBuilders from "types/builders.types";
import BioWrapperExecutor from "bioquery/executor";
import BuilderUtils from "./util";
import type QueryBuilderUtils from "types/utils.types";
import type SQLTypes from "types/sql.types";

class SelectQueryBuilder<Table, Column, Database>
extends BuilderUtils<Column>
implements WrapperBuilders.SelectQueryBuilderInterface<Table, Column, Database> {
  private initial: string[]

  constructor (table: string, executor: BioWrapperExecutor) {
    super(table, executor)
    this.initial = [`SELECT`]
  }

  /**
   * @method column
   * @param ...options
   * @type Column[]
   * @description
   * This method is meant to set the columns for a given sql query depending on what the value of the passed generic <Column> type is.
   * For example a basic INSERT SQL Query would look like: INSERT INTO "table" (col1, col2, col3) VALUES ($1, $2, $3);
   * Another example could be of a basic SELECT SQL query: SELECT (col1, col2, col3) FROM "table";
   **/

  public column(...columns: Column[]): this {
    this.ingredients.columns = `(${columns.join(", ")})`
    return this
  }

  /**
   * @method where
   * @param condition
   * @type WrapperUtils.Condition<Column>
   * @type WrapperUtils.Condition<Column>[]
   * @description 
   * Method used to construct a WHERE clause in SQL, ```sql
   * SELECT * FROM table WHERE (condition) (operator) (value);
   * ```
   **/

  public where(condition: QueryBuilderUtils.Condition<Column> | QueryBuilderUtils.Condition<Column>[]): this {
    
    this.buildCondition({ condition, conditionType: "WHERE", ingredientProp: "wheres" })
    return this
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

  public having(condition: QueryBuilderUtils.Condition<Column> | QueryBuilderUtils.Condition<Column>[]): this {
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
  
  public in(column: Column, args: string | string[]): this {
    this.buildIn(column, args, "IN", "ins")
    return this
  } 

  public notIn(column: Column, args: string | string[]): this {
    this.buildIn(column, args, "NOT IN", "notIns")
    return this
  }

  // helper
  private columnChecker () {
    if (!this.ingredients.columns) {
      this.ingredients.columns = "*"
    }
  }

  public build(): string {
    this.columnChecker()
    return this.queryBuild(this.initial, "FULL")
  }

  public async execute(): Promise<any> {
    this.columnChecker()
    const query: string = this.queryBuild(this.initial, "PARAM")
    return await this.executor.execute({
      query,
      values: this.values
    })
  }

}

export default SelectQueryBuilder
