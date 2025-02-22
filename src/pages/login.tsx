import React, { useEffect, useState } from "react";
import emitEvent from "@/tools/webSocketHandler";
import Cookies from "universal-cookie";
import router from "next/router";
import Head from "next/head";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { GithubLoginButton, GoogleLoginButton, MicrosoftLoginButton } from "react-social-login-buttons";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isValide, setIsValide] = useState(false);
  const [loginType, setLoginType] = useState<"signin" | "signup">("signin");
  const [isOAuthSignIn, setIsOAuthSignIn] = useState<string | null>(null);
  const { data: session } = useSession() as any;

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

  useEffect(() => {
    if (!session) return;
    emitEvent("userLoginAuth", { username: session.user?.name, email: session.user?.email, image: session.user?.image, authToken: session.accessToken }, (data: { status: string, token: string }) => {
      if (data.status === "success") {
        localStorage.removeItem("isOAuthSignIn");
        cookies.set("token", data.token, { path: "/" });
        router.push("/");
      }
    });
  }, [session]);

  useEffect(() => {
    router.replace("/login", undefined, { shallow: true });
    setIsOAuthSignIn(localStorage.getItem("isOAuthSignIn") as string | null);
  }, []);

  const handleOAuthSignIn = (type: "google" | "azure-ad" | "github") => {
    localStorage.setItem("isOAuthSignIn", type);
    signIn(type);
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
        {isOAuthSignIn && <div className="loading_oauth"><span>Please wait while we sign you in with {isOAuthSignIn}...</span></div>}
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
              <label htmlFor="username">Username <span>*</span></label>
              <input type="text" id="username" name="username" required onChange={(e) => setUsername(e.target.value)} />
            </div>

            <div className="inputBox">
              <label htmlFor="password">Password <span>*</span></label>
              <input type="password" name="password" required onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
            </div>

            <div className="inputBox">
              <input type="button" value={loginType === "signin" ? "Sign in" : "Sign up"} style={{
                backgroundColor: isValide ? "var(--green)" : "#ccc",
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

        <div className="socialLogin">
          <GoogleLoginButton style={{
            borderRadius: "8px",
            transition: "var(--transition)",
          }} onClick={() => handleOAuthSignIn("google")} />
          <MicrosoftLoginButton style={{
            borderRadius: "8px",
            transition: "var(--transition)",
          }} onClick={() => handleOAuthSignIn("azure-ad")} />
          <GithubLoginButton style={{
            borderRadius: "8px",
            transition: "var(--transition)",
          }} onClick={() => handleOAuthSignIn("github")} />
        </div>
      </main>
    </>
  );
}
