import BuilderUtils from "./util";
import type WrapperBuilders from "types/builders.types";
import type QueryBuilderUtils from "types/utils.types";

class DeleteQueryBuilder<Table, Column>
extends BuilderUtils<Column>
implements WrapperBuilders.DeleteQueryBuilderInterface<Table, Column> {
  
  
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
  *   Returns a specified row after deletion.
  * */

  public returning (...column: Column[]): this {
    this.ingredients.returning = `RETURNING ${column.join(", ")}`
    return this
  }

  async execute(): Promise<any> {
   const query: string = this.build( [`DELETE FROM ${this.table}`])

   return await this.executor.execute({
      query,
      values: this.values
    })
  }
}

export default DeleteQueryBuilder
