import { useEffect } from "react";

export default function WCPChatbot() {
  useEffect(() => {
    // Prevent multiple injections
    if (document.getElementById("bp-webchat")) return;

    // Load main Botpress engine
    const bpScript = document.createElement("script");
    bpScript.id = "bp-webchat";
    bpScript.src = "https://cdn.botpress.cloud/webchat/v3.3/inject.js";
    bpScript.async = true;

    // Only load your bot script after bpScript finishes
    bpScript.onload = () => {
      const customScript = document.createElement("script");
      customScript.src =
        "https://files.bpcontent.cloud/2025/10/24/05/20251024055408-UQRL1J5D.js";
      customScript.defer = true;
      document.body.appendChild(customScript);
    };

    document.body.appendChild(bpScript);

    // Cleanup on unmount
    return () => {
      // Remove scripts
      const cs = document.querySelector(
        'script[src="https://files.bpcontent.cloud/2025/10/24/05/20251024055408-UQRL1J5D.js"]'
      );
      if (cs) cs.remove();
      bpScript.remove();

      // Remove Botpress DOM elements
      const webchatEl = document.querySelector("#bp-webchat-container");
      if (webchatEl) webchatEl.remove();
    };
  });

  return null; // Bot renders itself
}
