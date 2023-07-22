require('dotenv').config();
const axios = require("axios");
const {Product, Category} = require("../db");
const { API_TOOLS_URL, API_CATEGORIES_URL } = process.env;

const getToolsApi = async () => {
const response = await axios.get(API_TOOLS_URL)
const tools = response.data;
return tools;
};

const getCategoriesApi = async () => {
    const response = await axios.get(API_CATEGORIES_URL)
    const categories = response.data;
    return categories;
}

const createDbTools = async () => {
    const tools = await getToolsApi();
    for (const tool of tools) {
        await Product.findOrCreate({
            where: {id: tool.id},
            defaults: {
                brand: tool.brand,
                name: tool.name,
                model: tool.model,
                feature: tool.feature,
                detail: tool.detail,
                price: tool.price,
                image: tool.image,
                category: tool.category.map((e)=>e.name),
            }
        })
    }
}

const createDbCategories = async () => {
    const categories = await getCategoriesApi();
    for (const category of categories) {
        await Category.findOrCreate({
            where: {id: category.id},
            defaults: {
                name: category.name,
            }
        })
    }
}

module.exports = {
    createDbTools,
    createDbCategories
}