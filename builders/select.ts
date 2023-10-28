import BuilderUtil from "./util";
import BioWrapperError from "wrapper/error";
import { firstCondtionOrChain } from "wrapper/util";
import type { WrapperBuilders, WrapperUtils, SQLTypes } from "types/sql.types";

// NOTE THAT WE SUPPOSE USERS KNOW HOW TO WRITE SQL, MEANING QUERIES SHOULD BE IN ORDER. FOR EXAMPLE
// AN ORDER CANT GO BEFORE A CONDITION AND A JOIN CANT GO AFTER A CONDITION
// error handle so everything is done in order tbh


class SelectQueryBuilder extends BuilderUtil implements WrapperBuilders.SelectQueryBuilderInterface {

  constructor (name: string) {
    super(name)
  }
 
  // join value is for like INNER JOIN sometable ON product.id = othertable.id
  setJoin({ joinOperator, table, condition, operator, value }: WrapperUtils.BuildQueryJoin): this {
    this.query.push(`${joinOperator} JOIN ${table} ON ${condition} ${operator} ${value}`)
    return this 
  }

  setOrder (columns: string[], order: SQLTypes.SQLOrderByOperators): this {
    this.query.push(`ORDER BY ${columns.join(",")} ${order}`)
    return this 
  }

  setGroup(...columns: string[]): this {
    this.query.push(`GROUP BY ${columns.join(", ")}`)
    return this
  }

  setLimit(limit: number): this {
    this.query.push(`LIMIT ${limit}`)
    return this
  }

  setOffset(offset: number): this {
    this.query.push(`OFFSET ${offset}`)
    return this
  }
  
  // setCondtion and setHavingCondition can be refactored, they share the same functionality basically. Keep it DRY.

  setHavingCondition({condition, operator, separator = "AND"}: WrapperUtils.Conditions): this {
    if (!this.query.some(s => s.startsWith("GROUP BY")))  throw new BioWrapperError(`"GROUP BY" should appear before "HAVING"`) 
    firstCondtionOrChain({ condition, operator, separator }, this.counter, this.query, "HAVING")
    this.counter++
    return this
  }

  build (): WrapperUtils.QueryAndValues {
    return {
      query: `SELECT ${this.columns.join(",")} FROM ${this.name} ${this.query.join(" ")}`,
      values: this.values
    }
  }
}

export default SelectQueryBuilder
