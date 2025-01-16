import { StudentType, columns } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<StudentType[]> {
  // Fetch data from your API here.
  return [
    {
      id: 1,
      note: "pending",
      email: "m@example.com",
    },
    {
      id: 1,
      note: "pending",
      email: "m@example.com",
    },
    {
      id: 1,
      note: "pending",
      email: "m@example.com",
    },
    {
      id: 1,
      note: "pending",
      email: "m@example.com",
    },
    {
      id: 1,
      note: "pending",
      email: "m@example.com",
    },
    {
      id: 1,
      note: "pending",
      email: "m@example.com",
    },
  ]
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <div className="mx-6 py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
