const MODULE_ID = "coriolis-reloaded";

Hooks.once("init", () => {
  // Setting: Activate/Deactivate module
  game.settings.register(MODULE_ID, "replacexpbarenabled", {
    name: game.i18n.localize(`CoriolisReloaded.replacexpbar.settings.enabled.name`),
    hint: game.i18n.localize(`CoriolisReloaded.replacexpbar.settings.enabled.hint`),
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });
});

Hooks.on("renderActorSheet", (app, html) => {
  const actor = app.actor;
  if (!actor) return;

  // 🔎 XP-Wert (ggf. Pfad anpassen!)
  const xpPath = "system.experience.value";
  const xpValue = actor.system.experience?.value;
  if (xpValue === undefined) return;

  // 🔎 XP-Balken finden
  const xpBar = html.find(".xp-bar"); // ggf. Selector anpassen
  if (!xpBar.length) return;
  const xpContainer = xpBar.closest("li.entry");
  if (!xpContainer.length) return;

  // 🧹 Alten Balken entfernen
  //xpBar.remove();

  // ➕ Input erzeugen
  const xpInput = $(`
    <div class="number" style="display:inline-flex; padding-inline:2em;">
      <input
        class="input-value"
        type="text"
        name="${xpPath}"
        value="${xpValue}"
        data-dtype="Number"
        placeholder="0">
    </div>
  `);
  xpBar.replaceWith(xpInput);
});