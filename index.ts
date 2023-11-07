import BioWrapper from "wrapper/director"
import client from "db"
import type DatabaseTypes from "types/database.types"

async function main () {
  try {
    const wrapper = new BioWrapper<DatabaseTypes.Database>(client)

    const pushToHi = await wrapper
    .insert("hello")
    .column("txt", "num")
    .insertValues("hello world", "1")
    .returning("txt")
    .execute()

    const updateHi = await wrapper
    .update("hello")
    .column("txt")
    .setValues("what is going on!")
    .where({ column: "txt", operator: "=", value: 2 })
    .returning("txt")
    .execute()
    
    console.log(pushToHi, updateHi)

    await wrapper.disconnect()


  } catch (e) {
     console.error(e)
  }
}

main()
