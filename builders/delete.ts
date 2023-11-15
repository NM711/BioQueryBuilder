import BuilderUtils from "./util";
import type WrapperBuilders from "types/builders.types";
import type QueryBuilderUtils from "types/utils.types";
import BioQueryExecutor from "bioquery/executor";

class DeleteQueryBuilder<Table, Column>
extends BuilderUtils<Column>
implements WrapperBuilders.DeleteQueryBuilderInterface<Table, Column> {
  
  private initial: string[]

  constructor (table: string, executor: BioQueryExecutor) {
    super(table, executor)

    this.initial = [`DELETE FROM ${this.table}`]
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

  
  public in(column: Column, args: string | string[]): this {
    this.buildIn(column, args, "IN", "ins")
    return this
  }

  public notIn(column: Column, args: string | string[]): this {
    this.buildIn(column, args, "NOT IN", "notIns")
    return this
  }

 /** @method returning
  *   @param column
  *   @type Column[]
  *   @description
  *   Returns a specified row after deletion.
  * */

  public returning (...column: Column[]): this {
    this.ingredients.returning = `RETURNING ${column.join(", ")}`
    return this
  }

  public build (): string {
    return this.queryBuild(this.initial, "FULL")
  }

  async execute(): Promise<any> {
   const query: string = this.queryBuild(this.initial, "PARAM")

   return await this.executor.execute({
      query,
      values: this.values
    })
  }
}

export default DeleteQueryBuilder
