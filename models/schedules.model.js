module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            appointments: [
                {
                    date: Date,
                    with: String
                },
            ]
        },
        { strict: false }
    );

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Schedules = mongoose.model("schedules", schema);
    return Schedules;
};