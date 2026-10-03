"use server";
import {createClient} from "../lib/supabase/server"; import {redirect} from "next/navigation";
export async function submitRelease(f:FormData){const s=await createClient();const {data:{user}}=await s.auth.getUser();if(!user)redirect("/login");await s.from("releases").insert({user_id:user.id,artist_name:String(f.get("artist_name")),title:String(f.get("title")),genre:String(f.get("genre")||""),release_date:String(f.get("release_date")||"")||null,notes:String(f.get("notes")||""),status:"pending"});redirect("/dashboard")}
