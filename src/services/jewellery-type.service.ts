import { Op, Transaction } from 'sequelize';
import { PaginatedJewelleryTypes } from '../interfaces/jewellery-type.interfaces';
import { JewelleryType } from '../models/jewellery-type.model';

const getAllJewelleryTypes = async (search?: string, status?: string): Promise<JewelleryType[]> => {
    const whereClause: any = { is_deleted: false };

    if (search) {
        whereClause.type_name = { [Op.like]: `%${search}%` };
    }

    if (status) {
        whereClause.status = status;
    }

    return await JewelleryType.findAll({
        where: whereClause,
        attributes: ['id', 'type_name', 'image_url', 'status', 'created_at'],
        order: [['created_at', 'DESC']]
    });
};

const getAllJewelleryTypesPaginated = async (page: number = 1, limit: number = 10, search?: string, status?: string): Promise<PaginatedJewelleryTypes> => {
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = { is_deleted: false };
    if (search) {
        whereClause.type_name = { [Op.like]: `%${search}%` };
    }
    if (status) {
        whereClause.status = status;
    }

    const { count, rows: jewellery_types } = await JewelleryType.findAndCountAll({
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

const findJewelleryTypeById = async (id: string, transaction?: Transaction) => {
    return await JewelleryType.findOne({
        where: { id, is_deleted: false },
        attributes: ['id', 'type_name', 'image_url', 'status', 'created_at', 'updated_at'],
        transaction
    });
};

const findJewelleryTypeByName = async (type_name: string, excludeId?: string) => {
    const whereClause: any = { type_name, is_deleted: false };
    if (excludeId) whereClause.id = { [Op.ne]: excludeId };
    return await JewelleryType.findOne({
        where: whereClause,
        attributes: ['id', 'type_name', 'status', 'created_at'],
    });
};

const createJewelleryType = async (data: Partial<JewelleryType>, transaction: Transaction) => {
    return await JewelleryType.create(data, { transaction });
};

const updateJewelleryType = async (id: string, data: Partial<JewelleryType>, transaction: Transaction) => {
    const [affected] = await JewelleryType.update(data, { where: { id }, transaction });
    return affected;
};

const deleteJewelleryType = async (id: string, transaction: Transaction) => {
    const [affected] = await JewelleryType.update({ is_deleted: true }, { where: { id }, transaction });
    return affected;
};

export default {
    getAllJewelleryTypes,
    getAllJewelleryTypesPaginated,
    findJewelleryTypeById,
    findJewelleryTypeByName,
    createJewelleryType,
    updateJewelleryType,
    deleteJewelleryType,
};

