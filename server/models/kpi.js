/* jshint indent: 2 */

module.exports = (sequelize, DataTypes) => {
    const Kpi = sequelize.define('Kpi', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        level: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        type: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
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
        tableName: 'Kpis'
    });

    Kpi.associate = (models) => {
        Kpi.belongsTo(models.Organization, {
            foreignKey: 'orgId',
            onDelete: 'cascade'
        });
    };

    return Kpi;
};

