import BioWrapper from "wrapper/director"
import client from "db"
async function main () {
  try {
    const wrapper = new BioWrapper(client)
    const selectandJOin = wrapper.setSelect("test_data")
                            .setColumn("*")
                            .setGroup("id", "int_field")
                            .setHavingCondition({ condition: "int_field", operator: "<" }).setValue(500)
                            .setOrder(["int_field"], "ASC")
                            .setOffset(123)
                            .build()

    console.log(selectandJOin)
    
    const val = await wrapper.runner.execute(selectandJOin)
    console.log(val)
    const ins = wrapper.setInsert("test_data")
                  .setColumn("int_field").setValue(123)
                  .setColumn("id").setValue(59)
                  .setCondition({ condition: "int_field", operator: "<" }).setValue(300)
                  .setCondition({ condition: "id", operator: "<" }).setValue(25)
                  .setReturning("id", "sometijng")
                  .build()

    console.log(ins)
    await wrapper.disconnect()
  } catch (e) {
     console.error(e)
  }
}

main()
