import BioWrapperExecutor from "wrapper/executor"
import type WrapperBuilders from "types/builders.types"
import type WrapperUtils from "types/utils.types"

class BuilderUtils implements WrapperBuilders.BuilderUtils {
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
      offset: null
    }
    this.values = []
    this.paramCounter = 0
  }

  buildCondition(options: WrapperUtils.ConditionBuilderOptions): this {
    const savedConditions: string[] = []
    const pusher = (query: string, value: any) => {
      savedConditions.push(query)
      this.values.push(value)
    }

    if (options.condition instanceof Array) {
      for (let i = 0; i <= options.condition.length; i++) {
        const currentCondition = options.condition[i]
        const value = options.condition[i].value
        const query = `${currentCondition.field} ${currentCondition.operator} $${this.paramCounter + 1}`
        
        if (i === 0) {
          pusher(`${options.conditionType} ${query}`, value)
          continue
        }
        pusher(`${currentCondition.seperator} ${query}`, value)
      }
    } else pusher(`${options.conditionType} ${options.condition.field} ${options.condition.operator} $${this.paramCounter + 1}`, options.condition.value)
    

    this.ingredients[options.ingredientProp] = savedConditions.join(" ")

    return this
  }
}

export default BuilderUtils
