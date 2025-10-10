function getTextEditor() {
    return foundry.applications.ux.TextEditor.implementation;
}

function createPanicEffect(actor, duration) {
	const effectData = {
		name: game.i18n.localize("CoriolisReloaded.Effect.panic"),
		label: game.i18n.localize("CoriolisReloaded.Effect.panic"),
		img: "modules/coriolis-reloaded/icons/panic.png",
		origin: actor.uuid,
		disabled: false,
		duration: {
		  rounds: duration
		},
		changes: [],
		flags: {
		  core: {
		    statusId: "panic",
		    description: game.i18n.localize("CoriolisReloaded.Effect.panicDescription")
		  },
		  "coriolis-reloaded": {
		    isPanicEffect: true
		  }
		},
		statuses: ["panic"]
	};
	return effectData;
}

function createBrokenEffect(actor) {
	const effectData = {
		name: game.i18n.localize("CoriolisReloaded.Effect.broken"),
		label: game.i18n.localize("CoriolisReloaded.Effect.broken"),
		img: "modules/coriolis-reloaded/icons/broken.png",
		origin: actor.uuid,
		disabled: false,
		duration: {
		},
		changes: [],
		flags: {
		  core: {
		    statusId: "broken",
		    description: game.i18n.localize("CoriolisReloaded.Effect.brokenDescription")
		  },
		  "coriolis-reloaded": {
		    isBrokenEffect: true
		  }
		},
		statuses: ["broken"]
	};
	console.log(effectData);
	return effectData;
}

function createSuppressedEffect(actor) {
  const effectData = {
    name: game.i18n.localize("CoriolisReloaded.Effect.suppressed"),
    label: game.i18n.localize("CoriolisReloaded.Effect.suppressed"),
    img: "modules/coriolis-reloaded/icons/suppressed.png",
    origin: actor.uuid,
    disabled: false,
    duration: {
      rounds: 1
    },
    changes: [],
    flags: {
      core: {
        statusId: "suppressed",
        description: game.i18n.localize("CoriolisReloaded.Effect.suppressedDescription")
      },
      "coriolis-reloaded": {
        isSuppressedEffect: true
      }
    },
    statuses: ["suppressed"]
  };

  return effectData;
}

function createPinnedEffect(actor) {
  const effectData = {
    name: game.i18n.localize("CoriolisReloaded.Effect.pinned"),
    label: game.i18n.localize("CoriolisReloaded.Effect.pinned"),
    img: "modules/coriolis-reloaded/icons/pinned.png",
    origin: actor.uuid,
    disabled: false,
    duration: {
      rounds: 1
    },
    changes: [],
    flags: {
      core: {
        statusId: "pinned",
        description: game.i18n.localize("CoriolisReloaded.Effect.pinnedDescription")
      },
      "coriolis-reloaded": {
        isPinnedEffect: true
      }
    },
    statuses: ["pinned"]
  };

  return effectData;
}

async function rollStress(actor, stressValue, modifier) {
    const formula = `1d6 + ${stressValue + modifier}`;
    const roll = await new Roll(formula).evaluate({ async: true });
    let total = roll.total;

    let flavorText = "";
    if (total <= 2) {
        flavorText = game.i18n.localize("CoriolisReloaded.StressRoll.result_none");
    } else if (total >= 3 && total <= 5) {
        flavorText = game.i18n.localize("CoriolisReloaded.StressRoll.result_1stress");
    } else if (total >= 6 && total <= 8) {
        flavorText = game.i18n.localize("CoriolisReloaded.StressRoll.result_suppressed");
        const hasSuppressed = actor.effects.some(e => e.getFlag("coriolis-reloaded", "isSuppressedEffect") === true);
        if (!hasSuppressed) {
            const suppressedEffect = createSuppressedEffect(actor);
            await actor.createEmbeddedDocuments("ActiveEffect", [suppressedEffect]);
            ui.notifications.info(game.i18n.format("CoriolisReloaded.Effect.suppressedUiMessage", { name: actor.name }));
        }
    } else if (total >= 9) {
        flavorText = game.i18n.localize("CoriolisReloaded.StressRoll.result_pinned");
        const hasPinned = actor.effects.some(e => e.getFlag("coriolis-reloaded", "isPinnedEffect") === true);
        if (!hasPinned) {
            const pinnedEffect = createPinnedEffect(actor);
            await actor.createEmbeddedDocuments("ActiveEffect", [pinnedEffect]);
            ui.notifications.info(game.i18n.format("CoriolisReloaded.Effect.pinnedUiMessage", { name: actor.name }));
        }
    }

    const title = game.i18n.localize("CoriolisReloaded.StressRoll.title");
    const content = `<h2>${title}</h2><p>${flavorText}</p>`;

    await roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor }),
        flavor: content
    });
}

