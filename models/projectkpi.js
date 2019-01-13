/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('projectkpi', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    project_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    kpi_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'projectkpi'
  });
};
