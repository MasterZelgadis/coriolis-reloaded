![GitHub release (latest by date)](https://img.shields.io/github/v/release/MasterZelgadis/coriolis-reloaded?style=for-the-badge)
![Foundry Core Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https://github.com/MasterZelgadis/coriolis-reloaded/releases/latest/download/module.json&label=Foundry%20Version&query=$.compatibility.verified&colorB=green&style=for-the-badge)

![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https://forge-vtt.com/api/bazaar/package/coriolis-reloaded&colorB=green&style=for-the-badge)
  
![GitHub release (latest)](https://img.shields.io/github/downloads/MasterZelgadis/coriolis-reloaded/latest/module.zip?style=for-the-badge)

# Coriolis Reloaded - The Combat Overhaul

This module extends the yzecoriolis System with the stress deature of the Coriolis Reloaded combat rules. It also adds a few other QOL features, that are listed below.

## Stress 
Coriolis features a resource called stress, which, as it builds up, reduced mind points. In Coriolis Reloaded there are a few situations, where you make a suppression roll, which is basically a d6 + your current stress.
To keep track of the stress level this module adds a stress bar to the character sheet.

<img width="314" height="345" alt="image" src="https://github.com/user-attachments/assets/4597f5b3-09d5-4bf7-bc33-c4274f332343" />

To roll for suppression you can click the dice icon and set a modifier, if one applies. The result is posted in the chat and status effects like "Suppressed" or "Pinned" are automatically applied. 
If applied in combat, they have the duration of 1 round.

<img width="632" height="248" alt="image" src="https://github.com/user-attachments/assets/bde61458-6892-4b41-89a5-b57fab3e41d4" />

<img width="317" height="198" alt="image" src="https://github.com/user-attachments/assets/af100a3c-c2a7-49ce-b143-537e3581e32d" />

## Active Effects Tracker

This module adds a section to the character sheet that shows the active effects. Mainly to show the effects from the suppression roll but also from dropping to 0 hit- or mind points.
Effects appear automatically and most of them have a set duration after which they disappear again. But you can also right click them to end them prematurely.
A normal click expands them, showing a description.
In case of the Panic effect (mind points reduced to 0) the panic duration is also rolled in the background and whispered to the GM.

<img width="687" height="902" alt="image" src="https://github.com/user-attachments/assets/55f9f11a-818a-493d-867a-bd6e7d7ba98c" />

<img width="335" height="152" alt="image" src="https://github.com/user-attachments/assets/37c692a3-c63f-4b1c-86c2-e8a01f59643a" />

You can use custom icons for the status effects created by this module using the game settings. Just paste the path to the icon you want to use into the respective field.

<img width="788" height="687" alt="image" src="https://github.com/user-attachments/assets/4e1ffae7-981c-4e96-8867-a00e89e952e6" />


## Bonus effects from additional successes

When attacking with a weapon, you basically need only one success to hit and deal damage. In Coriolis Reloaded, you can spend additional successes for various effects, like extra damage.
To relieve you from the tedious task of looking it up in the pdf any time you need it, the available bonus effects are now added to the combat roll result in the chat.
The available bonus effects are readf from a journal page, so you can easily modify the available bonus effects or even add own ones.
The information is added to the combat roll result as an expandable element and is only added, when you have at least one additional success to spend, so at least 2 successes. It is added to 
rolls made with a melee weapon, a ranged weapon or grenades.

<img width="315" height="719" alt="image" src="https://github.com/user-attachments/assets/7bd316bb-565c-4fe9-bd2a-96c0cec3f09f" />

<img width="315" height="627" alt="image" src="https://github.com/user-attachments/assets/84ad97e1-40ab-4582-815f-cbc17163899c" />

Here with german journal entries.

To use the bonus effects info just create a journal with respective pages for melee, ranged and grenades. 
<img width="961" height="811" alt="image" src="https://github.com/user-attachments/assets/ef274567-4c03-4080-9fae-476fd7f2a7d9" />

In the game settings just paste the UUID of the respective pages (not the whole journal) into the fields for melee, ranged and grenades.
Here in the settings you can also deactivate this feature.

<img width="1076" height="901" alt="image" src="https://github.com/user-attachments/assets/31e832a5-b7a2-4e10-8622-5707a5aadd88" />

<img width="793" height="691" alt="image" src="https://github.com/user-attachments/assets/74520336-8a3a-4a92-966a-d9723c237248" />

The info for bonus effects is also added, if you rolled 0 or 1 success(es) but get more successes by praying (which I allow also in combat).

## Weapon Trait Linker

With this module you can provide a journal which features weapon trait descriptions. In the attack roll the traits are displayed as a clickable button, which leads to the respective journal entry.
This way you can quickly reference weapon traits and even add homebrew traits easily, if you wish to do so.
Like with the Bonus effects information, just add a journal and in that journal add the respective pages. Each time you roll an attack with the weapon, the module checks for each trait whether inside that journal
a page with the same name exists. If it finds one, it displays it as a link. This even works for traits with values, like "Armor Penetration 1".
Add the traits to the weapon normally, by just typing them into the respective fields.

<img width="634" height="147" alt="image" src="https://github.com/user-attachments/assets/cc6a45ab-6ded-46da-9386-32f2efed52b4" />

<img width="777" height="774" alt="image" src="https://github.com/user-attachments/assets/dd1f1452-701d-4b84-b6aa-df1c27c32e4e" />

<img width="318" height="765" alt="image" src="https://github.com/user-attachments/assets/0485df31-e6ae-417a-9d7e-055c9faaf016" />

Traits that don't have a page in that journal don't get linked and are just displayed as before.

In the character sheet the provided trait descriptions are displayed as a tooltip on the specific trait.
<img width="634" height="294" alt="image" src="https://github.com/user-attachments/assets/f70b4580-3c8c-49c2-a3a7-33376137a40b" />


Note that each page in the journal has to be named exactly like the weapon trait in order to be linked, with the exception of traits with a value. Here you just add a page named like the trait without the value.
So for the trait "Armor Penetration 1" you name the page "Armor Penetration".

<img width="966" height="808" alt="image" src="https://github.com/user-attachments/assets/6aa5619e-08cd-4c0e-8b97-c1882cc84795" />

In the game settings enter the UUID of the journal containing the trait pages. Here you can also deactivate this feature.

<img width="961" height="809" alt="image" src="https://github.com/user-attachments/assets/b603c437-6f00-4a5f-a503-ed788b08eaa6" />

<img width="785" height="684" alt="image" src="https://github.com/user-attachments/assets/b6895335-fd03-4607-9e04-54c57e39672a" />

## Requirements
This module is written and tested on FoundryVTT version 13.
You need to use the yzecoriolis game system in your world.

## Incompatibilities
Nothing that I'm aware of. Maybe anything that alters the height of the craracter sheet window. 
If you encounter anything, feel free to create an issue or PR.
