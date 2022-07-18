const getSchemas = require("./get");
const uploadSchemas = require("./upload");
const deleteSchemas = require("./delete");



module.exports = {
    ...getSchemas,
    ...uploadSchemas,
    ...deleteSchemas,
};
