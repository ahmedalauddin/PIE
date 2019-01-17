/* jshint indent: 2 */

module.exports = (sequelize, DataTypes) => {
    const ClientProject = sequelize.define('ClientProject', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        orgId: {
            type: DataTypes.INTEGER,
            references: {
                table: 'organization',
                key: 'id'
            },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        businessGoal: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        progress: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        startDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        endDate: {
            type: DataTypes.DATEONLY,
            allowNull: true,
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
        tableName: 'clientproject'
    });

    ClientProject.associate = (models) => {
        ClientProject.belongsTo(models.Organization, {
            foreignKey: 'orgId',
            onDelete: 'cascade'
        });
    };

    return ClientProject;
};

