import BioWrapperExecutor from "bioquery/executor"
import BioQueryError from "bioquery/error"
import type QueryBuilderUtils from "types/utils.types"

function initializeIngredients (): QueryBuilderUtils.QueryIngredients {
  return {
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
    returning: null,
    ins: null,
    notIns: null
  }
}

/**
 * @class BuilderUtils Reusable Builder Class Utils For All Query Builders
 * @template <Column> Generic type that expects columns from the declared Database Tables interface, depending on the builder
 * these columns can be of ALL tables or Specified tables 
 **/

class BuilderUtils<Column> {
  protected table: string
  protected values: any[]
  protected ingredients: QueryBuilderUtils.QueryIngredients
  protected executor: BioWrapperExecutor
  protected paramCounter: number

  constructor (table: string, executor: BioWrapperExecutor) {
    this.table = table
    this.executor = executor
    this.ingredients = initializeIngredients()
    this.values = []
    this.paramCounter = 0
  }

 /**
  * @method buildCondition
  * @param options
  * @type QueryBuilderUtils.ConditionBuilderOptions<Column>
  * @description
  * Reusable method meant to generate conditions for SQL, it takes a parameter of options
  * which is supposed to implement an interface with the given generic <Column> data.
  **/

  protected buildCondition(options: QueryBuilderUtils.ConditionBuilderOptions<Column>): this {
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
  * @method buildIn
  * @param col 
  * @type Column
  * @param args
  * @type string | string[]
  * @param type
  * @type "IN" | "NOT IN"
  * @param prop
  * @type "ins" | "notIns"
  * @description
  * Reusbale method that allows for the creation of a SQL "IN" or a "NOT IN" within the "WHERE" clause,
  * works for all operations except "INSERT" because this operation does not support "WHERE" clauses.
  */

  protected buildIn (col: Column, args: string | string[], type: "IN" | "NOT IN", prop: "ins" | "notIns") {
    let builtInQuery: string = ""
    if (args instanceof Array) {
      let inValues: string[] = []
      
      for (const v of args) {
        // this doesnt fully work how i want yet
        this.paramCounter = this.paramCounter + 1
        inValues.push(`$${this.paramCounter + 1}`)
        this.values.push(v)
      }
    
      // maybe add some regex checks to see if the pattern is matched: IN (values)

      builtInQuery = `${col} ${type} ( ${inValues.join(", ")} )`
    } else {
      console.log(args)
      if (!args.startsWith("SELECT")) throw new BioQueryError(`"${type}" has no values to match and has no nested "SELECT" query!`)
      builtInQuery = `${col} ${type} ( ${args} )`
    }

    if (!this.ingredients["wheres"]) this.ingredients[prop] = builtInQuery
    else this.ingredients[prop] = `AND ${builtInQuery}`
  }

  protected fullBuild (query: string): string {

    const splitQuery = query.split(" ")

    for (let i = 0; i <= splitQuery.length; i++) {

      if (!/\$\d/g.test(splitQuery[i])) continue
    
      const params = splitQuery[i].split("")

      const paramNum = params[1]

      params.splice(0, 2, this.values[Number(paramNum) - 1])
      params[0] = `'${params[0]}'`
      splitQuery[i] = params.join("")
    }
    return splitQuery.join(" ")
  }

  protected queryBuild(query: string[], mode: "FULL" | "PARAM" = "FULL"): string {
    
    // now we need to glue all the ingredients together
    // we would obviously strucutre the condition in the correct order
    //
    // example
    // if (this.ingredients.where) {
    //   query.push(this.ingredients.where)
    // }
    
    const { distinct, columns, wheres, groupBy, havings, joins, limit, offset, orderBy, actionValues, returning, notIns, ins } = this.ingredients

    if (distinct) query.push(distinct)
    if (columns) query.push(columns)
    
    if (query[0].startsWith("SELECT")) query.push(`FROM ${this.table}`)

    if (joins) {
      for (const j of joins) {
        query.push(j)
      }
    }
    
    if (actionValues) query.push(actionValues)
    if (wheres) {
      const splitWhere = wheres.split(" ")
      switch (true) {
        case (ins !== null && notIns !== null):
          // Maybe I dont want an and, instead i want an or. Make it so I can accomplish this in someway later on
          const condition = `${ins} AND ${notIns}`
          splitWhere.push(condition)
          break
        case (ins !== null):
          splitWhere.push(ins as string)
          break
        case (notIns !== null):
          splitWhere.push(notIns as string)
          break
      }
      query.push(splitWhere.join(" "))
    }

    if (returning) query.push(returning)
    if (groupBy) query.push(groupBy)
    if (havings) query.push(havings)
    if (orderBy) query.push(orderBy)
    if (limit) query.push(limit)
    if (offset) query.push(offset)


    // build mode,
    // PARAM = param mode as in we build the query with the params example: "SELECT * FROM hello WHERE x = $1;"
    // FULL = build the complete query, no params: "SELECT * FROM hello WHERE x = 'hello world';"
    // defaults to FULL, because the method will be public facing.
    
    switch (mode) {
      case "FULL":
        return this.fullBuild(query.join(" "))
      case "PARAM":
        return query.join(" ")
      default:
        return "FAILED TO BUILD QUERY!"
    }
  }
}

export default BuilderUtils
