import {NextResponse} from "next/server";
import {createClient} from "../../../../lib/supabase/server";
import {getLabelGridStatus} from "../../../../lib/labelgrid";

export async function GET() {
  const s = await createClient();
  const {data:{user}} = await s.auth.getUser();
  if (!user) return NextResponse.json({error:"Unauthorized"}, {status:401});

  const {data:profile} = await s.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "owner") return NextResponse.json({error:"Owner access required"}, {status:403});

  return NextResponse.json({
    provider: "LabelGrid",
    ...await getLabelGridStatus(),
  });
}
