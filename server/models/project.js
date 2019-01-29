

module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
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
    title: {
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
    mindmapId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    nodeId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    progress: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    startAt: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    endAt: {
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
    tableName: 'Projects'
  });

  Project.associate = (models) => {
    Project.belongsTo(models.Organization, {
      foreignKey: 'orgId',
      onDelete: 'cascade'
    });
  };

  return Project;
};



