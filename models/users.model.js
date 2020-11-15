module.exports = mongoose => {
    const Users = mongoose.model(
        "users",
        mongoose.Schema(
            {
                username: String,
                password: String,
                first: String,
                last: String,
                scheduleid: String,
                provider: Boolean
            },
            { strict: false }
        )
    );

    return Users;
};