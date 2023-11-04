import BioWrapper from "wrapper/director"
import client from "db"
async function main () {
  try {
    const wrapper = new BioWrapper(client)
    const selectIdsAndInts = await wrapper
    .select("test_data")
    .leftJoin("hello", "hello.num", "test_data.int_field")
    .column("id", "int_field", "num")
    .distinctOn("int_field")
    .orderBy(["int_field"], "ASC")
    .execute()
    
    console.log(selectIdsAndInts)
  } catch (e) {
     console.error(e)
  }
}

main()
