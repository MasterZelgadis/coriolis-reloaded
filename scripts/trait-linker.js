const MODULE_ID = "coriolis-reloaded";

Hooks.once("init", () => {
  // Setting: Activate/Deactivate module
  game.settings.register(MODULE_ID, "traitlinkerenabled", {
    name: game.i18n.localize(`CoriolisReloaded.traitlinker.settings.enabled.name`),
    hint: game.i18n.localize(`CoriolisReloaded.traitlinker.settings.enabled.hint`),
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  // Setting: Journal-UUID
  game.settings.register(MODULE_ID, "traitJournalUuid", {
    name: game.i18n.localize(`CoriolisReloaded.traitlinker.settings.traitJournalUUID.name`),
    hint: game.i18n.localize(`CoriolisReloaded.traitlinker.settings.traitJournalUUID.hint`),
    scope: "world",
    config: true,
    type: String,
    default: ""
  });
});

Hooks.on("preCreateChatMessage", async (message) => {
  try {
    if (!game.settings.get(MODULE_ID, "traitlinkerenabled")) return;
    if (message.title != "weapon") return;
    let content = message.content;
    if (!content) return;

    const journalUuid = game.settings.get(MODULE_ID, "traitJournalUuid");
    if (!journalUuid) return;

    const journal = await fromUuid(journalUuid);
    if (!journal) {
      console.warn("Journal not found for UUID:", journalUuid);
      return;
    }

    const candidates = journal.pages.contents.map(page => ({
      name: page.name,
      uuid: page.uuid
    }));

    for (const { name, uuid } of candidates) {
      // Trait name in the beginning of the string + number in the end
      const regex = new RegExp(`\\b(${escapeRegExp(name)})(\\s\\d+)?\\b`, "g");
      content = content.replace(regex, (_, baseName, value) => {
        const display = baseName + (value || "");
        return `@UUID[${uuid}]{${display}}`;
      });
    }

    message.updateSource({ content });
  } catch (err) {
    console.error("Error linking the trait", err);
  }
});

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}