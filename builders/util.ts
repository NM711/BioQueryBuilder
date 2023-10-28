import { firstCondtionOrChain } from "wrapper/util"
import type { WrapperUtils } from "types/sql.types"

// util class which we will extend, i aim for this class to share functionality across multiple builders.

class BuilderUtil {
  protected query: string[]
  protected name: string
  protected values: any[]
  protected columns: string[]
  protected counter: number

  constructor (name: string) {
    this.name = name
    this.query = []
    this.values = []
    this.columns = []
    this.counter = 1
  }

  setColumn (column: string): this {
    this.columns.push(column)
    return this
  }
  
  // set value can also be used with DELETE because u gotta set the condition value

  setValue (value: any): this {
    this.values.push(value)
    return this
  }

  // condition values are set with setValue() which essentially means that condition values in the query are params
  // seperator will appear after the WHERE clause, because in sql u can append with AND or OR, by default it will stay on AND
  // but if the user decides that they want OR they can add it optionally

  setCondition ({ condition, operator, separator = "AND" }: WrapperUtils.Conditions): this {
    firstCondtionOrChain({ condition, operator, separator }, this.counter, this.query)
    this.counter++
    return this
  }
}

export default BuilderUtil
