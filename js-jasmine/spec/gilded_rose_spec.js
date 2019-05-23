var {
  Shop,
  Item 
} = require("../src/gilded_rose.js");
// Remove `Shop` from the above import and uncomment the below to test the original.
// Note that the original Shop does not support Conjured-type items, so those tests will fail.
// var { Shop } = require("../src/original_gilded_rose.js");

describe("Gilded Rose Refactored Version", function() {
  it("should update a generic item: sellIn decrements by 1, quality decrements by 1", () => {
    const gildedRose = new Shop([new Item("foo", 1, 3)]);
    const items = gildedRose.updateQuality();
    expect(items[0].sellIn).toEqual(0);
    expect(items[0].quality).toEqual(2);
  });

  it("should update a generic item: when sellIn is 0 or less, quality decrements by 2", () => {
    const gildedRose = new Shop([new Item("foo", 0, 3)]);
    const items = gildedRose.updateQuality();
    expect(items[0].sellIn).toEqual(-1);
    expect(items[0].quality).toEqual(1);
  });

  it("should update a generic item: when sellIn is 0 or less, quality decrements by 2 and not to below 0", () => {
    const gildedRose = new Shop([new Item("foo", 0, 1)]);
    const items = gildedRose.updateQuality();
    expect(items[0].sellIn).toEqual(-1);
    expect(items[0].quality).toEqual(0);
  });

  describe("aged brie", () => {
    it("quality should always increase", () => {
      const gildedRose = new Shop([new Item("Aged Brie", 1, 2)]);
      let items = gildedRose.updateQuality();
      expect(items[0].sellIn).toEqual(0);
      expect(items[0].quality).toEqual(3);
      items = gildedRose.updateQuality();
      expect(items[0].sellIn).toEqual(-1);
      expect(items[0].quality).toEqual(5);
      items = gildedRose.updateQuality();
      expect(items[0].sellIn).toEqual(-2);
      expect(items[0].quality).toEqual(7);
    });

    it("quality should always increase, but never to above 50", () => {
      const gildedRose = new Shop([new Item("Aged Brie", 1, 49)]);
      let items = gildedRose.updateQuality();
      expect(items[0].sellIn).toEqual(0);
      expect(items[0].quality).toEqual(50);
      items = gildedRose.updateQuality();
      expect(items[0].sellIn).toEqual(-1);
      expect(items[0].quality).toEqual(50);
    });
  });

  it("should update Sulfuras: as a legendary item, it never changes", () => {
    const gildedRose = new Shop([
      new Item("Sulfuras, Hand of Ragnaros", 0, 80)
    ]);
    let items = gildedRose.updateQuality();
    expect(items[0].sellIn).toEqual(0);
    expect(items[0].quality).toEqual(80);
    items = gildedRose.updateQuality();
    expect(items[0].sellIn).toEqual(0);
    expect(items[0].quality).toEqual(80);
  });

  describe("backstage passes", () => {
    it("should increase in quality as sellIn decreases", () => {
      const gildedRose = new Shop([
        new Item("Backstage passes to a TAFKAL80ETC concert", 12, 12)
      ]);
      const items = gildedRose.updateQuality();
      expect(items[0].sellIn).toEqual(11);
      expect(items[0].quality).toEqual(13);
    });

    it("should increase in quality by 2 when 10 >= sellIn > 5", () => {
      const gildedRose = new Shop([
        new Item("Backstage passes to a TAFKAL80ETC concert", 10, 12)
      ]);
      let items = gildedRose.updateQuality();
      expect(items[0].sellIn).toEqual(9);
      expect(items[0].quality).toEqual(14);
      items = gildedRose.updateQuality();
      expect(items[0].sellIn).toEqual(8);
      expect(items[0].quality).toEqual(16);
    });

    it("should increase in quality by 3 when 5 >= sellIn > 0", () => {
      const gildedRose = new Shop([
        new Item("Backstage passes to a TAFKAL80ETC concert", 6, 20)
      ]);
      let items = gildedRose.updateQuality();
      expect(items[0].sellIn).toEqual(5);
      expect(items[0].quality).toEqual(22);
      items = gildedRose.updateQuality();
      expect(items[0].sellIn).toEqual(4);
      expect(items[0].quality).toEqual(25);
    });

    it("should have quality 0 when sellIn has passed", () => {
      const gildedRose = new Shop([
        new Item("Backstage passes to a TAFKAL80ETC concert", 1, 20)
      ]);
      let items = gildedRose.updateQuality();
      expect(items[0].sellIn).toEqual(0);
      expect(items[0].quality).toEqual(23);
      items = gildedRose.updateQuality();
      expect(items[0].sellIn).toEqual(-1);
      expect(items[0].quality).toEqual(0);
    });
  });

  it("should degrade Conjured items at double the standard quality per day", () => {
    const gildedRose = new Shop([new Item("Conjured treasure chest", 1, 20)]);
    let items = gildedRose.updateQuality();
    expect(items[0].sellIn).toEqual(0);
    expect(items[0].quality).toEqual(18);
    items = gildedRose.updateQuality();
    expect(items[0].sellIn).toEqual(-1);
    expect(items[0].quality).toEqual(14);
  });
});
