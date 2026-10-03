"use server";
import {createClient} from "../lib/supabase/server"; import {redirect} from "next/navigation";
export async function login(f:FormData){const s=await createClient();const {error}=await s.auth.signInWithPassword({email:String(f.get("email")),password:String(f.get("password"))});if(error)redirect("/login?error=1");redirect("/dashboard")}
export async function register(f:FormData){const s=await createClient();const {data,error}=await s.auth.signUp({email:String(f.get("email")),password:String(f.get("password"))});if(error||!data.user)redirect("/register?error=1");await s.from("profiles").insert({id:data.user.id,artist_name:String(f.get("artist")),role:"artist"});redirect("/dashboard")}
