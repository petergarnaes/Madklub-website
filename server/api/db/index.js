/**
 * Created by peter on 1/20/17.
 */

var fs              = require("fs");
var path            = require("path");
var Sequelize       = require("sequelize");
var env             = process.env.NODE_ENV || "development";
var {databaseUrl} = require("../../config");
// When developing and using sqlite3, we must use the storage option, or else it
// defaults to memory, which means it is volatile
var options = (process.env.NODE_ENV == "development") ? {storage: './madklub.db'} : {};
var sequelize = new Sequelize(databaseUrl,options);
var db        = {};

// Using require instead of file approach, as webpack will bundle it correctly
let models = [require("./user"),
    require("./kitchen"),
    require("./dinnerclub"),
    require("./participation"),
    require("./user_account"),
    require("./user_claim"),
    require("./user_profile"),
    require("./period")];

models.forEach(function(model) {
    let m = model(sequelize,Sequelize.DataTypes);
    console.log(m.name);
    db[m.name] = m;
});

Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;