Hooks.on("renderActorSheet", async (app, html, data) => {
	const actor = app.actor;
	if (!["character", "npc"].includes(actor?.type)) return;

	// === STRESS-BAR ===
	const stress = foundry.utils.getProperty(actor.system, "custom.stress") ?? 0;
	const stressMax = 10;

	const title = game.i18n.localize("CoriolisReloaded.StressRoll.title");
	const stressString = game.i18n.localize("CoriolisReloaded.stress");

	let stressHTML = `<li class="entry flexrow">
		<div class="stat-label stress-label" id="stress-label" title="${title}">${stressString} <i class="fas fa-dice"></i></div>
		<div class="bar stress-bar fr-basic" data-current="${stress}" data-min="0" data-max="${stressMax}">`;

	for (let i = 1; i <= stressMax; i++) {
		let stateClass = i <= stress ? "on" : "off";
		stressHTML += `
		<div class="bar-segment bar-rounded ${stateClass}"
		data-name="system.custom.stress"
		data-index="${i}"
		data-current="${stress}"
		data-min="0"
		data-max="${stressMax}">
		</div>`;
	}
	stressHTML += `<span class="bar-value">${stress}</span></div></li>`;

	const statList = html.find(".perma-stats-list");
	if (statList.length) {
		statList.append($(stressHTML));
	}

	// === SHOW ACTIVE EFFECTS ===
	const effects = actor.effects.filter(e => !e.disabled);
	let effectListHTML = `<ul class="active-effects-list"><li class="effects-header"><h4>${game.i18n.localize("CoriolisReloaded.Effect.activeEffects")}</h4></li>`;

	for (const effect of effects) {
		const rawDescription = effect.flags?.core?.description ?? "";
		const formattedDescription = rawDescription.replace(/\n/g, "<br>");
		const editor = getTextEditor();
		const description = await editor.enrichHTML(formattedDescription, { async: false });
		const hasDescription = description.length > 0;

		effectListHTML += `
			<li class="effects-effect" title="${effect.name}" style="display: flex; align-items: center; gap: 0.5em; cursor: pointer;" data-effect-id="${effect.id}">
			<img src="${effect.img}" alt="${effect.name}" style="width: 24px; height: 24px; border-radius: 4px;" />
			<span>${effect.name}</span>
			</li>
			<li class="effect-description-row" style="display: none; padding-left: 2.5em; font-size: 0.9em; color: #bbb;" data-effect-id="${effect.id}">
			${hasDescription ? description : ""}
			</li>`;
	}

	effectListHTML += `</ul>`;

	const woundsElement = html.find(".critical-injuries-list");
	if (woundsElement.length) {
		woundsElement.after(effectListHTML);

		// Right click the effect to delete
		html.find(".active-effects-list .effects-effect[data-effect-id]").on("contextmenu", async (event) => {
			event.preventDefault();
			const effectId = event.currentTarget.dataset.effectId;
			if (!effectId) return;

			try {
				await actor.deleteEmbeddedDocuments("ActiveEffect", [effectId]);
				ui.notifications.info(`Effekt wurde entfernt.`);
				// Re-render sheet to show the changes
				app.render();
			} catch (err) {
				console.error("Failed to delete effect", err);
				ui.notifications.error("Error while removing the effect.");
			}
		});
	}

	// Event-Listener: Show effect description
	html.find(".effects-effect").on("click", function () {
		const effectId = $(this).data("effect-id");
		const descriptionRow = html.find(`.effect-description-row[data-effect-id="${effectId}"]`);
		descriptionRow.slideToggle(150);
	});


	// === EVENT-LISTENER FOR STRESS-BAR ===
	// Click on bar segments to change the value
	html.find('.bar-segment[data-name="system.custom.stress"]').on("click", async function (event) {
		event.preventDefault();

		const index = Number(this.dataset.index);
		const current = Number(this.dataset.current);
		if (isNaN(index) || isNaN(current)) return;

		let newValue = (index === current) ? current - 1 : index;
		if (current > 0 && index == 1) {
			newValue = 0;
		}

		if (newValue > current) {
			let newMindPoints = foundry.utils.getProperty(actor.system, "mindPoints.value") - (newValue - current);
			if (newMindPoints < 0) newMindPoints = 0;
			await actor.update({ "system.custom.stress": newValue, "system.mindPoints.value": newMindPoints });
		} else {
			await actor.update({ "system.custom.stress": newValue });
		}
	});

	// Click event for the ddice button (suppression)
	html.find("#stress-label").on("click", async () => {
	    const stressValue = foundry.utils.getProperty(actor.system, "custom.stress") ?? 0;

	    // Array with modifiers
	    const modifiers = [-4, -3, -2, -1, 0, 1, 2, 3, 4];

	    // Create buttons
	    const buttons = {};
	    for (let mod of modifiers) {
	        const label = mod > 0 ? `+${mod}` : `${mod}`;
	        buttons[`mod${mod}`] = {
	            label: label,
	            callback: async () => await rollStress(actor, stressValue, mod)
	        };
	    }

	    new Dialog({
	        title: game.i18n.localize("CoriolisReloaded.StressRoll.title"),
	        content: `<p>${game.i18n.localize("CoriolisReloaded.StressRoll.selectModifier")}</p>`,
	        buttons: buttons,
	        default: "mod0"
	    }).render(true);
	});

	// Hover-Effect for stress bar elements
	html.find('.stress-bar .bar-segment').hover(
		function () {
			const hoveredIndex = Number(this.dataset.index);
			const currentValue = Number(this.dataset.current);
			const segments = $(this).parent().find('.bar-segment');

			segments.each(function () {
				const segIndex = Number(this.dataset.index);
				if (hoveredIndex > currentValue && segIndex > currentValue && segIndex <= hoveredIndex) {
					$(this).addClass('hover-to-increase');
				}
				if (hoveredIndex <= currentValue && segIndex <= currentValue && segIndex >= hoveredIndex) {
					$(this).addClass('hover-to-decrease');
				}
			});
		},
		function () {
			$(this).parent().find('.bar-segment').removeClass('hover-to-increase hover-to-decrease');
		}
	);

	// UI-Height setting
	app.setPosition({ height: 940 });
});

