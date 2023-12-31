import BuilderUtils from "./util";
import BioQueryError from "bioquery/error";
import type WrapperBuilders from "types/builders.types";
import type QueryBuilderUtils from "types/utils.types";
import BioQueryExecutor from "bioquery/executor";

class UpdateQueryBuilder<Table, Column>
extends BuilderUtils<Column>
implements WrapperBuilders.UpdateQueryBuilderInterface<Table, Column> {
  
  private initial: string[]

  constructor(table: string, executor: BioQueryExecutor) {
    super(table, executor)
    this.initial = [`UPDATE ${this.table}`]
  }

  public column(...columns: Column[]): this {
    this.ingredients.columns = columns.join(" ")
    return this
  }

  public setValues(...values: any[]): this {

    let builtValues: string[] = []

    if (!this.ingredients.columns) throw new Error("You cannot set values to update without specifying what columns should be updated first!")

    const columns = this.ingredients.columns.split(" ")

    if (values.length > columns.length) throw new BioQueryError("When updating the amount of values should be equal to the amount of columns needed!")
    
    for (let i = 0; i < columns.length; i++) {
      this.paramCounter++
      this.values.push(values[i])
      builtValues.push(`${columns[i]} = $${this.paramCounter}`)
    }

    this.ingredients.actionValues = `SET ${builtValues.join(", ")}`
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

  public returning(...columns: Column[]): this {
    this.ingredients.returning = `RETURNING ${columns.join(", ")}`
    return this
  }

  public build(): string {
    return this.queryBuild(this.initial, "FULL")
  }

  public async execute(): Promise<any> {
    const query: string = this.queryBuild(this.initial, "PARAM")
    
    return await this.executor.execute({
      query,
      values: this.values
    })

  }
}

export default UpdateQueryBuilder
