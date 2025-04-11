import { supabaseClient } from "@/lib/server/supabase";
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { currentUser } from "@clerk/nextjs/server";

export default async function Page() {
    const user = await currentUser();
    if (!user) {
      return <p>you are not allowed to see this page</p>
    }
    const supabase = supabaseClient();
    const res = await supabase
        .from("students")
        .select("*")
        .eq("teacher",user.id);
    

    const data = !res.data?[]:res.data.map(student=>({
        id:student.id.toString(),
        email:student.email||"",
        note: student.note ? student.note : "add a note",
    }));
    return (
        <div className="mx-6 py-10">
            <DataTable columns={columns} data={data} />
        </div>
    )
}
