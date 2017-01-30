 /**
 * Created by peter on 4/27/16.
 */
import moment from "moment";

export default async function(db){
  // 10 vest
  var vest10 = await db.Kitchen.create({
    name: '10 Vest'
  });
  var peter = await db.User.create({
    display_name: 'Peter Alexander Garnæs',
    picture: null,
    room_number: '1006',
    active: true,
    kitchen_admin: true
  });
  var peter_account = await db.UserAccount.create({
    email: 'petergarnaes@gmail.com',
    email_confirmed: true,
    username: 'peterg',
    // Password is 'hello'
    password_hash: '$2a$10$35fWpFBd3on2JTyRxmdhaefp79j6vqmstpOFN2DIyYOsIrm9tKwNG'
  });
  peter_account.setUser(peter);
  peter.setAccount(peter_account);
  var trine = await db.User.create({
    display_name: 'Trine Fryjana Theede',
    picture: null,
    room_number: '1001',
    active: true,
    kitchen_admin: false
  });
  var erik = await db.User.create({
    display_name: 'Erik Gräs',
    picture: null,
    room_number: '1009',
    active: true,
    kitchen_admin: false
  });
  var maria = await db.User.create({
    display_name: 'Maria Damm',
    picture: null,
    room_number: '1015',
    active: true,
    kitchen_admin: false
  });
  var julie = await db.User.create({
    display_name: 'Julie Kroer',
    picture: null,
    room_number: '1014',
    active: true,
    kitchen_admin: false
  });
  var andreas = await db.User.create({
    display_name: 'Andreas Baun',
    picture: null,
    room_number: '1005',
    active: true,
    kitchen_admin: false
  });
  var astrid = await db.User.create({
    display_name: 'Astrid Keitum',
    picture: null,
    room_number: '1004',
    active: true,
    kitchen_admin: false
  });
  var frida = await db.User.create({
    display_name: 'Frida Sejten',
    picture: null,
    room_number: '1002',
    active: true,
    kitchen_admin: false
  });
  var thorbjorn = await db.User.create({
    display_name: 'Thorbjørn Wolf',
    picture: null,
    room_number: '1002',
    active: true,
    kitchen_admin: false
  });

  vest10.setAdmin(peter);

  vest10.addMember([peter,maria,trine,erik,julie,andreas,astrid,frida,thorbjorn]);

  var madklub1 = await db.DinnerClub.create({
    at: moment().set({'hour':19,'minute':0,'second':0}).toISOString(),
    cancelled: false,
    total_cost: 75.0,
    meal: 'Kaviar'
  });
  madklub1.setCook(peter);
  [erik,trine,maria,julie,andreas,astrid,peter].forEach(async function (user) {
    var part = await db.Participation.create({
      guest_count: 0
    });
    part.setUser(user);
    part.setDinnerClub(madklub1);
  });
  vest10.addDinnerclub(madklub1);

  var madklub2 = await db.DinnerClub.create({
    at: moment().set({'hour':19,'minute':0,'second':0}).day(1).toISOString(),
    cancelled: false,
    total_cost: 110.0,
    meal: 'Foie Gras'
  });
  madklub2.setCook(astrid);
  [erik,trine,maria,julie,andreas,astrid,peter].forEach(async function (user) {
    var part = await db.Participation.create({
      guest_count: 0
    });
    part.setUser(user);
    part.setDinnerClub(madklub2);
  });
  vest10.addDinnerclub(madklub2);

  var madklub3 = await db.DinnerClub.create({
    at: moment().set({'hour':19,'minute':0,'second':0}).day(2).toISOString(),
    cancelled: false,
    total_cost: 10.0,
    meal: 'Boller i karry'
  });
  madklub3.setCook(frida);
  [erik,trine,maria,julie,andreas,astrid,peter].forEach(async function (user) {
    var part = await db.Participation.create({
      guest_count: 0
    });
    part.setUser(user);
    part.setDinnerClub(madklub3);
  });
  vest10.addDinnerclub(madklub3);

  var ost4 = await db.Kitchen.create({
    name: '4 Øst'
  });
}
