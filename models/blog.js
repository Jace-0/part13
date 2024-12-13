const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Blog extends Model {}

Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    allowNull: true

  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: 1991,
        msg: "Year must be at least 1991"
      },
      max: {
        args: new Date().getFullYear(),
        msg: `Year cannot be greater than ${new Date().getFullYear()}`
      }
    }
  },

  userId: {
    type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'blog'
})

module.exports = Blog