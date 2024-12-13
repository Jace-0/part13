const { DataTypes, Sequelize } = require('sequelize')


module.exports = {
    up: async ({ context: queryInterface}) => {
        await queryInterface.createTable('blogs', {
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
            }
        })
        await queryInterface.createTable('users', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
              },
              username: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
                validate: {
                  isEmail: true
                }
              },
              name: {
                type: DataTypes.STRING,
                allowNull: false
            },
        })
        await queryInterface.addColumn('blogs', 'created_at', {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }),

        await queryInterface.addColumn('blogs', 'updated_at', {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        })
        await queryInterface.addColumn('users', 'created_at', {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }),

        await queryInterface.addColumn('users', 'updated_at', {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        })
    },
    down : async ({ context: queryInterface }) => {
        await queryInterface.dropTable('blogs')
        await queryInterface.dropTable('users')
    }
}