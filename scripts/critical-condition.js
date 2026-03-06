const MODULE_NAME = "coriolis-reloaded";

Hooks.once("init", () => {

	game.settings.registerMenu(MODULE_NAME, "criticalSettings", {
		name: game.i18n.localize(`CoriolisReloaded.criticalcondition.settings.submodulename`),
		label: game.i18n.localize(`CoriolisReloaded.criticalcondition.settings.settings`),
		hint: game.i18n.localize(`CoriolisReloaded.criticalcondition.settings.submodulehint`),
		icon: "fas fa-cog",
		type: CoriolisReloadedSettingsForm,
		restricted: true
	});

	game.settings.register("coriolis-reloaded", "criticalconditionenabled", {
		scope: "world",
		config: false,
		type: Boolean,
		default: false
	});

	// Explosion
	game.settings.register("coriolis-reloaded", "tableIDexploBody", {
		scope: "world",
		config: false,
		type: String
	});

	game.settings.register("coriolis-reloaded", "tableIDexploHead", {
		scope: "world",
		config: false,
		type: String
	});

	game.settings.register("coriolis-reloaded", "tableIDexploArms", {
		scope: "world",
		config: false,
		type: String
	});

	game.settings.register("coriolis-reloaded", "tableIDexploLegs", {
		scope: "world",
		config: false,
		type: String
	});

	// Impact
	game.settings.register("coriolis-reloaded", "tableIDImpBody", {
		scope: "world",
		config: false,
		type: String
	});

	game.settings.register("coriolis-reloaded", "tableIDImpHead", {
		scope: "world",
		config: false,
		type: String
	});

	game.settings.register("coriolis-reloaded", "tableIDImpArms", {
		scope: "world",
		config: false,
		type: String
	});

	game.settings.register("coriolis-reloaded", "tableIDImpLegs", {
		scope: "world",
		config: false,
		type: String
	});

	// Thermal
	game.settings.register("coriolis-reloaded", "tableIDThermBody", {
		scope: "world",
		config: false,
		type: String
	});

	game.settings.register("coriolis-reloaded", "tableIDThermHead", {
		scope: "world",
		config: false,
		type: String
	});

	game.settings.register("coriolis-reloaded", "tableIDThermArms", {
		scope: "world",
		config: false,
		type: String
	});

	game.settings.register("coriolis-reloaded", "tableIDThermLegs", {
		scope: "world",
		config: false,
		type: String
	});

	// Rending
	game.settings.register("coriolis-reloaded", "tableIDRendBody", {
		scope: "world",
		config: false,
		type: String
	});

	game.settings.register("coriolis-reloaded", "tableIDRendHead", {
		scope: "world",
		config: false,
		type: String
	});

	game.settings.register("coriolis-reloaded", "tableIDRendArms", {
		scope: "world",
		config: false,
		type: String
	});

	game.settings.register("coriolis-reloaded", "tableIDRendLegs", {
		scope: "world",
		config: false,
		type: String
	});

	game.settings.register("coriolis-reloaded", "nameExplosion", {
		scope: "world",
		config: false,
		type: String
	});

	game.settings.register("coriolis-reloaded", "nameImpact", {
		scope: "world",
		config: false,
		type: String
	});

	game.settings.register("coriolis-reloaded", "nameThermal", {
		scope: "world",
		config: false,
		type: String
	});

	game.settings.register("coriolis-reloaded", "nameRending", {
		scope: "world",
		config: false,
		type: String
	});
});

