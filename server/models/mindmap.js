/* jshint indent: 2 */

/* define the model for the Mindmap table */
module.exports = (sequelize, DataTypes) => {
  const Mindmap = sequelize.define(
    "Mindmap",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      orgId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          table: "Organizations",
          key: "id"
        }
      },
      mapData: {
        type: DataTypes.JSON,
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
    },
    {
      tableName: "Mindmaps"
    }
  );

  /* set up the associations */
  Mindmap.associate = models => {
    Mindmap.belongsTo(models.Organization, {
      foreignKey: "orgId",
      onDelete: "cascade"
    });
  };

  /* return the model */
  return Mindmap;
};
