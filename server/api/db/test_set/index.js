 /**
 * Created by peter on 4/27/16.
 */
import moment from "moment";

export default async function(db){
    // 10 vest
    var vest10 = await db.Kitchen.create({
        name: '10 Vest'
    });

    var trine = await db.User.create({
        display_name: 'Trine Fryjana Theede',
        picture: null,
        room_number: '1001',
        active: true,
        kitchen_admin: false
    });
    var trine_account = await db.UserAccount.create({
        email: '1001@test',
        email_confirmed: true,
        username: 'thedeT',
        password_hash: '$2a$10$yR0aW1wUq8hXrxJeGZWh2urdGzSDa8/5h1wOgx/byNdJzYChwLGS.'
    });
    trine_account.setUser(trine);
    trine.setAccount(trine_account);

    var frida = await db.User.create({
        display_name: 'Frida Sejten',
        picture: null,
        room_number: '1002',
        active: true,
        kitchen_admin: false
    });
    var frida_account = await db.UserAccount.create({
        email: '1002@test',
        email_confirmed: true,
        username: 'Rotte snittern',
        password_hash: '$2a$10$IRGirbANpJxsu1Sf17YfnOSZtbO3SbrsbhyCeOifE2.lTiPS.z1ia'
    });
    frida_account.setUser(frida);
    frida.setAccount(frida_account);

    var erik = await db.User.create({
        display_name: 'Erik Stender Hornstrup',
        picture: null,
        room_number: '1003',
        active: true,
        kitchen_admin: false
    });
    var erik_account = await db.UserAccount.create({
        email: '1003@test',
        email_confirmed: true,
        username: 'Bobby',
        password_hash: '$2a$10$KWFnE1yO1g3TV2w9o1o52.bxsno9b/5lNzkQwz/HTivG0BIUABxeu'
    });
    erik_account.setUser(erik);
    erik.setAccount(erik_account);

    var rasmus = await db.User.create({
        display_name: 'Rasmus Krause Bidstrup',
        picture: null,
        room_number: '1004',
        active: true,
        kitchen_admin: false
    });
    var rasmus_account = await db.UserAccount.create({
        email: '1004@test',
        email_confirmed: true,
        username: 'Razzer',
        password_hash: '$2a$10$71B6ADmynQzgmsDa1ILKReRajS9AOI1x.OYXi7RZAzdyf8tc7KZpW'
    });
    rasmus_account.setUser(rasmus);
    rasmus.setAccount(rasmus_account);

    var nikolaj = await db.User.create({
        display_name: 'Nikolaj Kirkemann Skeem',
        picture: null,
        room_number: '1005',
        active: true,
        kitchen_admin: false
    });
    var nikolaj_account = await db.UserAccount.create({
        email: '1005@test',
        email_confirmed: true,
        username: 'Mr. Paradise',
        password_hash: '$2a$10$l9FYC55LaQVmbHDdl3zRMuUtg9gq6ZLZBKSIfFuu5wtlgrTaTlOk.'
    });
    nikolaj_account.setUser(nikolaj);
    nikolaj.setAccount(nikolaj_account);

    var peter = await db.User.create({
        display_name: 'Peter Alexander Garnæs',
        picture: null,
        room_number: '1006',
        active: true,
        kitchen_admin: true
    });
    var peter_account = await db.UserAccount.create({
        email: '1006@test',
        email_confirmed: true,
        username: 'Bager Far',
        // Password is room number
        password_hash: '$2a$10$svCkfaCvftvaZwXLp0/eg.mCK9Mclm6jgGeeHewXomLgXiOyhXm1S'
    });
    peter_account.setUser(peter);
    peter.setAccount(peter_account);

    var leif = await db.User.create({
        display_name: 'Leif Rasmussen',
        picture: null,
        room_number: '1008',
        active: true,
        kitchen_admin: false
    });
    var leif_account = await db.UserAccount.create({
        email: '1008@test',
        email_confirmed: true,
        username: 'Kage Far',
        // Password is room number
        password_hash: '$2a$10$Ff0l5Shxsj7Mec5LQsFnOOxds9fT1ldAJfay4HtjIFhdDWlx/VBUG'
    });
    leif_account.setUser(leif);
    leif.setAccount(leif_account);

    var bjornstjerne = await db.User.create({
        display_name: 'Bjørnstjerne Bachmann Nissen',
        picture: null,
        room_number: '1009',
        active: true,
        kitchen_admin: false
    });
    var bjornstjerne_account = await db.UserAccount.create({
        email: '1009@test',
        email_confirmed: true,
        username: 'Dr. Gunz',
        // Password is room number
        password_hash: '$2a$10$z5bInIbagr53kjsFRKOT2OJO5GgUrKSkQBlQ2pIf1WKa6iXQCWt8q'
    });
    bjornstjerne_account.setUser(bjornstjerne);
    bjornstjerne.setAccount(bjornstjerne_account);

    var signe = await db.User.create({
        display_name: 'Signe Johanne Rasmussen',
        picture: null,
        room_number: '1010',
        active: true,
        kitchen_admin: false
    });
    var signe_account = await db.UserAccount.create({
        email: '1010@test',
        email_confirmed: true,
        username: 'Dr. Dr.',
        // Password is 'hello'
        password_hash: '$2a$10$gTGB/iaFfoBtPlL7s158nODuOyS2NhU2O2LzfPyk8F0SqCEMbMIs6'
    });
    signe_account.setUser(signe);
    signe.setAccount(signe_account);

    var nicolai = await db.User.create({
        display_name: 'Nicolai Riis Lagedfoged',
        picture: null,
        room_number: '1011',
        active: true,
        kitchen_admin: false
    });
    var nicolai_account = await db.UserAccount.create({
        email: '1011@test',
        email_confirmed: true,
        username: 'Deloitte',
        // Password is 'hello'
        password_hash: '$2a$10$YdCGDd1Vwqx9cUw5Y01D8uWSLsbbwqOT1Tc/92LePrmo2q0vxgiI2'
    });
    nicolai_account.setUser(nicolai);
    nicolai.setAccount(nicolai_account);

    var soren = await db.User.create({
        display_name: 'Søren Kastrup',
        picture: null,
        room_number: '1012',
        active: true,
        kitchen_admin: false
    });
    var soren_account = await db.UserAccount.create({
        email: '1012@test',
        email_confirmed: true,
        username: 'Heey',
        // Password is 'hello'
        password_hash: '$2a$10$fz83ijWPPT2c5mpaBd/HeOqn7AuVbwrIHXFJPOzzaGaIPcz8u9IWy'
    });
    soren_account.setUser(soren);
    soren.setAccount(soren_account);

    var anne = await db.User.create({
        display_name: 'Anne Metta Tk',
        picture: null,
        room_number: '1013',
        active: true,
        kitchen_admin: false
    });
    var anne_account = await db.UserAccount.create({
        email: '1013@test',
        email_confirmed: true,
        username: 'The instructor',
        // Password is 'hello'
        password_hash: '$2a$10$RfmuPpXrk5LLiGaXyOC2ne/uinnkpQpfvCCVSyyfbu/U70t9/dZ7i'
    });
    anne_account.setUser(anne);
    anne.setAccount(anne_account);

    var julie = await db.User.create({
        display_name: 'Julie Kroer',
        picture: null,
        room_number: '1014',
        active: true,
        kitchen_admin: false
    });
    var julie_account = await db.UserAccount.create({
        email: '1014@test',
        email_confirmed: true,
        username: 'Lolland',
        // Password is 'hello'
        password_hash: '$2a$10$C/daFSyAoTa4vb63ULA4juo8uOFjRo2Zhe95R.VytqGsTHZ8lBKSm'
    });
    julie_account.setUser(julie);
    julie.setAccount(julie_account);

    var maria = await db.User.create({
        display_name: 'Maria Damm',
        picture: null,
        room_number: '1015',
        active: true,
        kitchen_admin: false
    });
    var maria_account = await db.UserAccount.create({
        email: '1015@test',
        email_confirmed: true,
        username: 'Te dammen',
        // Password is 'hello'
        password_hash: '$2a$10$h4Bm3wj5Jqq9KFLaSCDNSOJgg4tG4bGbtzd6uC9GstETnBDRLPWae'
    });
    maria_account.setUser(maria);
    maria.setAccount(maria_account);

    var nichlas = await db.User.create({
        display_name: 'Nichlas Halberg Madsen',
        picture: null,
        room_number: '1016',
        active: true,
        kitchen_admin: false
    });
    var nichlas_account = await db.UserAccount.create({
        email: '1016@test',
        email_confirmed: true,
        username: 'No Empire',
        // Password is 'hello'
        password_hash: '$2a$10$5rFjxDCotha4TNxaXXIE.OHL7a02UB7GjTQjW4Wfxby6rz/bh30tC'
    });
    nichlas_account.setUser(nichlas);
    nichlas.setAccount(nichlas_account);

    vest10.setAdmin(peter);

    const all_members = [trine,frida,erik,rasmus,nikolaj,peter,leif,bjornstjerne,signe,nicolai,soren,anne,julie,maria,nichlas];

    vest10.addMember([trine,frida,erik,rasmus,nikolaj,peter,leif,bjornstjerne,signe,nicolai,soren,anne,julie,maria,nichlas]);

    var madklub1 = await db.DinnerClub.create({
        at: moment().set({'hour':19,'minute':0,'second':0}).toISOString(),
        cancelled: false,
        total_cost: 75.0,
        meal: 'Kaviar'
    });
    madklub1.setCook(peter);
    all_members.forEach(async function (user) {
        var part = await db.Participation.create({
            guest_count: 0
        });
        part.setUser(user);
        part.setDinnerClub(madklub1);
    });
    vest10.addDinnerclub(madklub1);

    var madklub2 = await db.DinnerClub.create({
        at: (moment().add(1,'day')).set({'hour':19,'minute':0,'second':0}).toISOString(),
        cancelled: false,
        total_cost: 110.0,
        meal: 'Foie Gras'
    });
    madklub2.setCook(frida);
    all_members.forEach(async function (user) {
        var part = await db.Participation.create({
            guest_count: 0
        });
        part.setUser(user);
        part.setDinnerClub(madklub2);
    });
    vest10.addDinnerclub(madklub2);

    var madklub3 = await db.DinnerClub.create({
        at: (moment().add(2,'day')).set({'hour':19,'minute':0,'second':0}).toISOString(),
        cancelled: false,
        total_cost: 10.0,
        meal: 'Boller i karry'
    });
    madklub3.setCook(maria);
    all_members.forEach(async function (user) {
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