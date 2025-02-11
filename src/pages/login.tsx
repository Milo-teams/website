import React, { useEffect, useState } from "react";
import emitEvent from "@/tools/webSocketHandler";
import Cookies from "universal-cookie";
import router from "next/router";
import Head from "next/head";
import Image from "next/image";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isValide, setIsValide] = useState(false);
  const [loginType, setLoginType] = useState<"signin" | "signup">("signin");

  const cookies = new Cookies();
  const token = cookies.get("token");

  useEffect(() => {
    if (token) router.push("/chats");
  }, [token]);

  useEffect(() => {
      if (username.length >= 3 && password.length >= 3) setIsValide(true);
      else setIsValide(false);
  }, [loginType, username, password]);

  const handleSubmit = async () => {
    emitEvent(loginType === "signin" ? "userLogin" : "userCreate", { username, password }, (data: { status: string, token: string }) => {
      if (data.status === "success") {
        cookies.set("token", data.token, { path: "/" });
        router.push("/");
      } else {
        alert("Username or password is incorrect");
      }
    });
  };

  return (
    <>
      <Head>
        <title>Login ~ Milo</title>
        <meta name="description" content="WhatsUp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#5ad27d" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="contentLogin">
        <div className="header">
          <div className="logo">
            <Image src="/favicon.ico" alt="Milo" width={160} height={160} />
          </div>
          <h1>Milo Chat</h1>

          <div className="subtitle">
            <h3>{loginType === "signin" ? "Sign in" : "Sign up"}</h3>
            <p>{loginType === "signin" ? "Sign in to your account" : "Sign up to create an account"}</p>
          </div>
        </div>

        <div className="loginBox">
          <form id="loginForm">
            <div className="inputBox">
              <label form="loginForm">Username <span>*</span></label>
              <input type="text" name="username" required onChange={(e) => setUsername(e.target.value)} />
            </div>

            <div className="inputBox">
              <label form="loginForm">Password <span>*</span></label>
              <input type="password" name="password" required onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
            </div>

            <div className="inputBox">
              <input type="button" value={loginType === "signin" ? "Sign in" : "Sign up"} style={{
                backgroundColor: isValide ? "var(--green)" : "var(--white-dark)",
                cursor: isValide ? "pointer" : "not-allowed"
              }} disabled={!isValide} onClick={handleSubmit} />
            </div>
          </form>
          <div className="register">
            <p>
              {loginType === "signin" ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => setLoginType(loginType === "signin" ? "signup" : "signin")}>{loginType === "signin" ? "Sign up" : "Sign in"}</button>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
