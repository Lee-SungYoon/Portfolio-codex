"use client";

import { useEffect, useState } from "react";
import RevealText from "@/components/RevealText";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function InstallPage() {
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPrompt(event as InstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const install = async () => {
    if (!prompt) return;
    await prompt.prompt();
    await prompt.userChoice;
    setPrompt(null);
  };

  return (
    <section className="install-page page-section">
      <RevealText>
        <p className="eyebrow">SY / Mobile archive</p>
        <h1>Keep the<br /><em>archive</em><br />close.</h1>
        <p className="install-intro">Add SY Archive to your home screen for a focused, full-screen viewing experience.</p>
      </RevealText>
      {prompt && <button className="install-button" onClick={install}>Install SY Archive <span>↓</span></button>}
      <div className="install-grid">
        <RevealText>
          <span>01 / iPhone · Safari</span>
          <h2>Add to Home Screen</h2>
          <p>Open the Share menu in Safari, scroll down, then choose “Add to Home Screen.”</p>
        </RevealText>
        <RevealText delay={0.08}>
          <span>02 / Android · Chrome</span>
          <h2>Install App</h2>
          <p>Open the Chrome menu and tap “Install app” or use the install button when it appears above.</p>
        </RevealText>
      </div>
    </section>
  );
}
