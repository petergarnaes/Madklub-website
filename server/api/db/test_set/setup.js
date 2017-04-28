/**
 * Created by peter on 4/28/17.
 */
var db = require('../index');
import testSet from './index';

db.sequelize.sync({force: true}).then(function(){
    console.log('Database cleaned');
    testSet(db);
    console.info('Database test set successfully synced!');
});

