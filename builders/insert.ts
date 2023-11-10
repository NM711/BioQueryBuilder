import BioWrapperExecutor from "bioquery/executor";
import BuilderUtils from "./util";
import type WrapperBuilders from "types/builders.types";
import type QueryBuilderUtils from "types/utils.types";

class InsertQueryBuilder<Table, Column> 
extends BuilderUtils<Column>
implements WrapperBuilders.InsertQueryBuilderInterface<Table, Column>{

  constructor (table: string, executor: BioWrapperExecutor) {
     super(table, executor)
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

  public insertValues(...values: any[]): this {
    let builtValues: string[] = []
    for (const val of values) {
      this.paramCounter++
      this.values.push(val)
      builtValues.push(`$${this.paramCounter}`)
    }
    this.ingredients.actionValues = `VALUES (${builtValues})`
    return this
  }

  /**
   * @method where
   * @param condition
   * @type QueryBuilderUtils.Condition<Column>
   * @type QueryBuilderUtils.Condition<Column>[]
   * @description 
   * Method used to construct a WHERE clause in SQL, ```sql
   * SELECT * FROM table WHERE (condition) (operator) (value);
   * ```
   **/

  public where(condition: QueryBuilderUtils.Condition<Column> | QueryBuilderUtils.Condition<Column>[]): this {
    this.buildCondition({ condition, conditionType: "WHERE", ingredientProp: "wheres" })
    return this
  }

  /** @method returning
  *   @param column
  *   @type Column[]
  *   @description
  *   Returns a specified row after insertion.
  * */

  public returning (...column: Column[]): this {
    this.ingredients.returning = `RETURNING ${column.join(", ")}`
    return this
  }

  public async execute(): Promise<any> {
    
    const query: string = this.build([`INSERT INTO ${this.table}`])

    return await this.executor.execute({
      query,
      values: this.values
    })
  } 

}

export default InsertQueryBuilder
