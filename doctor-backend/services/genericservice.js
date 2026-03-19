const { Op } = require('sequelize');

//create
const create = async (model, data) => {
  return await model.create(data);
};

//getall
const getAll = async (model) => {
  return await model.findAll();
};

//getone
const getById = async (model, id) => {
  return await model.findByPk(id);
};

//update
const update = async (model, id, updateData) => {
  const record = await model.findByPk(id);
  if (!record) {
    return null;
  }
  await record.update(updateData);
  return record;
};

//delete
const deleteById = async (model, id) => {
  const record = await model.findByPk(id);
  if (!record) {
    return false;
  }
  await record.destroy();
  return true;
};

// SEARCH for records by name (case-insensitive, starts-with)
const searchByName = async (model, query) => {
  return await model.findAll({
    where: {
      name: {
        [Op.iLike]: `${query}%`
      }
    }
  });
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  deleteById,
  searchByName,
};
