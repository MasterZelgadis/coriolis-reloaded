const MODULE_NAME = "coriolis-reloaded";

Hooks.once("init", () => {
  // Register module settings
  game.settings.register(MODULE_NAME, "additionaleffectsenabled", {
    name: game.i18n.localize(`CoriolisReloaded.additionaleffects.settings.enabled.name`),
    hint: game.i18n.localize(`CoriolisReloaded.additionaleffects.settings.enabled.hint`),
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(MODULE_NAME, "journalMeleeUUID", {
    name: game.i18n.localize(`CoriolisReloaded.additionaleffects.settings.meleeJournal.uuid`),
    hint: game.i18n.localize(`CoriolisReloaded.additionaleffects.settings.meleeJournal.hint`),
    scope: "world",
    config: true,
    type: String,
    default: ""
  });

  game.settings.register(MODULE_NAME, "journalRangedUUID", {
    name: game.i18n.localize(`CoriolisReloaded.additionaleffects.settings.rangedJournal.uuid`),
    hint: game.i18n.localize(`CoriolisReloaded.additionaleffects.settings.rangedJournal.hint`),
    scope: "world",
    config: true,
    type: String,
    default: ""
  });

  game.settings.register(MODULE_NAME, "journalGrenadeUUID", {
    name: game.i18n.localize(`CoriolisReloaded.additionaleffects.settings.grenadeJournal.uuid`),
    hint: game.i18n.localize(`CoriolisReloaded.additionaleffects.settings.grenadeJournal.hint`),
    scope: "world",
    config: true,
    type: String,
    default: ""
  });
});

function attachJournalContent(message, html) {
  try {
    
    /**
    * End execution if module is disabled, one of the journal entries is not set or there are no 
    * additional successes beyond the first one to spend
    */
    const enabled = game.settings.get(MODULE_NAME, "additionaleffectsenabled");
    if (!enabled) return;

    const uuidMelee = game.settings.get(MODULE_NAME, "journalMeleeUUID");
    const uuidRanged = game.settings.get(MODULE_NAME, "journalRangedUUID");
    const uuidGrenade = game.settings.get(MODULE_NAME, "journalGrenadeUUID");
    if (!uuidMelee || !uuidRanged || !uuidGrenade) return;

    if (!message?.flags?.yzecoriolis?.results) return;
    if (message?.flags?.yzecoriolis?.results?.rollData?.rollType !== "weapon") return;
    
    // Somehow successes after rerolls get another data path
    if (message?.flags?.data) {
        if (message?.flags?.data?.results.successes < 2) return;
    } else {
        if (message.flags.yzecoriolis.results.successes < 2) return;    
    }

    if (html.querySelector(".journal-expand-details")) return;

    // Get the correct journal page uuid for the attack type
    const skillKey = message.flags.yzecoriolis.results.rollData.skillKey;
    let uuid = "";
    switch (skillKey) {
      case "meleecombat":
        uuid = uuidMelee;
        break;
      case "rangedcombat":
        uuid = message.flags.yzecoriolis.results.rollData.isExplosive
          ? uuidGrenade
          : uuidRanged;
        break;
      default:
        return;
    }

    fromUuid(uuid).then(journalPage => {
      if (!journalPage) return;
      const content = journalPage.text.content || "";

      const details = document.createElement("details");
      details.classList.add("journal-expand-details");
      const summary = document.createElement("summary");
      summary.textContent = game.i18n.localize("CoriolisReloaded.additionaleffects.chatInfo");
      details.appendChild(summary);

      const div = document.createElement("div");
      div.innerHTML = content;
      details.appendChild(div);

      const msgContent = html.querySelector(".message-content");
      if (msgContent) msgContent.appendChild(details);
    });

  } catch (err) {
    console.error(`${MODULE_NAME} | Error attaching the journal page:`, err);
  }
}

// Hook for initial message
Hooks.on("renderChatMessageHTML", (message, html) => attachJournalContent(message, html));

// Hook for rerolls
Hooks.on("updateChatMessage", (message, diff, options, userId) => {
    const html = document.getElementById(`chat-message-${message.id}`);
    if (html) attachJournalContent(message, html);
});