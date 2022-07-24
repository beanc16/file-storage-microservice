const getSchemas = require("./get");
const uploadSchemas = require("./upload");
const renameSchemas = require("./rename");
const deleteSchemas = require("./delete");



module.exports = {
    ...getSchemas,
    ...uploadSchemas,
    ...renameSchemas,
    ...deleteSchemas,
};
