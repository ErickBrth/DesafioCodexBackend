const { createHash } = require('crypto');
const config = require('../../config');

class Token {
    constructor(token) {
        this.token = this.generateTokenHash(token);
        this.expire_at = this.setExpiration();
    }

    setExpiration() {
        let date = new Date();
        date.setSeconds(date.getSeconds() + parseInt(config.jwt.expiration));
        return date;
    }

    generateTokenHash(token) {
        return createHash('sha256')
            .update(token)
            .digest('hex');
    }
}

module.exports = Token;