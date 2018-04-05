var Sequelize = require("sequelize");

module.exports=function(sequelize, DataTypes){ 
    return Users = sequelize.define("Products", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          name: {
            type: Sequelize.STRING
          },
          image: {
            type: Sequelize.STRING
          },
          price: {
            type: Sequelize.DECIMAL
          },
          rating: {
            type: Sequelize.DECIMAL
          },
          stock: {
            type: Sequelize.INTEGER
          },
          category: {
            type: Sequelize.STRING
          },
          weight: {
            type: Sequelize.DECIMAL
          },
          sku: {
            type: Sequelize.STRING
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
          }
    }, {});
}