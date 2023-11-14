import NBioQuery from "types/bioquery.types";
import type { Client } from "pg";
import type QueryBuilderUtils from "types/utils.types";

class BioQueryExecutor implements NBioQuery.QueryExecutor {
  private client: Client

  constructor (client: Client) {
    this.client = client
  }

  async execute(qV: QueryBuilderUtils.QueryAndValues | QueryBuilderUtils.QueriesAndValues): Promise<any> {
    try {
      // we are gonna check for any returned values, and give them to the user so he can do whatever with them after execution
      const returnQuery = async (query: string, values: any[]): Promise<any> => {
        console.log(query, values)
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

export default BioQueryExecutor
