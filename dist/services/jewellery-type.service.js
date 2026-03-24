"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const jewellery_type_model_1 = require("../models/jewellery-type.model");
const getAllJewelleryTypes = async (search, status) => {
    const whereClause = { is_deleted: false };
    if (search) {
        whereClause.type_name = { [sequelize_1.Op.like]: `%${search}%` };
    }
    if (status) {
        whereClause.status = status;
    }
    return await jewellery_type_model_1.JewelleryType.findAll({
        where: whereClause,
        attributes: ['id', 'type_name', 'image_url', 'status', 'created_at'],
        order: [['created_at', 'DESC']]
    });
};
const getAllJewelleryTypesPaginated = async (page = 1, limit = 10, search, status) => {
    const offset = (Number(page) - 1) * Number(limit);
    const whereClause = { is_deleted: false };
    if (search) {
        whereClause.type_name = { [sequelize_1.Op.like]: `%${search}%` };
    }
    if (status) {
        whereClause.status = status;
    }
    const { count, rows: jewellery_types } = await jewellery_type_model_1.JewelleryType.findAndCountAll({
        where: whereClause,
        attributes: ['id', 'type_name', 'image_url', 'status', 'created_at'],
        order: [['created_at', 'DESC']],
        limit: Number(limit),
        offset: Number(offset)
    });
    return {
        jewellery_types,
        pagination: {
            totalCount: count,
            currentPage: Number(page),
            totalPages: Math.ceil(count / Number(limit))
        }
    };
};
const findJewelleryTypeById = async (id, transaction) => {
    return await jewellery_type_model_1.JewelleryType.findOne({
        where: { id, is_deleted: false },
        attributes: ['id', 'type_name', 'image_url', 'status', 'created_at', 'updated_at'],
        transaction
    });
};
const findJewelleryTypeByName = async (type_name, excludeId) => {
    const whereClause = { type_name, is_deleted: false };
    if (excludeId)
        whereClause.id = { [sequelize_1.Op.ne]: excludeId };
    return await jewellery_type_model_1.JewelleryType.findOne({
        where: whereClause,
        attributes: ['id', 'type_name', 'status', 'created_at'],
    });
};
const createJewelleryType = async (data, transaction) => {
    return await jewellery_type_model_1.JewelleryType.create(data, { transaction });
};
const updateJewelleryType = async (id, data, transaction) => {
    const [affected] = await jewellery_type_model_1.JewelleryType.update(data, { where: { id }, transaction });
    return affected;
};
const deleteJewelleryType = async (id, transaction) => {
    const [affected] = await jewellery_type_model_1.JewelleryType.update({ is_deleted: true }, { where: { id }, transaction });
    return affected;
};
exports.default = {
    getAllJewelleryTypes,
    getAllJewelleryTypesPaginated,
    findJewelleryTypeById,
    findJewelleryTypeByName,
    createJewelleryType,
    updateJewelleryType,
    deleteJewelleryType,
};
