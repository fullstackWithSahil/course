import { z } from "zod";


const data = schemaValidation({
  to:["sahil@gmail.com","tanay@gmail.com"],
  from:"sahil@gmail.com",
  subject:"test",
//   template:"sahil",
  variables:{
    name:"sahil",
    age:19
  }
})

console.log(data)