import {createClient} from "../../lib/supabase/server"; import {submitRelease} from "../submit-action";

export default async function Submit(){
  const s=await createClient();
  const {data:{user}}=await s.auth.getUser();
  if(!user)return <main className="page"><h1>Sign in required</h1></main>;

  return <main className="page">
    <div className="form">
      <div className="eyebrow">NEW RELEASE</div>
      <h1>Submit music to FMG</h1>
      <div className="notice">Your submission will remain <b>pending</b> until an authorized FMG owner approves it.</div>

      <form action={submitRelease} encType="multipart/form-data" style={{marginTop:20}}>
        <label className="label">Artist / Stage Name</label>
        <input className="input" name="artist_name" required />

        <label className="label">Song Title</label>
        <input className="input" name="title" required />

        <label className="label">Genre</label>
        <select className="input" name="genre" required defaultValue="">
          <option value="" disabled>Select a genre</option>
          <option>Afrobeats</option>
          <option>Hip Hop</option>
          <option>R&B</option>
          <option>Gospel</option>
          <option>Amapiano</option>
          <option>Dancehall</option>
          <option>Reggae</option>
          <option>Pop</option>
          <option>Other</option>
        </select>

        <label className="label">Release Date</label>
        <input className="input" name="release_date" type="date" />

        <label className="label">Audio File</label>
        <input className="input" name="audio" type="file" accept=".mp3,.wav,.m4a,audio/mpeg,audio/wav,audio/x-wav,audio/mp4" required />

        <label className="label">Cover Artwork</label>
        <input className="input" name="artwork" type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png" required />

        <label className="label">Notes</label>
        <textarea className="input" name="notes" rows={5} />

        <button className="button">Send for FMG Approval</button>
      </form>
    </div>
  </main>
}