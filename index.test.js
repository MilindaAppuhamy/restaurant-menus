const { sequelize } = require("./db");
const { Restaurant, Menu, Item } = require("./models/index");
const { seedRestaurant, seedMenu, seedItem } = require("./seedData");

describe("Restaurant and Menu Models", () => {
  /**
   * Runs the code prior to all tests
   */
  beforeAll(async () => {
    // the 'sync' method will create tables based on the model class
    // by setting 'force:true' the tables are recreated each time the
    // test suite is run
    await sequelize.sync({ force: true });
  });

  test("can create a Restaurant", async () => {
    const restaurant = await Restaurant.create(seedRestaurant[0]);
    expect(restaurant.name).toEqual("AppleBees");
    expect(restaurant.location).toEqual("Texas");
    expect(restaurant.cuisine).toEqual("FastFood");
  });

  test("can create a Menu", async () => {
    const menu = await Menu.create(seedMenu[0]);
    expect(menu.title).toEqual("Breakfast");
  });

  test("can find Restaurants", async () => {
    await Restaurant.create(seedRestaurant[1]);
    const result = await Restaurant.findAll({
      where: {
        name: "LittleSheep",
      },
    });
    expect(result[0].name).toEqual("LittleSheep");
    expect(result[0].location).toEqual("Dallas");
    expect(result[0].cuisine).toEqual("Hotpot");
  });

  test("can find Menus", async () => {
    await Menu.create(seedMenu[1]);
    const result = await Menu.findAll({
      where: {
        title: "Lunch",
      },
    });
    expect(result[0].title).toEqual("Lunch");
  });

  test("can delete Restaurants", async () => {
    await Restaurant.create(seedRestaurant[2]);
    const result = await Restaurant.findAll({
      where: {
        cuisine: "Indian",
      },
    });
    const deleted = await result[0].destroy();
    expect(result[0]).toEqual(deleted);
  });

  test("can create an Item", async () => {
    const item = await Item.create(seedItem[0]);
    expect(item.name).toEqual("bhindi masala");
    expect(item.image).toEqual("someimage.jpg");
    expect(item.price).toEqual(9.5);
    expect(item.vegetarian).toEqual(true);
  });

  test("can find an Item", async () => {
    const item = await Item.findByPk(1);
    expect(item.name).toEqual("bhindi masala");
    expect(item.image).toEqual("someimage.jpg");
    expect(item.price).toEqual(9.5);
    expect(item.vegetarian).toEqual(true);
  });

  test("can update an Item", async () => {
    const item = await Item.findByPk(1);
    await item.update({
      name: "McPlant",
    });
    expect(item.name).toEqual("McPlant");
  });

  test("can delete an Item", async () => {
    const item = await Item.findByPk(1);
    const deleted = await item.destroy();
    expect(deleted).toEqual(item);
  });
});

describe("eager loading tests", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  test("can query menus from item as author", async () => {
    const item1 = await Item.create(seedItem[0]);
    const item2 = await Item.create(seedItem[1]);
    const menu1 = await Menu.create(seedMenu[0]);
    const menu2 = await Menu.create(seedMenu[1]);
    const menu3 = await Menu.create(seedMenu[2]);
    const menu4 = await Menu.create(seedMenu[3]);
    await item1.setMenus([menu1, menu2]);
    await item2.setMenus([menu3, menu4]);

    const itemsInMenus = await Item.findAll({
      include: [{ model: Menu, as: "Menus" }],
    });
    //console.log(JSON.stringify(itemsInMenus, null, 2));
    expect(itemsInMenus.length).toBe(2);
  });

  test("can query menus from item as author", async () => {
    const menu1 = await Menu.findByPk(1);
    const menu2 = await Menu.findByPk(2);
    const item1 = await Item.findByPk(1);
    const item2 = await Item.findByPk(2);
    const item3 = await Item.create(seedItem[2]);

    await menu1.setItems([item1, item2]);
    await menu2.setItems([item1, item2, item3]);

    const menusWithItem = await Menu.findAll({
      include: [{ model: Item, as: "Items" }],
    });
    //console.log(JSON.stringify(menusWithItem, null, 2));
    expect(menusWithItem.length).toBe(4);
  });
});
