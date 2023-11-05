import WrapperBuilders from "types/builders.types";
import BioWrapperExecutor from "wrapper/executor";
import BuilderUtils from "./util";

class InsertQueryBuilder<Table, Column> 
extends BuilderUtils<Column>
implements WrapperBuilders.InsertQueryBuilderInterface<Table, Column> {

  constructor (table: string, executor: BioWrapperExecutor) {
     super(table, executor)
  }

  public insertValues(...values: string[]): this {
    let builtValues: string[] = []
    for (const val of values) {
      this.paramCounter++
      this.values.push(val)
      builtValues.push(`$${this.paramCounter}`)
    }
    this.ingredients.insertValues = `VALUES (${builtValues})`
    return this
  }

  public async execute(): Promise<any> {
    
    const { columns, insertValues, wheres } = this.ingredients

    const query = [`INSERT INTO ${this.table}`]

    if (columns) query.push(columns)

    if (insertValues) query.push(insertValues)

    if (wheres) query.push(wheres)

    return await this.executor.execute({
      query: query.join(" "),
      values: this.values
    })
  } 

}

export default InsertQueryBuilder
