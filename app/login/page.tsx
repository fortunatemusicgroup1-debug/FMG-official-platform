import { login } from "../server-actions";
import GoogleButton from "./google-button";

export default async function Login({searchParams}:{searchParams:Promise<{error?:string}>}) {
  const params = await searchParams;
  const error = params?.error;

  return (
    <main className="page">
      <div className="form">
        <div className="eyebrow">FMG ACCOUNT</div>
        <h1>Artist Login</h1>
        {error && (
          <div className="card" style={{marginBottom:18,border:"1px solid #a33"}}>
            <strong>Sign-in problem</strong>
            <p style={{marginTop:6}}>{decodeURIComponent(error)}</p>
          </div>
        )}
        <form action={login}>
          <label className="label">Email</label>
          <input className="input" name="email" type="email" autoComplete="email" required />
          <label className="label">Password</label>
          <input className="input" name="password" type="password" autoComplete="current-password" required />
          <button className="button" type="submit">Sign in</button>
        </form>
        <div style={{textAlign:"center", margin:"18px 0", opacity:0.7}}>OR</div>
        <GoogleButton />
      </div>
    </main>
  );
}
