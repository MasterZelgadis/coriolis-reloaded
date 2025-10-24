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

  // Setting: Journal-UUID (Weapons)
  game.settings.register(MODULE_ID, "traitJournalUuid", {
    name: game.i18n.localize(`CoriolisReloaded.traitlinker.settings.traitJournalUUID.name`),
    hint: game.i18n.localize(`CoriolisReloaded.traitlinker.settings.traitJournalUUID.hint`),
    scope: "world",
    config: true,
    type: String,
    default: ""
  });

  // Setting: Journal-UUID (Armor)
  game.settings.register(MODULE_ID, "traitJournalUuidArmors", {
    name: game.i18n.localize(`CoriolisReloaded.traitlinker.settings.traitJournalUUIDArmors.name`),
    hint: game.i18n.localize(`CoriolisReloaded.traitlinker.settings.traitJournalUUIDArmors.hint`),
    scope: "world",
    config: true,
    type: String,
    default: ""
  });
});

// --- CHAT MESSAGE LINKING ---
Hooks.on("preCreateChatMessage", async (message) => {
  if (!game.settings.get(MODULE_ID, "traitlinkerenabled")) return;
  if (message.title !== "weapon") return;
  let content = message.content;
  if (!content) return;

  const candidates = await getTraitCandidates();
  for (const { name, uuid, regex } of candidates) {
    content = content.replace(regex, (_, baseName, value) => {
      const display = baseName + (value || "");
      return `@UUID[${uuid}]{${display}}`;
    });
  }
  message.updateSource({ content });
});

// --- CHARACTER SHEET TOOLTIP ---
Hooks.on("renderActorSheet", async (app, html, data) => {
  if (!game.settings.get(MODULE_ID, "traitlinkerenabled")) return;
  
  await processCategory(html, "YZECORIOLIS.Weapons", "traitJournalUuid");
  await processCategory(html, "YZECORIOLIS.Armor", "traitJournalUuidArmors");  

  // --- TOOLTIP EVENTS ---
  html.find(".trait-tooltip").hover(
    function (event) {
      const content = decodeURIComponent($(this).attr("data-html"));
      let tooltip = $(".custom-tooltip");
      if (!tooltip.length) {
        tooltip = $('<div class="custom-tooltip"></div>').appendTo("body");
      }
      tooltip.empty().append($(content));

      // Calculate Tooltip-Position
      const offset = $(this).offset();
      const tooltipWidth = tooltip.outerWidth();
      const tooltipHeight = tooltip.outerHeight();
      const windowWidth = $(window).width();
      const windowHeight = $(window).height();

      let top = offset.top + $(this).outerHeight() + 5;
      let left = offset.left;

      if (left + tooltipWidth > windowWidth - 20) {
        left = windowWidth - tooltipWidth - 20;
      }
      if (top + tooltipHeight > windowHeight - 20) {
        top = offset.top - tooltipHeight - 5;
      }

      tooltip.css({ top, left, display: "block", opacity: 1 });
    },
    function () {
      $(".custom-tooltip").css({ display: "none", opacity: 0 });
    }
  );
});

// --- HELPERS ---
async function getTraitCandidates(journalString) {
  const journalUuid = game.settings.get(MODULE_ID, journalString);
  if (!journalUuid) return [];
  const journal = await fromUuid(journalUuid);
  if (!journal) return [];

  return journal.pages.contents.map(page => ({
    name: page.name,
    uuid: page.uuid,
    content: page.text?.content || "",
    regex: new RegExp(`\\b(${escapeRegExp(page.name)})(\\s\\d+)?\\b`, "g")
  }));
}

async function createTooltips(traitElements, candidates) {
  for (const el of traitElements) {
    let text = el.innerHTML;
    for (const { name, content, regex } of candidates) {
      text = text.replace(regex, (_, baseName, value) => {
        const display = baseName + (value || "");
        return `<span class="trait-tooltip" data-html="${encodeURIComponent(content)}">${display}</span>`;
      });
    }
    el.innerHTML = text;
  }
}

async function processCategory(html, categoryNameKey, traitJournalUuidKey) {
    const candidates = await getTraitCandidates(traitJournalUuidKey);
    const header = html
        .find(`.gear-category-name.first:contains('${game.i18n.localize(categoryNameKey)}')`)
        .closest(".gear-category-header");
    if (!header.length) return;
    const section = header.nextUntil(".gear-category-header");
    const traitElements = section.find(".item-properties");
    if (!traitElements.length) return;
    await createTooltips(traitElements, candidates);
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
