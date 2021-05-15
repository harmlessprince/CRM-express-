const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = () => {
    ac.grant('user').readOwn('profile').updateOwn('profile')
    ac.grant('company').extend('user').readOwn('profile')
    ac.grant('admin').extend('user').extend('company').updateAny('profile').deleteAny('profile')
    console.log(ac);
    return ac;
};