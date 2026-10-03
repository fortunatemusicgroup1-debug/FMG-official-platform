import { login } from "../server-actions";
import GoogleButton from "./google-button";

export default function Login() {
  return (
    <main className="page">
      <div className="form">
        <div className="eyebrow">FMG ACCOUNT</div>
        <h1>Artist Login</h1>
        <form action={login}>
          <label className="label">Email</label>
          <input className="input" name="email" type="email" required />
          <label className="label">Password</label>
          <input className="input" name="password" type="password" required />
          <button className="button">Sign in</button>
        </form>
        <div style={{textAlign:"center", margin:"18px 0", opacity:0.7}}>OR</div>
        <GoogleButton />
      </div>
    </main>
  );
}
