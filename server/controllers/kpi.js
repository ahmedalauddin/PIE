const Kpi = require("../models").default.Kpi;
const Organization = require("../models").default.Organization;

module.exports = {
  create(req, res) {
    return Kpi.create({
      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
      level: req.body.level,
      status: req.body.status,
      orgId: req.body.orgId
    })
      .then(kpi => res.status(201).send(kpi))
      .catch(error => {
        console.log(error.stack);
        res.status(400).send(error);
      });
  },

  // Update a Kpi
  update(req, res) {
    const id = req.params.id;
    return Kpi.update(
      {
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
        level: req.body.level,
        status: req.body.status,
        orgId: req.body.orgId,
        createdAt: req.body.createdAt,
        updatedAt: req.body.updatedAt
      },
      {
        returning: true,
        where: {
          id: id
        }
      }
    )
      .then(kpi => res.status(200).send(kpi))
      .catch(error => {
        console.log(error.stack);
        res.status(400).send(error);
      });
  },

  // Find a Kpi by Id
  findById(req, res) {
    return Kpi.findByPk(req.params.id, {
      include: [
        {
          model: Organization,
          as: "Organization"
        }
      ]
    })
      .then(kpi => res.status(200).send(kpi))
      .catch(error => {
        console.log(error.stack);
        res.status(400).send(error);
      });
  },

  // List all persons
  list(req, res) {
    return Kpi.findAll({
      include: [
        {
          model: Organization,
          as: "Organization"
        }
      ]
    })
      .then(kpi => res.status(200).send(kpi))
      .catch(error => {
        console.log(error.stack);
        res.status(400).send(error);
      });
  }
};
