import BioWrapper from "wrapper/director"
import client from "db"
async function main () {
  try {
    const wrapper = new BioWrapper(client)
    const selectandJOin = wrapper.setSelect("test_data")
                            .setColumn("*")
                            .setGroup("id", "int_field")
                            .setOrder(["int_field"], "ASC")
                            .setHavingCondition({ condition: "int_field", operator: "<" }).setValue(500)
                            .build()

    console.log(selectandJOin)
    const val = await wrapper.runner.execute(selectandJOin)
    console.log(val)
    await wrapper.disconnect()
  } catch (e) {
     console.error(e)
  }
}

main()