Hooks.on("renderApplication", (app, html) => {
    const enabled = game.settings.get(MODULE_NAME, "criticalconditionenabled");
    if (!enabled) return;
    if (app.id !== "coriolisModifierDialog") return;
    if (app.rollData?.rollType != 'weapon') return;

    const hitZones = {
        
        "pz_hk|pseudo_hitzone": {name: game.i18n.localize(`CoriolisReloaded.criticalcondition.settings.head`), value: -5},
        "pz_ar|pseudo_hitzone": {name: game.i18n.localize(`CoriolisReloaded.criticalcondition.settings.arms`), value: -3},
        "pz_be|pseudo_hitzone": {name: game.i18n.localize(`CoriolisReloaded.criticalcondition.settings.legs`), value: -3}
    };

    for (let [key, data] of Object.entries(hitZones)) {
        if (!app.itemModifiers[key]) {
            app.itemModifiers[key] = {
                id: key,
                name: `${game.i18n.localize('CoriolisReloaded.criticalcondition.settings.hitzone')}: ${data.name}`,
                attribute: null,
                skill: data.skill,
                type: "hitZone", 
                value: data.value,
                checked: key === "pz_koerper|pseudo_hitzone",
                prayer: false
            };
        }
    }

    Object.keys(hitZones).forEach(k => {
        const input = html.find(`input[name="${k}"]`);
        const label = input.next("label");
        const br = label.next("br");
        input.add(label).add(br).remove();
    });

    const rollSelectDiv = html.find("#dialogRollModeId").parent(); 
    if (rollSelectDiv.length && !html.find("#trefferzoneSelect").length) {
        const activeKey = Object.keys(hitZones).find(k => app.itemModifiers[k]?.checked) || "pz_koerper|pseudo_hitzone";

        const selectHtml = $(`
            <div style="padding: 0.5em 1em;">
                <h3>${game.i18n.localize(`CoriolisReloaded.criticalcondition.settings.hitzoneselect`)}</h3>
                <select id="trefferzoneSelect" style="margin-left: 0.5em;">
                    <option value="pz_koerper|pseudo_hitzone">${game.i18n.localize(`CoriolisReloaded.criticalcondition.settings.body`)}</option>
                    <option value="pz_hk|pseudo_hitzone">${game.i18n.localize(`CoriolisReloaded.criticalcondition.settings.head`)}</option>
                    <option value="pz_ar|pseudo_hitzone">${game.i18n.localize(`CoriolisReloaded.criticalcondition.settings.arms`)}</option>
                    <option value="pz_be|pseudo_hitzone">${game.i18n.localize(`CoriolisReloaded.criticalcondition.settings.legs`)}</option>
                </select>
            </div>
        `);
        rollSelectDiv.after(selectHtml);

        const drop = html.find("#trefferzoneSelect");
        drop.val(activeKey);
        drop.on("change", event => {
            const selectedKey = event.target.value;
            Object.keys(hitZones).forEach(k => {
                if (app.itemModifiers[k]) app.itemModifiers[k].checked = false;
            });
            if (app.itemModifiers[selectedKey]) app.itemModifiers[selectedKey].checked = true;
            drop.val(selectedKey);
        });
    }

    const realModifiersExist = Object.values(app.itemModifiers).some(m => m.type !== "hitZone");
    html.find("div").filter(function() {
        return $(this).children("h3").first().text().trim() === game.i18n.localize(`YZECORIOLIS.ItemModifierRollQuestion`);
    }).toggle(realModifiersExist);
    app.setPosition();
});

Hooks.on("renderChatMessageHTML", (message, html) => appendCriticalButton(message, html));
Hooks.on("updateChatMessage", (message, diff, options, userId) => {
    const html = document.getElementById(`chat-message-${message.id}`);
    if (html) appendCriticalButton(message, html);
});

