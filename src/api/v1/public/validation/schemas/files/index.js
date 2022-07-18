const getSchemas = require("./get");
const uploadSchemas = require("./upload");



module.exports = {
    ...getSchemas,
    ...uploadSchemas,
};
