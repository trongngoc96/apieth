const UserEntities = require('../entities/userEntities');

module.exports = ({
    classname: 'authServices',

    register: async (dataFind, dataInsert) => {
        const resultFind = await UserEntities.findOrCreate(dataFind, dataInsert);
        if (JSON.parse(resultFind).error) {
            return JSON.parse(resultFind).error;
        }

        return {
            "resultFind": JSON.parse(resultFind)
        }
    },

    login: async (data) => {
        try {
            const resultFind = await UserEntities.findOne(data);
            if (resultFind == null) {
                return null;
            }

            return {
                "resultFind": JSON.parse(resultFind)
            }
        } catch (err) {
            return err;
        }
    }
})