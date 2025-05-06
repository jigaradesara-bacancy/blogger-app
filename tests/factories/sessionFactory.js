const Buffer = require('safe-buffer').Buffer;
const Keygrip = require('keygrip');
const keys = require('../../config/keys');
const keygrip = new Keygrip([keys.cookieKey]);

module.exports = (user) => {
    const sessioObj = {
        passport: {
            user: user._id.toString()
        }
    };

    const session = Buffer.from(JSON.stringify(sessioObj)).toString('base64');

    const sig = keygrip.sign('session=' + session);

    return { session, sig }
};
