// DO NOT MODIFY UNDER PAIN OF GOBLIN INSTA-RAGE ONE-SHOT (yikes)
class Item {
  constructor(name, sellIn, quality){
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}
// END DO NOT MODIFY

/**
 * Most generic items follow these standard rules for item updates:
 *  1. `quality` decreases by 1 for every day while `sellIn` is greater than today (0);
 *  2. `quality` decreases by 2 for every day thereafter.
 *  3. `sellIn` decrements by 1 every day.
 */
const standardItemUpdater = (item) => {
  if (item.sellIn > 0) {
    item.quality--;
  } else {
    item.quality -= 2;
  }
  if (item.quality < 0) item.quality = 0;
  item.sellIn--;
  return item;
}

/**
 * Map of item types that require specific handling rules to an updater that
 * implements those rules.
 * Each key should be an all-lower-case string that is expected to be found
 * in the `name` of each item, and each value should be a function that takes a
 * non-null Item object, updates it according to the rules for that item type,
 * and returns it.
 */
const customItemUpdaters = {
  // Aged brie does not decrease in quality daily, instead it increases the same amount.
  // Max quality for brie is 50.
  "aged brie": (item) => {
    if (item.quality < 50) {
      if (item.sellIn > 0) {
        item.quality++;
      } else {
        item.quality += 2;
      }
    }
    item.sellIn--;
    return item;
  },
  // Sulfuras is a legendary item and is not updated.
  "sulfuras": (item) => item,
  // Backstage passes increase in quality daily until expiring, following these rules:
  //   sellIn > 10: quality increases by 1
  //   10 >= sellIn >= 5: increases by 2
  //   5 > sellIn => 0: increases by 3
  //   0 > sellIn: equal to 0
  "backstage passes": (item) => {
    item.sellIn--;
    if (item.sellIn > 10) {
      item.quality++;
    } else if (item.sellIn >= 5) {
      item.quality += 2;
    } else if (item.sellIn >= 0) {
      item.quality += 3;
    } else {
      item.quality = 0;
    }
    if (item.quality > 50) item.quality = 50;
    return item;
  },
  // Conjured items have their quality degrade twice as quickly as normal.
  "conjured": (item) => {
    if (item.sellIn > 0) {
      item.quality -= 2;
    } else {
      item.quality -= 4;
    }
    if (item.quality < 0) item.quality = 0;
    item.sellIn--;
    return item;
  }
}

const customItemTypes = Object.keys(customItemUpdaters);

class Shop {
  constructor(items=[]){
    this.items = items;
  }
  
  updateQuality() {
    for (var i = 0; i < this.items.length; i++) {
      const nextItem = this.items[i];
      let updater = standardItemUpdater;
      // Check for a special updater matching this item's name.
      for (var i in customItemTypes) {
        if (nextItem.name.toLowerCase().includes(customItemTypes[i])) {
          updater = customItemUpdaters[customItemTypes[i]];
        }
      }
      // Apply the updater (standard or whatever we found in the map) to the item.
      this.items[i] = updater(nextItem);
    }
    return this.items;
  }
}
module.exports = {
  Item,
  Shop
}
