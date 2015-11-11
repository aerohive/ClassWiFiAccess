var User = require("./../models/user");
var api_req = require('./../bin/ah_api/req');
var Api = require("./../models/api");
var School = require("./../models/school");

module.exports = function (router, isAuthenticated) {
    /* GET Home Page */
    router.get('/device/', isAuthenticated, function (req, res, next) {
        School.getAll(null, function (err, schools) {
            Api.findAll({SchoolId: req.session.SchoolId}, null, function (err, apiList) {
                if (apiList){
                    var apiNum = 0;
                    var deviceList = [];
                    for (var i = 0; i < apiList.length; i++) {
                        api_req.getDevices(apiList[i], function (devices) {
                            deviceList = deviceList.concat(devices);
                            apiNum++;
                            if (apiNum == apiList.length) {
                                res.render('device', {
                                    deviceList: deviceList,
                                    user: req.user,
                                    session: req.session,
                                    schoolList: schools,
                                    user_button: req.translationFile.user_button,
                                    apiList: req.apiList
                                });
                            }
                        }.bind(this));
                    }
                } else {
                    res.render('device', {
                        deviceList: null,
                        user: req.user,
                        session: req.session,
                        schoolList: schools,
                        user_button: req.translationFile.user_button,
                        apiList: req.apiList
                    });
                }
            });
        });
    });
};

