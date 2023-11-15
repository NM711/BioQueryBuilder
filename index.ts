import BioQuery from "bioquery/director"
import client from "db"
import type DATABASE from "database.types"
/*
* Goals
* 1. build method, builds the query and returns the query string
* 2. Support for AND and also OR clauses when calling IN.
* */


async function main () {
  try {
    const wrapper = new BioQuery<DATABASE>(client)
    
    const createUser = await wrapper
    .insert("users")
    .column("username", "email", "password_hash")
    .insertValues("randomUser123", "random@mail.com", "notAHash")
    .returning("user_id")
    .execute()
    console.log(createUser)

    await wrapper.transaction(async () => {
    // run your code within the transacton
      const pushToPosts = await wrapper
      .insert("posts")
      .column("user_id", "title", "content")
      .insertValues(createUser[0].user_id, "hello title", "hello world")
      .returning("created_at")
      .execute()

      const deleteUser = wrapper.delete("users")
      .where({
        column: "username",
        operator: "=",
        value: "randomUser123"
      })
      .in("username", ["hello", "123", "dsadasd"])
      .build()
    })

    await wrapper.disconnect()


  } catch (e) {
     console.error(e)
  }
}

main()
