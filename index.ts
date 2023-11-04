import BioWrapper from "wrapper/director"
import client from "db"
import type DatabaseTypes from "types/database.types"

async function main () {
  try {
    const wrapper = new BioWrapper<DatabaseTypes.Database>(client)
    const selectIdsAndInts = await wrapper
    .select("test_data")
    .distinctOn()
    .leftJoin("", "hello.num", "test_data.int_field")
    .column("id", "int_field", "int_text2")
    .orderBy(["int_field"], "ASC")
    .execute()
    
    console.log(selectIdsAndInts)
  } catch (e) {
     console.error(e)
  }
}

main()
