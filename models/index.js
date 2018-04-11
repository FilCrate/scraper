const Sequelize = require('sequelize');
const sequelize = new Sequelize('filcrate_db', 'filcrate', 'password', {
    host: 'localhost',
    dialect: 'postgres',
    operatorsAliases: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
});

// load models                 
var models = [                 
    'Products',            
];
models.forEach(function(model) {
    module.exports[model] = sequelize.import(__dirname + '/' + model);
});