function appendCriticalButton(message, html) {
	const enabled = game.settings.get("coriolis-reloaded", "criticalconditionenabled");
    if (!enabled) return;
    const results = message.flags?.yzecoriolis?.results;
    if (!results) return;

    if (message?.flags?.data) {
        if (message?.flags?.data?.results?.successes < 1) return;
    } else {
        if (message.flags?.yzecoriolis?.results?.successes < 1) return;    
    }

    const content = html.querySelector(".message-content");
    if (!content) return;

    const modifiers = results.rollData?.itemModifiers;
    if (!modifiers) return;

    let zone = "Body";

    for (const key in modifiers) {
        const mod = modifiers[key];
        if (!mod.checked) continue;

        if (mod.id.startsWith("pz_hk")) zone = "Head";
        else if (mod.id.startsWith("pz_ar")) zone = "Arms";
        else if (mod.id.startsWith("pz_be")) zone = "Legs";
    }

    const damageText = results.rollData?.damageText;
    if (!damageText) return;

    let damageType = null;

	const chatDamageTypes = damageText.split('|');
	for (const dText of chatDamageTypes) {
		if (dText.includes(game.settings.get("coriolis-reloaded", "nameImpact"))) damageType = "Imp";
		else if (dText.includes(game.settings.get("coriolis-reloaded", "nameExplosion"))) damageType = "explo";
		else if (dText.includes(game.settings.get("coriolis-reloaded", "nameThermal"))) damageType = "Therm";
		else if (dText.includes(game.settings.get("coriolis-reloaded", "nameRending"))) damageType = "Rend";

		if (!damageType) return;

		const settingKey = `tableID${damageType}${zone}`;
		const tableId = game.settings.get("coriolis-reloaded", settingKey);
		if (!tableId) return;

		if (content.querySelector(`.roll-critical-button-${damageType}`)) return;

		const wrapper = document.createElement("div");
		wrapper.style.marginTop = "8px";

		const button = document.createElement("button");
		button.classList.add(`roll-critical-button-${damageType}`);
		
		button.textContent = `${game.i18n.localize("CoriolisReloaded.criticalcondition.rollcritical")} (${getDamageString(damageType)})`;

		wrapper.appendChild(button);
		content.appendChild(wrapper);

		button.addEventListener("click", () => openCriticalDialog(tableId));
	}
}

function getDamageString(dType) {
	if (dType == 'Imp') {
		return game.i18n.localize("CoriolisReloaded.criticalcondition.settings.impactdamage");
	}

	if (dType == 'explo') {
		return game.i18n.localize("CoriolisReloaded.criticalcondition.settings.explosiondamage");
	}

	if (dType == 'Therm') {
		return game.i18n.localize("CoriolisReloaded.criticalcondition.settings.thermaldamage");
	}

	if (dType == 'Rend') {
		return game.i18n.localize("CoriolisReloaded.criticalcondition.settings.rendingdamage");
	}

	return "N/A";
}

function openCriticalDialog(tableId) {

    const buttons = {
        one: { label: "1", callback: () => rollCritical(tableId, 1) },
        two: { label: "2", callback: () => rollCritical(tableId, 2) },
        three: { label: "3", callback: () => rollCritical(tableId, 3) },
        four: { label: "4", callback: () => rollCritical(tableId, 4) },
        five: { label: "5", callback: () => rollCritical(tableId, 5) },
        six: { label: "6+", callback: () => rollCritical(tableId, 6) }
    };

    new Dialog({
        title: game.i18n.localize("CoriolisReloaded.criticalcondition.rollcritical"),
        content: `<p>${game.i18n.localize("CoriolisReloaded.criticalcondition.selectdamage")}</p>`,
        buttons
    }).render(true);
}

async function rollCritical(tableId, value) {

	tableId = tableId.replace('RollTable.', '');
    const table = game.tables.get(tableId);

    if (!table) {
        ui.notifications.error("Table for critical hits not found");
        return;
    }

    const roll = new Roll(`${value}`);
    await roll.evaluate({async: true});

    await table.draw({
        roll,
        displayChat: true
    });
}

