const generalHelper = require('./../helpers/general.helper');

module.exports = (req, res) => {
    const data = {
        dateFormat: appEnum.dateFormat.toJSON(),
        userType: appEnum.userType.toJSON(),
        userAuth: appEnum.userAuth.toJSON(),
        productType: appEnum.productType.toJSON()
    };

    generalHelper.response.success(res, data);
}