// Update Actor Hook (stress bar, MindPoints, suppression roll)
Hooks.on("updateActor", async (actor, updates, options, userId) => {
	if (!["character", "npc"].includes(actor?.type)) return;

	// Only GM should execute this code to prevent it from being executed multiple times
	if (!game.user.isGM) return;

	// MIND POINTS 0 -> PANIC
	const newMindPoints = foundry.utils.getProperty(updates, "system.mindPoints.value");

	if (newMindPoints === 0) {
		const hasPanic = actor.effects.some(e => e.getFlag("coriolis-reloaded", "isPanicEffect") === true);
		if (!hasPanic) {
			ChatMessage.create({
				content: game.i18n.format("CoriolisReloaded.Effect.panicApplied", { name: actor.name }),
				speaker: ChatMessage.getSpeaker({ actor }),
				whisper: []
			});

			const roll = await new Roll("1d6").evaluate({ async: true });

			// Whisper result to active GMs
			const gmUsers = game.users.filter(u => u.isGM && u.active);
			await ChatMessage.create({
				content: `<h3>${game.i18n.localize("CoriolisReloaded.Effect.panicRoll")}</h3><p>${game.i18n.localize("CoriolisReloaded.Effect.panicDuration")} <strong>${roll.total}</strong> ${game.i18n.localize("CoriolisReloaded.Effect.panicUnit")}</p>`,
				speaker: ChatMessage.getSpeaker({ actor }),
				whisper: gmUsers.map(u => u.id),
				blind: false
			});

			// Add effect
			const panicEffect = createPanicEffect(actor, roll.total);
			await actor.createEmbeddedDocuments("ActiveEffect", [panicEffect]);
		}
	}

	if (newMindPoints > 0) {
		const effectsToRemove = actor.effects.filter(e => e.getFlag("coriolis-reloaded", "isPanicEffect"));
		for (const effect of effectsToRemove) {
			await effect.delete();
		}
	}

	// HITPOINTS 0 -> BROKEN
	const newHitPoints = foundry.utils.getProperty(updates, "system.hitPoints.value");
	if (newHitPoints === 0) {
		const hasBroken = actor.effects.some(e => e.getFlag("coriolis-reloaded", "isBrokenEffect") === true);
		if (!hasBroken) {
			ChatMessage.create({
				content: game.i18n.format("CoriolisReloaded.Effect.brokenApplied", { name: actor.name }),
				speaker: ChatMessage.getSpeaker({ actor }),
				whisper: []
			});

			// Add effect
			const brokenEffect = createBrokenEffect(actor);
			await actor.createEmbeddedDocuments("ActiveEffect", [brokenEffect]);
		}
	}

	if (newHitPoints > 0) {
		const effectsToRemove = actor.effects.filter(e => e.getFlag("coriolis-reloaded", "isBrokenEffect"));
		for (const effect of effectsToRemove) {
			await effect.delete();
		}
	}
});

