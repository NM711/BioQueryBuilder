import BuilderUtil from "./util";
import type { WrapperBuilders, WrapperUtils } from "types/sql.types";

class InsertQueryBuilder extends BuilderUtil implements WrapperBuilders.InsertQueryBuilderInterface {
  returningCols: string[]
  constructor (name: string) {
    super(name)
    this.returningCols = []
  }

  setReturning(...columns: string[]): this {
    this.returningCols.push(...columns)
    return this
  }

  setColumn(column: string): this {
    super.setColumn(column)
    this.counter++
    return this
  }

  build(): WrapperUtils.QueryAndValues {
    const valueParams = this.columns.map((c, i) => `$${i + 1}`).join(", ")
    const builtColumns = this.columns.join(", ")
    // SET RETURNING AT THE END
    if (this.returningCols.length > 0 || this.returningCols[0]) this.query.push(`RETURNING ${this.returningCols.join(", ")}`)
    return {
      query: `INSERT INTO ${this.name} (${builtColumns}) VALUES (${valueParams}) ${this.query.join(" ")}`,
      values: this.values
    }
  }
} 

export default InsertQueryBuilder
