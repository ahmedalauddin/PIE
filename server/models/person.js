/* jshint indent: 2 */

module.exports = (sequelize, DataTypes) => {
    const Person = sequelize.define('Person', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        orgId: {
            type: DataTypes.INTEGER,
            references: {
                table: 'organization',
                key: 'id'
            },
        },
        hash: {
            type: Sequelize.STRING,
            allowNull: false
        },
        lastLogin: {
            type: Sequelize.DATE,
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'Persons'
    });


    Person.associate = (models) => {
        Person.belongsTo(models.Organization, {
            foreignKey: 'orgId',
            onDelete: 'cascade'
        });
    };

    return Person;
};

