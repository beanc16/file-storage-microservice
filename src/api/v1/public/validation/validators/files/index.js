const getValidators = require("./get");
const uploadValidators = require("./upload");
//const updateValidators = require("./update");
//const deleteValidators = require("./delete");



module.exports = {
    ...getValidators,
    ...uploadValidators,
    //...updateValidators,
    //...deleteValidators,
};