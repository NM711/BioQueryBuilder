import BioQuery from "bioquery/director"
import client from "db"
import type DATABASE from "database.types"

async function main () {
  try {
    const wrapper = new BioQuery<DATABASE>(client)
    
    const createUser = await wrapper
    .insert("users")
    .column("username", "email", "password_hash")
    .insertValues("randomUser123", "random@mail.com", "notAHash")
    .returning("user_id")
    .execute()

    const selectUsers = wrapper
    .select("users")
    .column("users.username")
    .where({ column: "users.email", operator: "=", value: "something@mail.com" })
    .build() 

    await wrapper.transaction(async () => {
    // run your code within the transacton
      const pushToPosts = await wrapper
      .insert("posts")
      .column("user_id", "title", "content")
      .insertValues(createUser[0].user_id, "hello title", "hello world")
      .returning("created_at")
      .execute()

      const deleteUser = await wrapper.delete("users")
      .where({
        column: "username",
        operator: "=",
        value: "randomUser123"
      })
      .in("username", selectUsers)
      .execute()
    })

    await wrapper.disconnect()


  } catch (e) {
     console.error(e)
  }
}

main()
