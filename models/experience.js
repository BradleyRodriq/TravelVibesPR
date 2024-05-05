class Experience extends Base {
    constructor(name, description, vibe, ratings, reviews, location) {
        super(name, description, vibe);
        this.ratings = ratings;
        this.reviews = reviews;
        this.location = location;
    }
}

module.exports = Experience;
