const MODULE_ID = "coriolis-reloaded";

Hooks.once("init", () => {
  // Register module settings
  game.settings.register(MODULE_ID, "blastDamageEnabled", {
    name: game.i18n.localize(`CoriolisReloaded.blastDamage.settings.enabled.name`),
    hint: game.i18n.localize(`CoriolisReloaded.blastDamage.settings.enabled.hint`),
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });
});

// Hook for initial message
Hooks.on("renderChatMessageHTML", (message, html) => editBlastDamage(message, html));

// Hook for rerolls
Hooks.on("updateChatMessage", (message, diff, options, userId) => {
    const html = document.getElementById(`chat-message-${message.id}`);
    if (html) editBlastDamage(message, html);
});

function editBlastDamage(message, html) {
  try {
  	const enabled = game.settings.get(MODULE_ID, "blastDamageEnabled");
    if (!enabled) return;
    
    if (message?.flags?.yzecoriolis?.results?.rollData?.rollType !== "weapon") return;
    if (!message.flags.yzecoriolis.results.rollData.isExplosive) return;

    console.log(message);
    const content = "Test";

    const details = document.createElement("details");
    details.classList.add("test-section");

    const div = document.createElement("div");
    div.innerHTML = content;
    details.appendChild(div);

    const msgContent = html.querySelector(".message-content");
    if (msgContent) msgContent.appendChild(details);

  } catch (err) {
    console.error(`${MODULE_ID} | Error attaching the journal page:`, err);
  }
}