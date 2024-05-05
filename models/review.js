class Review {
    constructor(user_id, experience_id, rating, vibe, comment) {
        this.user_id = user_id;
        this.experience_id = experience_id;
        this.rating = rating;
        this.vibe = vibe;
        this.comment = comment;
    }
}

module.exports = Review;
