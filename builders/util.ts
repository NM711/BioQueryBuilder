import BioWrapperExecutor from "wrapper/executor"
import type WrapperBuilders from "types/builders.types"
import type WrapperUtils from "types/utils.types"


/**
 * @class BuilderUtils Reusable Builder Class Utils For All Query Builders
 * @template <Column> Generic type that expects columns from the declared Database Tables interface, depending on the builder
 * these columns can be of ALL tables or Specified tables 
 **/

class BuilderUtils<Column> implements WrapperBuilders.BuilderUtils<Column> {
  protected table: string
  protected values: any[]
  protected ingredients: WrapperUtils.QueryIngredients
  protected executor: BioWrapperExecutor
  protected paramCounter: number

  constructor (table: string, executor: BioWrapperExecutor) {
    this.table = table
    this.executor = executor
    this.ingredients = {
      columns: null,
      wheres: null,
      havings: null,
      joins: null,
      groupBy: null,
      distinct: null,
      orderBy: null,
      limit: null,
      offset: null,
      insertValues: null
    }
    this.values = []
    this.paramCounter = 0
  }

 /**
  * @method buildCondition
  * @param options
  * @type WrapperUtils.ConditionBuilderOptions<Column>
  * @description
  * Reusable method meant to generate conditions for the SQL WHERE clause or HAVING clause, it takes a parameter of options
  * which is supposed to implement an interface with the given generic <Column> data.
  **/

  public buildCondition(options: WrapperUtils.ConditionBuilderOptions<Column>): this {
    const savedConditions: string[] = []
    const pusher = (query: string, value: any) => {
      savedConditions.push(query)
      this.values.push(value)
    }

    if (options.condition instanceof Array) {
      for (let i = 0; i <= options.condition.length; i++) {
        const currentCondition = options.condition[i]
        const value = options.condition[i].value
        const query = `${currentCondition.column} ${currentCondition.operator} $${this.paramCounter + 1}`
        
        if (i === 0) {
          pusher(`${options.conditionType} ${query}`, value)
          continue
        }
        pusher(`${currentCondition.seperator} ${query}`, value)
      }
    } else pusher(`${options.conditionType} ${options.condition.column} ${options.condition.operator} $${this.paramCounter + 1}`, options.condition.value)
    

    this.ingredients[options.ingredientProp] = savedConditions.join(" ")

    return this
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
 * This is method is to reuse and construct a WHERE sql clause across all builders, this is because it exists in almost every type of SQL
 * operation except the standalone INSERT.
 * The method takes a condition or conditions of a implemented interface which takes a generic type of Column, this information
 * is useful to the interface because then when I need to do something like "SELECT * FROM TABLE WHERE column = 'HI'" we know what columns
 * are available to us in that instance.
 **/

  public where(condition: WrapperUtils.Condition<Column> | WrapperUtils.Condition<Column>[]): this {
    this.buildCondition({ condition, conditionType: "WHERE", ingredientProp: "wheres" })
    return this
  }
}

export default BuilderUtils
