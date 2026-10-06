import {createClient} from "../../lib/supabase/server";
import {approveRelease, rejectRelease} from "./actions";

export default async function Owner(){
  const s=await createClient();
  const {data:{user}}=await s.auth.getUser();
  if(!user)return <main className="page"><h1>Owner login required</h1></main>;

  const {data:profile}=await s.from("profiles").select("role").eq("id",user.id).single();
  if(profile?.role!=="owner")return <main className="page"><h1>Owner access required</h1><p className="muted">This area is restricted to the FMG owner.</p></main>;

  const {data:rs}=await s.from("releases").select("*").order("created_at",{ascending:false});
  const releases=rs||[];

  return <main className="page">
    <div className="eyebrow">FMG ADMIN</div>
    <h1>Owner Dashboard</h1>
    <div className="statgrid">
      <div className="stat"><b>{releases.filter((r:any)=>r.status==="pending").length}</b>Pending</div>
      <div className="stat"><b>{releases.filter((r:any)=>r.status==="approved").length}</b>Approved</div>
      <div className="stat"><b>{releases.filter((r:any)=>r.status==="rejected").length}</b>Rejected</div>
    </div>

    <div style={{marginTop:25}}>
      {releases.length===0 ? <div className="card"><p className="muted">No releases have been submitted yet.</p></div> :
      releases.map((r:any)=><div className="card" key={r.id} style={{marginBottom:12}}>
        <h3>{r.title} — {r.artist_name}</h3>
        <p className="muted">{r.genre || "Genre not specified"}{r.release_date ? " • Release date: "+r.release_date : ""}</p>
        <span className={"status "+r.status}>{r.status}</span>

        {r.notes && <p style={{marginTop:10}}><b>Artist notes:</b> {r.notes}</p>}

        {r.status==="pending" && <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:16}}>
          <form action={approveRelease}>
            <input type="hidden" name="releaseId" value={r.id}/>
            <button type="submit">Approve</button>
          </form>
          <form action={rejectRelease} style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <input type="hidden" name="releaseId" value={r.id}/>
            <input name="reason" required placeholder="Reason for rejection"/>
            <button type="submit">Reject</button>
          </form>
        </div>}

        {r.status==="rejected" && r.rejection_reason && <p className="muted" style={{marginTop:10}}><b>Rejection reason:</b> {r.rejection_reason}</p>}
        {r.reviewed_at && <p className="muted" style={{marginTop:8}}>Reviewed: {new Date(r.reviewed_at).toLocaleString()}</p>}
      </div>)}
    </div>
  </main>
}
