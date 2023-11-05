import BioWrapper from "wrapper/director"
import client from "db"
import type DatabaseTypes from "types/database.types"

async function main () {
  try {
    const wrapper = new BioWrapper<DatabaseTypes.Database>(client)

    const insertHello = await wrapper
    .insert("hello")
    .column("num", "txt")
    .insertValues("1", "2")
    .execute()

  } catch (e) {
     console.error(e)
  }
}

main()
