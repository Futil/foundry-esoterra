
/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
 export class EsoterraMookSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
      return mergeObject(super.defaultOptions, {
          classes: ["esoterra", "sheet", "actor", "mook"],
          template: "systems/esoterra/templates/actor/mook-sheet.html",
          width: 650,
          height: 570,
          tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "character" }]
      });
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
      const data = super.getData();
      data.dtypes = ["String", "Number", "Boolean"];

      const superData = data.data.data;

      if (this.actor.data.type == 'mook') {

          // Initialization run.
          // if(!superData.initialized){
          //   console.log("Initializing Character Sheet");
          if(superData.assets.html == ''){
              for(let i = 0; i < 6; i ++){
              if(i >= superData.assets.value)
              superData.assets.html += '<div class="circle"></div>';
              else
              superData.assets.html += '<div class="circle-f"></div>';
              }
          }
          
          if(superData.threats.html == ''){
              for(let i = 0; i < 6; i ++){
              if(i >= superData.threats.value)
              superData.threats.html += '<div class="diamond"></div>';
              else
              superData.threats.html += '<div class="diamond-f"></div>';
              }
          }
          if(superData.xp.html == ''){
              for(let i = 0; i < 8; i ++){
              if(i >= superData.xp.value)
              superData.xp.html += '<div class="circle"></div>';
              else
              superData.xp.html += '<div class="circle-f"></div>';
              }
          }
          //   superData.initialized = true;

          //   this.actor.update({[superData] : superData});
          // }
          this._prepareCharacterItems(data);
      }

      if (data.data.settings == null) {
      data.data.settings = {};
      }

      return data.data;
  }

