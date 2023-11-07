import BioWrapperExecutor from "wrapper/executor"
import type WrapperUtils from "types/utils.types"


/**
 * @class BuilderUtils Reusable Builder Class Utils For All Query Builders
 * @template <Column> Generic type that expects columns from the declared Database Tables interface, depending on the builder
 * these columns can be of ALL tables or Specified tables 
 **/

class BuilderUtils<Column> {
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
      actionValues: null,
      returning: null
    }
    this.values = []
    this.paramCounter = 0
  }

 /**
  * @method buildCondition
  * @param options
  * @type WrapperUtils.ConditionBuilderOptions<Column>
  * @description
  * Reusable method meant to generate conditions for SQL, it takes a parameter of options
  * which is supposed to implement an interface with the given generic <Column> data.
  **/

  protected buildCondition(options: WrapperUtils.ConditionBuilderOptions<Column>): this {
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

  protected build(query: string[]): string {
    
    // now we need to glue all the ingredients together
    // we would obviously strucutre the condition in the correct order
    //
    // example
    // if (this.ingredients.where) {
    //   query.push(this.ingredients.where)
    // }
    
    const { distinct, columns, wheres, groupBy, havings, joins, limit, offset, orderBy, actionValues, returning  } = this.ingredients

    if (distinct) query.push(distinct)
    if (columns) query.push(columns)
    
    if (query[0].startsWith("SELECT")) query.push(`FROM ${this.table}`)

    if (joins) {
      for (const j of joins) {
        query.push(j)
      }
    }
    
    if (actionValues) query.push(actionValues)
    if (wheres) query.push(wheres)
    if (returning) query.push(returning)
    if (groupBy) query.push(groupBy)
    if (havings) query.push(havings)
    if (orderBy) query.push(orderBy)
    if (limit) query.push(limit)
    if (offset) query.push(offset)

    return query.join(" ")
  }
}

export default BuilderUtils
