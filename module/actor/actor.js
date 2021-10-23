/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class EsoterraActor extends Actor {

  /**
   * Augment the basic actor data with additional dynamic data.
   */
  prepareData() {
    super.prepareData();

    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags;

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    if (actorData.type === 'character') this._prepareCharacterData(actorData);
    else if (actorData.type === 'hireling') this._prepareCharacterData(actorData);
    else if (actorData.type === 'creature') this._prepareCharacterData(actorData);

  }
  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {

    const data = actorData.data;



    // let armorBonus = 0;
    // const armors = this.getEmbeddedCollection("Item").filter(e => "armor" === e.type);

    // for (let armor of armors) {
    //   if (armor.data.equipped) {
    //     armorBonus += armor.data.bonus;
    //   }
    // }
    // data.stats.armor.mod = armorBonus;
  }


  rollStatSelect(statList) {

    let selectList = "";

    statList.forEach(stat => selectList += "<option value='" + stat[0] + "'>" + stat[1].label + "</option>")

    let d = new Dialog({
      title: "Select Roll Type",
      content: "<h2> Stat </h2> <select style='margin-bottom:10px;'name='stat' id='stat'> " + selectList + "</select> <br/>",
      buttons: {
        roll: {
          icon: '<i class="fas fa-check"></i>',
          label: "Roll",
          callback: (html) => this.rollStat(this.data.data.stats[html.find('[id=\"stat\"]')[0].value])
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: "Cancel",
          callback: () => { }
        }
      },
      default: "roll",
      close: () => { }
    });
    d.render(true);
  }

  rollStat(attribute) {

    let attLabel = attribute.label?.charAt(0).toUpperCase() + attribute.label?.toLowerCase().slice(1);
    if (!attribute.label && isNaN(attLabel))
      attLabel = attribute.charAt(0)?.toUpperCase() + attribute.toLowerCase().slice(1);

    //this.rollAttribute(attribute, "none");

    let d = new Dialog({
      title: "Select Roll Type",
      content: "<h2> "+game.i18n.localize('Eso.RollAdvantageDisadvantage')+ "</h2> <select style='margin-bottom:10px;'name='advantage' id='advantage'> <option value='none'>"+game.i18n.localize('Eso.RollNone')+"</option> <option value='advantage'>"+game.i18n.localize('Eso.RollAdvantageDisadvantage')+"</option></select> <br/>",
      buttons: {
        roll: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize('Eso.Roll'),
          callback: (html) => this.rollAttribute(attribute, html.find('[id=\"advantage\"]')[0].value)
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize('Eso.Cancel'),
          callback: () => { }
        }
      },
      default: "roll",
      close: () => { }
    });
    d.render(true);
  }

  rollRisk() {
    let attLabel = "Risk Roll";

    //this.rollAttribute(attribute, "none");

    let d = new Dialog({
      title: "Select Risk Type",
      content: "<h2> "+game.i18n.localize('Eso.RollRisk')+"</h2> <select style='margin-bottom:10px;'name='risky' id='risky'>\
      <option value='Average'>"+game.i18n.localize('Eso.RiskAverage')+"</option>\
      <option value='Low'>"+game.i18n.localize('Eso.RiskLow')+"</option>\
      <option value='High'>"+game.i18n.localize('Eso.RiskHigh')+"</option></select> <br/>",
      buttons: {
        roll: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize('Eso.Roll'),
          callback: (html) => this.rollRiskDice(html.find('[id=\"risky\"]')[0].value)
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize('Eso.Cancel'),
          callback: () => { }
        }
      },
      default: "roll",
      close: () => { }
    });
    d.render(true);
  }


  rollItem(itemId, options = { event: null }, type = "") {
    let item = duplicate(this.getEmbeddedDocument("Item", itemId));

    if(item.type == "weapon"){
            //Select the stat of the roll.
      let t = new Dialog({
        title: game.i18n.localize('Eso.RollSelectStat'),
        content: "<h2> "+game.i18n.localize('Eso.RollEnhanced')+"/"+game.i18n.localize('Eso.RollImpaired')+" </h2> <select style='margin-bottom:10px;'name='enhanced' id='enhanced'>\
        <option value='normal'>"+game.i18n.localize('Eso.RollNormal')+"</option>\
        <option value='enhanced'>"+game.i18n.localize('Eso.RollEnhanced')+"</option>\
        <option value='impaired'>"+game.i18n.localize('Eso.RollImpaired')+"</option></select> <br/>",
        buttons: {
          roll: {
            icon: '<i class="fas fa-check"></i>',
            label: "Roll",
            callback: (html) => this.rollWeapon(item, html.find('[id=\"enhanced\"]')[0].value)
          },
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: "Cancel",
            callback: () => { }
          }
        },
        default: "roll",
        close: () => { }
      });
      t.render(true);
      
      // if(item.data.weapon.selected == 0)
      //   this.rollWeapon(item, item.data.weapon.dmg1);
      // else
      // this.rollWeapon(item, item.data.weapon.dmg2);
    } else if(item.type=="spell"){



      //Select the stat of the roll.
      let t = new Dialog({
        title: "Select Stat",
        content: "<h2> "+game.i18n.localize('Eso.RollPowerDesc')+" </h2> <input style='margin-bottom:10px;' name='power' id='power' value='1'></input><br/>",
        buttons: {
          roll: {
            icon: '<i class="fas fa-check"></i>',
            label: game.i18n.localize('Eso.Roll'),
            callback: (html) => this.rollSpell(item, html.find('[id=\"power\"]')[0].value)
          },
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: game.i18n.localize('Eso.Cancel'),
            callback: () => { }
          }
        },
        default: "roll",
        close: () => { }
      });
      t.render(true);
    }  else if(item.type=="skill"){
      let bonus = 10;
      if(type == "focus") bonus = 15;
      //Select the attribute to roll with.
      let t = new Dialog({
        title: game.i18n.localize('Eso.RollSelectStat'),
        content: "<h2> "+game.i18n.localize('Eso.SkillAttribute')+" </h2> <select style='margin-bottom:10px;'name='attribute' id='attribute'>\
        <option value='strength'>"+game.i18n.localize('Eso.Strength')+"</option>\
        <option value='dexterity'>"+game.i18n.localize('Eso.Dexterity')+"</option>\
        <option value='intellect'>"+game.i18n.localize('Eso.Intellect')+"</option>\
        <option value='charisma'>"+game.i18n.localize('Eso.Charisma')+"</option>\
        <option value='will'>"+game.i18n.localize('Eso.Will')+"</option>\
        </select> <br/>",
        buttons: {
          roll: {
            icon: '<i class="fas fa-check"></i>',
            label: "Roll",
            callback: (html) => this.rollAttribute(this.data.data.stats[html.find('[id=\"attribute\"]')[0].value], "", bonus, item)
          },
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: "Cancel",
            callback: () => { }
          }
        },
        default: "roll",
        close: () => { }
      });
      t.render(true);

    }
    else {
      this.chatDesc(item);
    }
  }

  rollWeapon(item = "", state = ""){
    let die = (item.data.weapon.selected == 0 ? item.data.weapon.dmg1 : item.data.weapon.dmg2)
    
    if(state == "impaired")
      die = 'd4';
    if(state == "enhanced")
      die = 'd12';
      
  //   this.rollWeapon(item, item.data.weapon.dmg1);
  // else
  // this.rollWeapon(item, item.data.weapon.dmg2);

    let damageRoll = new Roll(die);
    damageRoll.evaluate({async: false});
    //damageRoll.roll();

    const diceData = this.formatDice(damageRoll);

    //Create the pip HTML.
    let pipHtml = "<div style='margin-top: 5px;'>";
    for (let i = 0; i < item.data.pips.max; i++) {
      if (i < item.data.pips.value)
        pipHtml += '<i class="fas fa-circle">&nbsp;</i>'
      else
        pipHtml += '<i class="far fa-circle">&nbsp;</i>';
    }
    pipHtml += "</div>";

    var templateData = {
      actor: this,
      data: {
        diceTotal: {
          damageValue: damageRoll._total,
          damageRoll: damageRoll
        },
      },
      item: item,
      pip: pipHtml,
      rollTitle: "Damage", //The title of the roll.
      rollText: damageRoll._total, //What is printed within the roll amount.
      damageDice: die,
      weaponState: state,
      isWeapon: true,
      diceData
    };

    let chatData = {
      user: game.user.id,
      speaker: {
        actor: this.id,
        token: this.token,
        alias: this.name
      }
    };

    let rollMode = game.settings.get("core", "rollMode");
    if (["gmroll", "blindroll"].includes(rollMode)) chatData["whisper"] = ChatMessage.getWhisperRecipients("GM");

    let template = 'systems/esoterra/templates/chat/statroll.html';
    renderTemplate(template, templateData).then(content => {
      chatData.content = content;
      if (game.dice3d) {
        game.dice3d.showForRoll(damageRoll, game.user, true, chatData.whisper, chatData.blind).then(displayed => ChatMessage.create(chatData));

      } else {
        chatData.sound = CONFIG.sounds.dice;
        ChatMessage.create(chatData);
      }
    });

  }

  rollSpell(item = "", power = ""){
    
    let die = item.data.strainCost;
    die = die.split("[POW]").join(""+power);
    die = die.split("x").join("*");
    console.log(die);

    //power+"d6";

    let damageRoll = new Roll(die);
    damageRoll.evaluate({async: false});

    const diceData = this.formatDice(damageRoll);

    let rollDiv = '';

    let usage = 0;
    let miscast = 0;

    console.log(diceData);
    for(let i=0; i < diceData.dice.length; i++){
      
      if(i > 0)
      rollDiv += ', ' + diceData.dice[i].result;
      else
      rollDiv += '' + diceData.dice[i].result;

      // if(diceData.dice[i].result >= 4){
      //   usage++;
      //   if(diceData.dice[i].result == 6){
      //     miscast++;
      //   }
      // }
    }

    if(item.data.description == null){
      item.data.description = "";
    }

    //Change without formatting
    item.data.description = item.data.description.split("[P]").join(""+power);
    item.data.description = item.data.description.split("[S]").join(""+damageRoll._total);

    item.data.description = item.data.description.split("[POW]").join("<strong style='text-decoration:underline' class='red'>"+power+"<i class='fas fa-burn'></i></strong>");
    item.data.description = item.data.description.split("[SUM]").join("<strong style='text-decoration:underline' class='red'>"+damageRoll._total+"</strong>");

 
    item.data.description += "<h2>"+game.i18n.localize('Eso.RollStrain')+": <strong>"+damageRoll._total+"</strong></h2>";
    if(miscast){
      let miscastDesc = game.i18n.localize('Eso.RollMiscastDesc');
      miscastDesc = miscastDesc.replace("!miscast!", ""+miscast);
      item.data.description += "<h2>"+game.i18n.localize('Eso.RollMiscast')+": <strong>"+miscast+"</strong> </h2>" + miscastDesc;
    }

    //Create the pip HTML.
    let pipHtml = "<div style='margin-top: 5px;'>";
    for (let i = 0; i < item.data.pips.max; i++) {
      if (i < item.data.pips.value)
        pipHtml += '<i class="fas fa-circle">&nbsp;</i>'
      else
        pipHtml += '<i class="far fa-circle">&nbsp;</i>';
    }
    pipHtml += "</div>";

    var templateData = {
      actor: this,
      data: {
        diceTotal: {
          damageValue: damageRoll._total,
          damageRoll: damageRoll
        },
        rollDiv:rollDiv
      },
      item: item,
      pip: pipHtml,
      isSpell: true,
      isWeapon:true,
      rollTitle: game.i18n.localize('Eso.RollStrain')+" | "+game.i18n.localize('Eso.RollPower'), //The title of the roll.
      rollText: damageRoll._total+' | '+power, //What is printed within the roll amount.
      sum: damageRoll._total,
      dice: power,
      diceData
    };

    let chatData = {
      user: game.user.id,
      speaker: {
        actor: this.id,
        token: this.token,
        alias: this.name
      }
    };

    let rollMode = game.settings.get("core", "rollMode");
    if (["gmroll", "blindroll"].includes(rollMode)) chatData["whisper"] = ChatMessage.getWhisperRecipients("GM");

    let template = 'systems/esoterra/templates/chat/statroll.html';
    renderTemplate(template, templateData).then(content => {
      chatData.content = content;
      if (game.dice3d) {
        game.dice3d.showForRoll(damageRoll, game.user, true, chatData.whisper, chatData.blind).then(displayed => ChatMessage.create(chatData));

      } else {
        chatData.sound = CONFIG.sounds.dice;
        ChatMessage.create(chatData);
      }
    });

  }

  rollAttribute(attribute, advantage, bonus = 0, item = "", rollOver = false) {

    console.log(attribute);

    let attributeName = attribute.label?.charAt(0).toUpperCase() + attribute.label?.toLowerCase().slice(1);
    if (!attribute.label && isNaN(attributeName))
      attributeName = attribute.charAt(0)?.toUpperCase() + attribute.toLowerCase().slice(1);

    // Roll
    let diceformular = "1d100";

    console.log(attribute);

    let r = new Roll(diceformular, {});
    r.evaluate({async: false});

    let rSplit = ("" + r._total).split("");

    //Advantage roll
    let a = new Roll(diceformular, {});
    a.evaluate({async: false});

    let damageRoll = 0;
    if (item.type == "weapon") {
      damageRoll = new Roll(item.data.damage);
      damageRoll.evaluate({async: false});
    }

    let skillName = "";
    if (item.type == "skill") {
      skillName = item.name;
      if(bonus > 10){
        skillName += ' - ' + item.data.focus; 
      }

      // damageRoll = new Roll(item.data.damage);
      // damageRoll.evaluate({async: false});
    }

    // Format Dice
    const diceData = this.formatDice(r);

    let mod = 0;
    if (attribute.mod > 0) mod = attribute.mod;

    let targetValue = attribute.value + mod + (item == "" ? 0 : bonus);
    console.log(targetValue);
    console.log(bonus);

    //Here's where we handle the result text.
    let resultText = "";

    if (rollOver == true) {
        resultText = (r._total >= targetValue ? game.i18n.localize('Eso.RollSuccess') : game.i18n.localize('Eso.RollFailure'));
    } else {
        resultText = (r._total <= targetValue ? game.i18n.localize('Eso.RollSuccess') : game.i18n.localize('Eso.RollFailure'));
    }

    var templateData = {
      actor: this,
      stat: {
        name: game.i18n.localize('Eso.'+attributeName).toUpperCase()
      },
      data: {
        diceTotal: {
          value: r._total,
          advantageValue: a._total,
          damageValue: damageRoll._total,
          damageRoll: damageRoll
        },
        resultText: {
          value: resultText
        },
        isCreature: {
          value: this.data.type == "hireling" ? true : false
        }
      },
      target: attribute.value,
      mod: mod,
      item: item,
      targetValue: targetValue,
      useSkill: item.type == "skill" ? true : false,
      skillBonus : bonus,
      skillName : skillName,
      isWeapon: item.type == "weapon" ? true : false,
      advantage: advantage == "advantage" ? true : false,
      diceData
    };

    let chatData = {
      user: game.user.id,
      speaker: {
        actor: this.id,
        token: this.token,
        alias: this.name
      }
    };

    let rollMode = game.settings.get("core", "rollMode");
    if (["gmroll", "blindroll"].includes(rollMode)) chatData["whisper"] = ChatMessage.getWhisperRecipients("GM");

    /*
            if (this.data.type == "hireling") {
                chatData.whisper = game.user._id;
            }
    */
    let template = 'systems/esoterra/templates/chat/statroll.html';
    renderTemplate(template, templateData).then(content => {
      chatData.content = content;
      if (game.dice3d) {
        game.dice3d.showForRoll(r, game.user, true, chatData.whisper, chatData.blind).then(displayed => ChatMessage.create(chatData));

      } else {
        chatData.sound = CONFIG.sounds.dice;
        ChatMessage.create(chatData);
      }
    });

    //Roll the risk dice.
    this.rollRiskDice("Average");

  }

  rollRiskDice(riskLevel) {
    // Roll
    let diceformular = "1d4";

    let r = new Roll(diceformular, {});
    r.evaluate({async: false});

    let rSplit = ("" + r._total).split("");

    // Format Dice
    const diceData = this.formatDice(r);

    let assetNum = 1;
    let threatNum = 4;

    if(riskLevel == "High"){
      threatNum = 3;
    }
    if(riskLevel == "Low"){
      assetNum = 2;
    }
    
    let points = 0;
    //Here's where we handle the result text.
    let resultText = "No Result";//(r._total <= targetValue ? game.i18n.localize('Eso.RollSuccess') : game.i18n.localize('Eso.RollFailure'));
    if(r._total <= assetNum){
      points = this.data.data.assets.value;
      if(points > 1) resultText = points + " Assets"
      else resultText = points + " Asset"
    } else if(r._total >= threatNum){
      points = this.data.data.threats.value;
      if(points > 1) resultText = points + " Threats"
      else resultText = points + " Threat"
    }
    
    let riskString = 'Average'
    
    let htmlString = `
    <div class="rollcontainer">
      <div class="flexrow" style="height: 46px;">
        <div class="rollriskheader">Risk Dice - `+riskLevel+`</div>
      </div>
      <div class="rollrisk">[`+r._total + `] - ` +resultText+`</div>
    </div>
    `;


    var templateData = {
      actor: this,
      stat: {
        name: game.i18n.localize('Eso.Risk').toUpperCase()
      },
      data: {
      },
      HTML : htmlString,
      useHTML: true,
      diceData
    };

    let chatData = {
      user: game.user.id,
      speaker: {
        actor: this.id,
        token: this.token,
        alias: this.name
      }
    };

    let rollMode = game.settings.get("core", "rollMode");
    if (["gmroll", "blindroll"].includes(rollMode)) chatData["whisper"] = ChatMessage.getWhisperRecipients("GM");

    let template = 'systems/esoterra/templates/chat/statroll.html';
    renderTemplate(template, templateData).then(content => {
      chatData.content = content;
      if (game.dice3d) {
        game.dice3d.showForRoll(r, game.user, true, chatData.whisper, chatData.blind).then(displayed => ChatMessage.create(chatData));

      } else {
        chatData.sound = CONFIG.sounds.dice;
        ChatMessage.create(chatData);
      }
    });
  }

  formatDice(diceRoll) {
    let diceData = { dice: [] };

    if (diceRoll != null) {
      let pushDice = (diceData, total, faces, color) => {
        let img = null;
        if ([4, 6, 8, 10, 12, 20].indexOf(faces) > -1) {
          img = `../icons/svg/d${faces}-grey.svg`;
        }
        diceData.dice.push({
          img: img,
          result: total,
          dice: true,
          color: color
        });
      };

      for (let i = 0; i < diceRoll.terms.length; i++) {
        if (diceRoll.terms[i] instanceof Die) {
          let pool = diceRoll.terms[i].results;
          let faces = diceRoll.terms[i].faces;

          pool.forEach((pooldie) => {
            if (pooldie.discarded) {
              pushDice(diceData, pooldie.result, faces, "#777");
            } else {
              pushDice(diceData, pooldie.result, faces, "white");
            }

          });
        } else if (typeof diceRoll.terms[i] == 'string') {
          const parsed = parseInt(diceRoll.terms[i]);
          if (!isNaN(parsed)) {
            diceData.dice.push({
              img: null,
              result: parsed,
              dice: false,
              color: 'white'
            });
          } else {
            diceData.dice.push({
              img: null,
              result: diceRoll.terms[i],
              dice: false
            });
          }
        }
        else if (typeof diceRoll.terms[i] == 'number') {
          const parsed = parseInt(diceRoll.terms[i]);
          if (!isNaN(parsed)) {
            diceData.dice.push({
              img: null,
              result: parsed,
              dice: false,
              color: 'white'
            });
          } else {
            diceData.dice.push({
              img: null,
              result: diceRoll.terms[i],
              dice: false
            });
          }
        }
      }
    }

    return diceData;
  }

  // Print the item description into the chat.
  chatDesc(item) {
    let itemName = item.name?.charAt(0).toUpperCase() + item.name?.toLowerCase().slice(1);
    if (!item.name && isNaN(itemName))
      itemName = item.charAt(0)?.toUpperCase() + item.toLowerCase().slice(1);

    //Create the pip HTML.
    let pipHtml = "<div style='margin-top: 5px;'>";
    for (let i = 0; i < item.data.pips.max; i++) {
      if (i < item.data.pips.value)
        pipHtml += '<i class="fas fa-circle">&nbsp;</i>'
      else
        pipHtml += '<i class="far fa-circle">&nbsp;</i>';
    }
    pipHtml += "</div>";

    if(item.data.description == null){
      item.data.description = "";
    } else if(item.data.description.length > 0){
      item.data.description += "<br/>";
    }
    if(item.type == "condition"){
      item.data.description += item.data.desc+"<br/><strong>Clear: </strong>"+item.data.clear;
    }
    if(item.type == "talent"){
      item.data.description = item.data.description.split("[CON]").join('<i class="fas fa-head-side-brain"></i>');
      item.data.description = item.data.description.split("[RANK]").join('<i class="fas fa-diamond"></i>');
      item.data.description = item.data.description.split("[USE]").join('<i class="far fa-circle"></i>');
      item.data.description = item.data.description.split("\n").join('<br/>');

      let rankHtml = "<div style='margin-top: 5px;'>";
      for (let i = 0; i < item.data.rank.max; i++) {
        if (i < item.data.rank.value)
        rankHtml += '<i class="fas fa-diamond">&nbsp;</i>'
        else
        rankHtml += '<i class="far fa-diamond">&nbsp;</i>';
      }
      rankHtml += "</div>";
      pipHtml += rankHtml;
    }

    var templateData = {
      actor: this,
      stat: {
        name: itemName.toUpperCase()
      },
      item: item,
      pip: pipHtml,
      onlyDesc: true
    };

    let chatData = {
      user: game.user.id,
      speaker: {
        actor: this.id,
        token: this.token,
        alias: this.name
      }
    };

    let rollMode = game.settings.get("core", "rollMode");
    if (["gmroll", "blindroll"].includes(rollMode)) chatData["whisper"] = ChatMessage.getWhisperRecipients("GM");

    /*
            if (this.data.type == "hireling") {
                chatData.whisper = game.user._id;
            }
    */
    let template = 'systems/esoterra/templates/chat/statroll.html';
    renderTemplate(template, templateData).then(content => {
      chatData.content = content;

      ChatMessage.create(chatData);
    });
  }

}