/**
 * Organize and classify Items for Character sheets.
 *
 * @param {Object} actorData The actor to prepare.
 *
 * @return {undefined}
 */
 _prepareCharacterItems(sheetData) {

  const actorData = sheetData.data;

  // Initialize containers.
  const gear = [];
  const skills = [];

  // Iterate through items, allocating to containers
  // let totalWeight = 0;
  for (let i of sheetData.items) {
    let item = i.data;
    i.img = i.img || DEFAULT_TOKEN;

    if(i.type === "skill"){
      skills.push(i);
    } else {
      // We'll handle the pip html here.
      if (item.pips == null) {
        item.pips = {
          "value": 0,
          "max": 0,
          "html": ""
        };
      }
      let pipHtml = "";
      for (let i = 0; i < item.pips.max; i++) {
        if (i < item.pips.value){
          pipHtml += '<i class="fas fa-circle"></i>';
        }
        else{
          if(item.pips.level == 0 || i < item.pips.level){
            pipHtml += '<i class="far fa-circle"></i>';
          } else {
            pipHtml += '<i class="far fa-circle" style="color: rgba(55,55,55,0.5)"></i>';
          }
        }
      }
      item.pips.html = pipHtml;
      // End of the pip handler

      // Now we'll set tags
      if (i.type == "item") { item.isWeapon = false; item.isCondition = false; }
      else if (i.type == "weapon") {
        item.isWeapon = true;
        item.isCondition = false;

        if (item.weapon.dmg2 != "") {
          item.weapon.canSwap = true;
        } else {
          item.weapon.canSwap = false;
        }
      }

      if (item.size == undefined) {
        item.size = {
          "width": 1,
          "height": 1,
          "x": "9em",
          "y": "9em"
        }
      }
      
      //Spell stuff / Setting the footer text
      if (i.type == "spell"){
        let strainHTML = '';
        if(item.strainCost != undefined){
          strainHTML = item.strainCost.split("[POW]").join('<i class="fas fa-burn"></i>');
        }
        let maxHTML = '';
        if(item.maxPower > 0) maxHTML = ' : MAX ' +item.maxPower+ '<i class="fas fa-burn"></i>';
        item.footerHTML= strainHTML + maxHTML;
      } else if(i.type == "talent"){
        if(item.descTalent != undefined){
          item.descHTML = item.descTalent;

          item.descHTML = item.descHTML.split("[CON]").join('<i class="fas fa-head-side-brain"></i>');
          item.descHTML = item.descHTML.split("[RANK]").join('<i class="fas fa-diamond"></i>');
          item.descHTML = item.descHTML.split("[USE]").join('<i class="far fa-circle"></i>');
          item.descHTML = item.descHTML.split("\n").join('<br/>');

        }
        item.rank.html = "";

        //Rank HTML
        for (let i = 0; i < item.rank.max; i++) {
          if (i < item.rank.value){
            item.rank.html += '<i class="fas fa-diamond"></i>';
          }
          else{
            item.rank.html += '<i class="far fa-diamond"></i>';
          }
        }
      }

      if(item.sheet.rotation == undefined)
      item.sheet.rotation = 0;

      item.size.aspect = (item.sheet.rotation == -90 ? (item.size.width > item.size.height ? item.size.width / item.size.height : item.size.height / item.size.width) : 1);

      item.sheet.curHeight = (item.sheet.rotation == -90 ? item.size.width : item.size.height);
      item.sheet.curWidth = (item.sheet.rotation == -90 ? item.size.height : item.size.width);

      item.size.x = (item.sheet.curWidth * 8 + item.sheet.curWidth) + "em";
      item.size.y = (item.sheet.curHeight * 8 + item.sheet.curHeight) + "em";

      let roundScale = 2;
      let xPos = Math.round(item.sheet.currentX / roundScale) * roundScale;
      let yPos = Math.round(item.sheet.currentY / roundScale) * roundScale;
      item.sheet.currentX = xPos;
      item.sheet.currentY = yPos;
      item.sheet.zIndex = xPos + yPos + 1000;

      gear.push(i);
    }
  }
  // Assign and return
  actorData.gear = gear;
  actorData.skills = skills;
}
/** @override */
activateListeners(html) {
  super.activateListeners(html);

  // Everything below here is only needed if the sheet is editable
  if (!this.options.editable) return;

  // Update Inventory Item
  html.find('.item-equip').click(ev => {
    const li = $(ev.currentTarget).parents(".item");
    const item = duplicate(this.actor.getEmbeddedDocument("Item", li.data("itemId")))

    item.data.equipped = !item.data.equipped;
    this.actor.updateEmbeddedDocuments('Item', [item]);
  });

  // Add Inventory Item
  html.find('.item-create').click(ev => {

    let creatableItems = ['item', 'weapon', 'spell', 'armor', 'condition', 'storage'];
    let selectList = "";

    creatableItems.forEach(type => selectList += "<option value='" + type + "'>" + type + "</option>")

    //Select the stat of the roll.
    let t = new Dialog({
      title: "Select Stat",
      content: "<h2> Item Type </h2> <select style='margin-bottom:10px;'name='type' id='type'> " + selectList + "</select> <br/>",
      buttons: {
        roll: {
          icon: '<i class="fas fa-check"></i>',
          label: "Create",
          callback: (html) => this._onItemCreate(ev, html.find('[id=\"type\"]')[0].value)
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
  });


  // Update Inventory Item
  html.find('.item-edit').click(ev => {
    const li = $(ev.currentTarget).parents(".item");
    const item = this.actor.getEmbeddedDocument("Item",li.data("itemId"));
    item.sheet.render(true);
  });

  // Delete Inventory Item
  html.find('.item-delete').click(ev => {
    const li = $(ev.currentTarget).parents(".item");
    this.actor.deleteEmbeddedDocuments("Item",[li.data("itemId")]);
    li.slideUp(200, () => this.render(false));
  });

  // Rotate Inventory Item
  html.find('.item-rotate').click(ev => {
    const li = ev.currentTarget.closest(".item");
    const item = duplicate(this.actor.getEmbeddedDocument("Item", li.dataset.itemId))
    if(item.data.sheet.rotation == -90)
      item.data.sheet.rotation = 0;
    else
      item.data.sheet.rotation = -90;
      this.actor.updateEmbeddedDocuments('Item', [item]);
  });


  // Rollable Attributes
  html.find('.stat-roll').click(ev => {
    const div = $(ev.currentTarget);
    const statName = div.data("key");
    const attribute = this.actor.data.data.stats[statName];
    this.actor.rollStat(attribute);
  });

  // Rollable Attributes
  html.find('.skill-roll').click(ev => {
    const li = ev.currentTarget.closest(".item");
    const div = $(ev.currentTarget);
    const type = div.data("key");
    // const attribute = this.actor.data.data.stats[statName];
    this.actor.rollItem(li.dataset.itemId, {event: ev}, type);
  });

  // Rollable Attributes
  html.find('.risk-roll').click(ev => {
    const div = $(ev.currentTarget);
    this.actor.rollRisk();
  });

  // Rollable Item/Anything with a description that we want to click on.
  html.find('.item-roll').click(ev => {
    const li = ev.currentTarget.closest(".item");
    this.actor.rollItem(li.dataset.itemId, {
      event: ev
    });
  });

  // If we have an item input being adjusted from the character sheet.
  html.on('change', '.item-input', ev => {
    const li = ev.currentTarget.closest(".item");
    const item = duplicate(this.actor.getEmbeddedDocument("Item", li.dataset.itemId))
    const input = $(ev.currentTarget);

    item[input[0].name] = input[0].value;

    this.actor.updateEmbeddedDocuments('Item', [item]);
  });

  html.on('mousedown', '.pip-button', ev => {
    const li = ev.currentTarget.closest(".item");
    const item = duplicate(this.actor.getEmbeddedDocument("Item", li.dataset.itemId))

    let amount = item.data.pips.value;

    if (event.button == 0) {
      if (amount < item.data.pips.max && (amount < item.data.pips.level || item.data.pips.level == 0)) {
        item.data.pips.value = Number(amount) + 1;
      }
    } else if (event.button == 2) {
      if (amount > 0) {
        item.data.pips.value = Number(amount) - 1;
      }
    }

    this.actor.updateEmbeddedDocuments('Item', [item]);
  });

  html.on('mousedown', '.rank-button', ev => {
    const li = ev.currentTarget.closest(".item");
    const item = duplicate(this.actor.getEmbeddedDocument("Item", li.dataset.itemId))

    let amount = item.data.rank.value;

    if (event.button == 0) {
      if (amount < item.data.rank.max) {
        item.data.rank.value = Number(amount) + 1;
      }
    } else if (event.button == 2) {
      if (amount > 0) {
        item.data.rank.value = Number(amount) - 1;
      }
    }

    this.actor.updateEmbeddedDocuments('Item', [item]);
  });

  html.on('mousedown', '.char-pip-button', ev => {
    const data = super.getData();

    const div = $(ev.currentTarget);
    const targetName = div.data("key");
    const attribute = data.data.data[targetName];

    let amount = attribute.value;
    let max = div.data("max");
    let min = div.data("min");

    if (event.button == 0) {
      if (amount < max) {
        attribute.value = Number(amount) + 1;
      }
    } else if (event.button == 2) {
      if (amount > min) {
        attribute.value = Number(amount) - 1;
      }
    }

    let updated = {
      html: '',
      value: attribute.value
    }

    if(targetName == 'threats'){
      updated.html = '';
      for(let i = 0; i < 6; i ++){
        if(i >= updated.value)
        updated.html += '<div class="diamond"></div>';
        else
        updated.html += '<div class="diamond-f"></div>';
      }
    } else if (targetName == 'assets') {
      updated.html = '';
      for(let i = 0; i < 6; i ++){
        if(i >= updated.value)
        updated.html += '<div class="circle"></div>';
        else
        updated.html += '<div class="circle-f"></div>';
      }
    } else if (targetName == 'xp') {
      updated.html = '';
      for(let i = 0; i < 8; i ++){
        if(i >= updated.value)
        updated.html += '<div class="circle"></div>';
        else
        updated.html += '<div class="circle-f"></div>';
      }
    }


    // superData.assets.html = '';
    // for(let i = 0; i < 6; i ++){
    //   if(i >= superData.assets.value)
    //   superData.assets.html += '<div class="circle"></div>';
    //   else
    //   superData.assets.html += '<div class="circle-f"></div>';
    // }

    // superData.threats.html = '';
    // for(let i = 0; i < 6; i ++){
    //   if(i >= superData.threats.value)
    //   superData.threats.html += '<div class="diamond"></div>';
    //   else
    //   superData.threats.html += '<div class="diamond-f"></div>';
    // }
    // superData.xp.html = '';
    // for(let i = 0; i < 8; i ++){
    //   if(i >= superData.xp.value)
    //   superData.xp.html += '<div class="circle"></div>';
    //   else
    //   superData.xp.html += '<div class="circle-f"></div>';
    // }

    const updateString = "data."+targetName;

    this.actor.update({[updateString] : updated});


    // this.actor.update();
    // this.actor.updateEmbeddedDocuments();
  });


  html.on('mousedown', '.damage-swap', ev => {
      const li = ev.currentTarget.closest(".item");
      const item = duplicate(this.actor.getEmbeddedDocument("Item", li.dataset.itemId))

      let d1 = item.data.weapon.dmg1;
      let d2 = item.data.weapon.dmg2;

      item.data.weapon.dmg1 = d2;
      item.data.weapon.dmg2 = d1;
      this.actor.updateEmbeddedDocuments('Item', [item]);
    });


    // Drag events for macros.
    if (this.actor.isOwner) {
      let handler = ev => this._onDragItemStart(ev);
      let dragEnd = ev => this._onDragOver(ev);

      html.find('li.dropitem').each((i, li) => {
        if (li.classList.contains("inventory-header")) return;
        li.setAttribute("draggable", true);
        li.addEventListener("dragstart", handler, false);
      });

      html.find('div.dropitem').each((i, div) => {
        if (div.classList.contains("inventory-header")) return;
        div.setAttribute("draggable", true);
        div.addEventListener("dragstart", handler, false);
        div.addEventListener("dragend", dragEnd, false);

      });
    }
  }
  /* -------------------------------------------- */
  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  _onItemCreate(event, type) {
      event.preventDefault();
      const header = event.currentTarget;
      // Get the type of item to create.
      //const type = header.dataset.type;
      // Grab any data associated with this control.
      const data = duplicate(header.dataset);
      // Initialize a default name.
      const name = `New ${type.capitalize()}`;
      // Prepare the item object.
      const itemData = {
          name: name,
          type: type,
          data: data
      };
      // Remove the type from the dataset since it's in the itemData.type prop.
      delete itemData.data["type"];

      // Finally, create the item!
      return this.actor.createEmbeddedDocuments("Item",[itemData]);
  }

  /**
   * Handle creating a new Owned skill for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  _onSkillCreate(event) {
      event.preventDefault();
      const header = event.currentTarget;
      // Get the type of item to create.
      const type = header.dataset.type;
      // Grab any data associated with this control.
      const data = duplicate(header.dataset);
      // Initialize a default name.
      const name = `New Skill`;
      // Prepare the item object.
      const itemData = {
          name: name,
          type: type,
          data: data
      };
      // Remove the type from the dataset since it's in the itemData.type prop.
      delete itemData.data["type"];

      // Finally, create the item!
      return this.actor.createEmbeddedDocuments("Item",[itemData]);
  }


  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {
      event.preventDefault();
      const element = event.currentTarget;
      const dataset = element.dataset;

      if (dataset.roll) {
          let roll = new Roll(dataset.roll, this.actor.data.data);
          let label = dataset.label ? `Rolling ${dataset.label} to score under ${dataset.target}` : '';
          roll.roll().toMessage({
              speaker: ChatMessage.getSpeaker({ actor: this.actor }),
              flavor: label
          });
      }
  }

  async _updateObject(event, formData) {
      const actor = this.object;
      const updateData = expandObject(formData);

      await actor.update(updateData, {
          diff: false
      });
  }



  //The onDragItemStart event can be subverted to let you package additional data what you're dragging
  _onDragItemStart(event) {
      let itemId = event.currentTarget.getAttribute("data-item-id");

      if (!itemId)
          return;

      const clickedItem = duplicate(
          this.actor.getEmbeddedDocument("Item", itemId)
      );


      let it = $(event.currentTarget);

      let width = it.outerWidth();
      let height = it.outerHeight();
      var x = event.pageX - it.offset().left - width / 2;
      var y = event.pageY - it.offset().top - height / 2;

      let i = $('#' + itemId);

      // i.fadeOut(150);

      // setTimeout(function(){
      //   $('#'+itemId)[0].style.visibility = "hidden";
      // }, 1);
      // console.log(event);

      clickedItem.data.stored = "";
      const item = clickedItem;

      event.dataTransfer.setData(
          "text/plain",
          JSON.stringify({
              type: "Item",
              sheetTab: this.actor.data.flags["_sheetTab"],
              actorId: this.actor.id,
              itemId: itemId,
              fromToken: this.actor.isToken,
              offset: {
                  x: x,
                  y: y
              },
              data: item,
              root: event.currentTarget.getAttribute("root"),
          })
      );
  }

  //Call this when an item is dropped.
  _onDragOver(event) {
      // let itemId = event.currentTarget.getAttribute("data-item-id");

      // if(!itemId)
      //   return;

      // let item = $('#'+itemId);

      // if(item == null)
      //   return;

      // item.fadeIn(150);
      // setTimeout(function(){
      //   item.style.visibility = "visible";
      // }, 100);
  }

  /**
   * Handle dropping of an item reference or item data onto an Actor Sheet
   * @param {DragEvent} event     The concluding DragEvent which contains drop data
   * @param {Object} data         The data transfer extracted from the event
   * @return {Object}             A data object which describes the result of the drop
   * @private
   */
  async _onDropItem(event, data) {
      if (!this.actor.isOwner) return false;
      const item = await Item.fromDropData(data);
      const itemData = duplicate(item.data);

      // Handle item sorting within the same Actor
      const actor = this.actor;

      let it = $(event.target);
      if(it.attr('id') != "drag-area"){
          it = it.parents("#drag-area")
      }

      var x = 0;
      var y = 0;


      if(it.length){
          let width = it.outerWidth();
          let height = it.outerHeight();
  
          x = event.pageX - it.offset().left - width / 2;
          y = event.pageY - it.offset().top - height / 2;
      }
      // let width = $('#drag-area-' + actor.id).outerWidth();
      // let height = $('#drag-area-' + actor.id).outerHeight();
  
      // var x = event.pageX - $('#drag-area-' + actor.id).offset().left - width / 2;
      // var y = event.pageY - $('#drag-area-' + actor.id).offset().top - height / 2;
      
      // if (Math.abs(x) > Math.abs(width / 2) || Math.abs(y) > Math.abs(height / 2)) {
      //     x = 0;
      //     y = 0;
      // }

      let sameActor = (data.actorId === actor.id) || (actor.isToken && (data.tokenId === actor.token.id));
      if (sameActor && !(event.ctrlKey)) {
          let i = duplicate(actor.getEmbeddedDocument("Item", data.itemId))
          i.data.sheet = {
              currentX: x - data.offset.x,
              currentY: y - data.offset.y,
              initialX: x - data.offset.x,
              initialY: y - data.offset.y,
              xOffset: x - data.offset.x,
              yOffset: y - data.offset.y
          };
          actor.updateEmbeddedDocuments('Item', [i]);
          return;
          //return this._onSortItem(event, itemData);
      }

      if (data.actorId && !(event.ctrlKey) && !data.fromToken && !this.actor.isToken) {
          let oldActor = game.actors.get(data.actorId);
          oldActor.deleteEmbeddedDocuments("Item",[data.itemId]);
      }

      if (!data.offset) {
          data.offset = {
              x: 0,
              y: 0
          };
      }
      itemData.data.sheet = {
          currentX: x - data.offset.x,
          currentY: y - data.offset.y,
          initialX: x - data.offset.x,
          initialY: y - data.offset.y,
          xOffset: x - data.offset.x,
          yOffset: y - data.offset.y
      };

      // Create the owned item
      return this._onDropItemCreate(itemData);
  }
}
