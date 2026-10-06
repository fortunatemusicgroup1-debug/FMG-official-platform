import { register } from "../server-actions";

export default async function Register({searchParams}:{searchParams:Promise<{error?:string}>}) {
  const params = await searchParams;
  const error = params?.error;

  return (
    <main className="page">
      <div className="form">
        <div className="eyebrow">JOIN FMG</div>
        <h1>Create artist account</h1>
        {error && (
          <div className="card" style={{marginBottom:18,border:"1px solid #a33"}}>
            <strong>Registration problem</strong>
            <p style={{marginTop:6}}>{decodeURIComponent(error)}</p>
          </div>
        )}
        <form action={register}>
          <label className="label">Artist / Stage Name</label>
          <input className="input" name="artist" required autoComplete="name" />
          <label className="label">Email</label>
          <input className="input" name="email" type="email" required autoComplete="email" />
          <label className="label">Password</label>
          <input className="input" name="password" type="password" minLength={8} required autoComplete="new-password" />
          <button className="button" type="submit">Create account</button>
        </form>
      </div>
    </main>
  );
}
