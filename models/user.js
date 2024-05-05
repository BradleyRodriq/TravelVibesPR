class User extends Base {
    constructor(username, email, password, vibe) {
        super(username, email, password, vibe);
        this.username = username;
        this.email = email;
        this.password = password;
    }
}

module.exports = User;