class CoriolisReloadedSettingsForm extends FormApplication {

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "coriolis-reloaded-settings",
      title: game.i18n.localize(`CoriolisReloaded.criticalcondition.settings.submodulename`) + " - " + game.i18n.localize(`CoriolisReloaded.criticalcondition.settings.settings`),
      template: "modules/coriolis-reloaded/templates/critical-settings.html",
      width: 600,
      height: 800,
      closeOnSubmit: true
    });
  }

  async getData() {
    return {
    	criticalconditionenabled: game.settings.get(MODULE_NAME, "criticalconditionenabled"),
    	tableIDexploBody: game.settings.get(MODULE_NAME, "tableIDexploBody"),
    	tableIDexploHead: game.settings.get(MODULE_NAME, "tableIDexploHead"),
    	tableIDexploArms: game.settings.get(MODULE_NAME, "tableIDexploArms"),
    	tableIDexploLegs: game.settings.get(MODULE_NAME, "tableIDexploLegs"),
    	tableIDImpBody: game.settings.get(MODULE_NAME, "tableIDImpBody"),
    	tableIDImpHead: game.settings.get(MODULE_NAME, "tableIDImpHead"),
    	tableIDImpArms: game.settings.get(MODULE_NAME, "tableIDImpArms"),
    	tableIDImpLegs: game.settings.get(MODULE_NAME, "tableIDImpLegs"),
    	tableIDThermBody: game.settings.get(MODULE_NAME, "tableIDThermBody"),
    	tableIDThermHead: game.settings.get(MODULE_NAME, "tableIDThermHead"),
    	tableIDThermArms: game.settings.get(MODULE_NAME, "tableIDThermArms"),
    	tableIDThermLegs: game.settings.get(MODULE_NAME, "tableIDThermLegs"),
    	tableIDRendBody: game.settings.get(MODULE_NAME, "tableIDRendBody"),
    	tableIDRendHead: game.settings.get(MODULE_NAME, "tableIDRendHead"),
    	tableIDRendArms: game.settings.get(MODULE_NAME, "tableIDRendArms"),
    	tableIDRendLegs: game.settings.get(MODULE_NAME, "tableIDRendLegs"),
    	nameExplosion: game.settings.get(MODULE_NAME, "nameExplosion"),
    	nameImpact: game.settings.get(MODULE_NAME, "nameImpact"),
    	nameThermal: game.settings.get(MODULE_NAME, "nameThermal"),
    	nameRending: game.settings.get(MODULE_NAME, "nameRending")
    };
  }

  async _updateObject(event, formData) {
  	await game.settings.set(MODULE_NAME, "criticalconditionenabled", formData.criticalconditionenabled);
    await game.settings.set(MODULE_NAME, "tableIDexploBody", formData.tableIDexploBody);
   	await game.settings.set(MODULE_NAME, "tableIDexploHead", formData.tableIDexploHead);
   	await game.settings.set(MODULE_NAME, "tableIDexploArms", formData.tableIDexploArms);
   	await game.settings.set(MODULE_NAME, "tableIDexploLegs", formData.tableIDexploLegs);
   	await game.settings.set(MODULE_NAME, "tableIDImpBody", formData.tableIDImpBody);
   	await game.settings.set(MODULE_NAME, "tableIDImpHead", formData.tableIDImpHead);
   	await game.settings.set(MODULE_NAME, "tableIDImpArms", formData.tableIDImpArms);
   	await game.settings.set(MODULE_NAME, "tableIDImpLegs", formData.tableIDImpLegs);
   	await game.settings.set(MODULE_NAME, "tableIDThermBody", formData.tableIDThermBody);
   	await game.settings.set(MODULE_NAME, "tableIDThermHead", formData.tableIDThermHead);
   	await game.settings.set(MODULE_NAME, "tableIDThermArms", formData.tableIDThermArms);
   	await game.settings.set(MODULE_NAME, "tableIDThermLegs", formData.tableIDThermLegs);
   	await game.settings.set(MODULE_NAME, "tableIDRendBody", formData.tableIDRendBody);
   	await game.settings.set(MODULE_NAME, "tableIDRendHead", formData.tableIDRendHead);
   	await game.settings.set(MODULE_NAME, "tableIDRendArms", formData.tableIDRendArms);
   	await game.settings.set(MODULE_NAME, "tableIDRendLegs", formData.tableIDRendLegs);
   	await game.settings.set(MODULE_NAME, "nameExplosion", formData.nameExplosion);
   	await game.settings.set(MODULE_NAME, "nameImpact", formData.nameImpact);
   	await game.settings.set(MODULE_NAME, "nameThermal", formData.nameThermal);
   	await game.settings.set(MODULE_NAME, "nameRending", formData.nameRending);
  }
}