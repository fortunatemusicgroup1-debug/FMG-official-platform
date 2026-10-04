"use server";

import {createClient} from "../lib/supabase/server";
import {redirect} from "next/navigation";

function getFile(value: FormDataEntryValue | null) {
  return value instanceof File && value.size > 0 ? value : null;
}

export async function submitRelease(f: FormData) {
  const s = await createClient();
  const {data:{user}} = await s.auth.getUser();
  if(!user) redirect("/login");

  const audio = getFile(f.get("audio"));
  const artwork = getFile(f.get("artwork"));

  if(!audio || !artwork) redirect("/submit?error=files");

  const audioPath = user.id + "/" + crypto.randomUUID() + "-" + audio.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const artworkPath = user.id + "/" + crypto.randomUUID() + "-" + artwork.name.replace(/[^a-zA-Z0-9._-]/g, "_");

  const audioUpload = await s.storage.from("fmg-audio").upload(audioPath, audio, {
    contentType: audio.type || "audio/mpeg",
    upsert: false,
  });
  if(audioUpload.error) redirect("/submit?error=audio");

  const artworkUpload = await s.storage.from("fmg-artwork").upload(artworkPath, artwork, {
    contentType: artwork.type || "image/jpeg",
    upsert: false,
  });
  if(artworkUpload.error) {
    await s.storage.from("fmg-audio").remove([audioPath]);
    redirect("/submit?error=artwork");
  }

  const {error} = await s.from("releases").insert({
    user_id:user.id,
    artist_name:String(f.get("artist_name")),
    title:String(f.get("title")),
    genre:String(f.get("genre") || ""),
    release_date:String(f.get("release_date") || "") || null,
    notes:String(f.get("notes") || ""),
    audio_path:audioPath,
    artwork_path:artworkPath,
    status:"pending"
  });

  if(error) {
    await s.storage.from("fmg-audio").remove([audioPath]);
    await s.storage.from("fmg-artwork").remove([artworkPath]);
    redirect("/submit?error=release");
  }

  redirect("/dashboard");
}
