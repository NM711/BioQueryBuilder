import type NBioWrapper from "types/bioWrapper.types";
import type { Client } from "pg";
import {WrapperUtils} from "types/sql.types";

class BioWrapperExecutor implements NBioWrapper.WrapperExecutor {
  private client: Client

  constructor (client: Client) {
    this.client = client
  }

  async transaction(cb: () => Promise<any>): Promise<any> {
    try {
      await this.client.query("BEGIN")
      await cb() 
      await this.client.query("COMMIT")
    } catch (e) {
      await this.client.query("ROLLBACK")
      console.error("Transaction Failed!")
      // throw the error as to why upwards
      throw e
    }
  }

  async execute(qV: WrapperUtils.QueryAndValues | WrapperUtils.QueriesAndValues): Promise<any> {
    try {
      // we are gonna check for any returned values, and give them to the user so he can do whatever with them after execution
      const returnQuery = async (query: string, values: any[]): Promise<any> => {
        const returned = await this.client.query(query, values)
        const data = returned.rows
        if (data.length > 0 && data[0]) {
          return data
        }
      }

      if (qV instanceof Array) {
        for (const { query, values } of qV) {
          const returnedQueryData = await returnQuery(query, values)
          return returnedQueryData
        }
      } else return await returnQuery(qV.query, qV.values)
    } catch (e) {
      throw e
    }
  }
}

export default BioWrapperExecutor
