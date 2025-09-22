"use client";
import { useState } from "react";
import { api } from "@/lib/api";

export default function SlackConnectPage() {
  const [link, setLink] = useState(null);
  const [log, setLog] = useState("");

  async function getInstallUrl() {
    setLog("Requesting Slack install URL...");
    try {
      const { installUrl } = await api(`/api/slack/install`, { method: "POST", body: JSON.stringify({}) });
      setLink(installUrl);
      setLog("");
    } catch (e) { setLog(e.message); }
  }

  return (
    <div className="p-6 max-w-xl space-y-3">
      <h1 className="text-2xl font-bold">Connect Slack</h1>
      <p>Install the Slack app to receive PR/test/deploy updates and run quick actions.</p>
      <button onClick={getInstallUrl} className="bg-black text-white px-4 py-2 rounded">Get Install Link</button>
      {link && <div className="mt-3"><a className="text-blue-600 underline" href={link} target="_blank">Install Vibe Slack App</a></div>}
      {log && <pre className="bg-gray-100 p-3 rounded text-sm">{log}</pre>}
    </div>
  );
}
