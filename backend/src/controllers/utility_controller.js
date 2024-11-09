'use-strict';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const logger = require('../helpers/ecs_log');

const listPaginate = async (model, page, limit, attributes, conditions, orderby) => {

    try {
        const offset = (page - 1) * limit;
        let obj = {
            limit: limit,
            offset: offset
        }
        logger.debug('alert_groups')
        if (conditions) 
            obj["where"] = conditions;
        
        if (attributes) 
            obj["attributes"] = attributes
        
        if (orderby) 
            obj["order"] = orderby

        return await model.findAndCountAll(obj);
    } catch (error) {
        logger.error(error);
        return undefined;
    }

};

const listSearchPaginate = async (model, page, limit, search, attributes, conditions) => {
    const offset = (page - 1) * limit;
    let obj = {
        limit: limit,
        offset: offset
    };
    if (conditions) 
        obj["where"] = conditions;
    
    obj["where"]["name"] = {
        [Op.like]: `%${search}%`
    }
    if (attributes) 
        obj['attributes'] = attributes
    
    const response = await model.findAndCountAll(obj);
    return response;
};
const list = async (model, sortByColumn, attributes, conditions) => {
    try {
        logger.debug('comming controller')
        let obj = {
            order: [sortByColumn]
        }
        if (attributes) 
            obj["attributes"] = attributes
        
        if (conditions) 
            obj["where"] = conditions
        
        result = await model.findAndCountAll(obj);
        logger.debug("result", result);
        return result;
    } catch (error) {
        logger.error(error);
        return undefined;

    }

}
const raw = async (model, sortByColumn, attributes, conditions) => {
    try {
        logger.debug('comming controller')
        let obj = {
            order: [sortByColumn]
        }
        if (attributes) 
            obj["attributes"] = attributes
        
        if (conditions) 
            obj["where"] = conditions
        
        obj["raw"] = true
        result = await model.findAndCountAll(obj);
        return result;
    } catch (error) {
        logger.error(error);
        return undefined;

    }

}
const listWithOutCount = async (model, sortByColumn, conditions, attributes) => {
    try {
        logger.debug('comming controller')
        let obj = {
            order: [sortByColumn]
        }
        if (attributes) 
            obj["attributes"] = attributes
        
        if (conditions) 
            obj["where"] = conditions

        result = await model.findAll(obj);
        logger.debug("result", result);
        return result;
    } catch (error) {
        logger.error(error);
        return undefined;

    }
}

const insert = async (model, values) => {
    try {
        const result = await model.create(values);
        return result;
    } catch (error) {
        logger.error(error);
        return undefined;
    }
}

const bulkCreate = async (model, arrayValues) => {
    try {
        const result = await model.bulkCreate(arrayValues, {ignoreDuplicates: true});
        // logger.debug("-------------------------------------------------queue metrics insertion");
        return result;
    } catch (error) {
        logger.error(error);
        return undefined;
    }
}

const remove = async (model, values) => {
    try {
        logger.debug({where: values});
        logger.debug(model)
        logger.debug(values)
        const response = await model.destroy({where: values});
        logger.debug("response --- ", response);
        return response;
    } catch (error) {
        logger.error("Error in remove", error);
        return undefined;
    }
}
const fetchWithCondition = async (model, values, attributes) => {
    try {
        let obj = {
            where: values
        };
        if (attributes) 
            obj["attributes"] = attributes

        return model.findOne(obj);
    } catch (error) {
        logger.error("Error in fetchWithCondition", error);
        return undefined;
    }

}
const fetchAllCondition = async (model, values, attributes) => {
    try {
        let obj = {
            where: values
        };
        if (attributes) 
            obj["attributes"] = attributes

        return model.findAll(obj);
    } catch (error) {
        logger.error("Error in fetchWithCondition", error);
        return undefined;
    }
}
const update = async (model, id, values) => {
    try {

        logger.debug(id, values);
        const [, result] = await model.update(values, {
            where: id,
            returning: ['*']
        });
        // logger.debug(result);
        if (result == []) 
            return true;
        
        // logger.debug(result)
        const oldValue = result[0]._previousDataValues;
        const newValue = result[0].dataValues;
        return newValue;
    } catch (error) {
        logger.error("Error in update", error);
        return undefined
    }
}

const updateMany = async (model, conditions, values) => {
    try {
        const [, result] = await model.update(values, {
            where: conditions,
            returning: ['*']
        });
        logger.debug('updatemaney', result);
        if (result == []) 
            return true;
        
        return result;
    } catch (error) {
        logger.error("Error in updateMany", error);
        return undefined
    }
}
const get = async (model, values, attributes) => {
    try {
        let obj = {
            where: values
        }
        if (attributes) 
            obj["attributes"] = attributes
        
        const response = await model.findOne(obj);
        if (response) {
            return response;
        } else 
            return 'E404';
        


    } catch (error) {
        logger.error("Error in get", error);
        return undefined;
    }
}

const manual_additionalFilters = async (additionalFilters, search, searchKey) => {
    try {
        let extendedQuery = "";
        for (let each of additionalFilters) {
            let key = Object.keys(each)[0];
            if (key == undefined) 
                continue;
            

            let values = [];
            for (let eachValue of each[key]) {
                values.push(`'${eachValue}'`)
            }
            extendedQuery += ` and ${key} in (${
                values.join(',')
            })`
        }
        if (search) 
            extendedQuery += ` and ${searchKey} like %${search}% `
        
        logger.debug(extendedQuery);
        return extendedQuery;
    } catch (error) {
        logger.error("Error in manual_additionalFilters", error);
        return undefined;
    }
}

const incrementToken = async (model, values, conditions) => {
    try {
        const result = await model.increment(values, {where: conditions});
        return result
    } catch (error) {
        logger.error(error);
    }
}

module.exports = {
    listPaginate,
    listSearchPaginate,
    list,
    insert,
    fetchWithCondition,
    remove,
    update,
    get,
    fetchAllCondition,
    updateMany,
    bulkCreate,
    manual_additionalFilters,
    listWithOutCount,
    raw,
    incrementToken
};