"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function Accept() {
  const sp = useSearchParams(); const router = useRouter();
  const [msg,setMsg]=useState("Accepting invite...");
  useEffect(()=>{
    const token = sp.get("token"); if(!token){ setMsg("Missing token"); return; }
    (async()=>{
      try{
        await api(`/api/invites/accept`, { method:"POST", body: JSON.stringify({ token }) });
        setMsg("Invite accepted. Redirecting...");
        setTimeout(()=>router.push("/tests"), 800);
      }catch(e){ setMsg("Error: "+e.message); }
    })();
  },[]);
  return <div className="p-6">{msg}</div>;
}
