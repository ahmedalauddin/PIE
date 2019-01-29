/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('database', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    org_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    source_file: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    created_at: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'database'
  });
};
