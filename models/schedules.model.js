module.exports = mongoose => {
    const Schedules = mongoose.model(
        "schedules",
        mongoose.Schema(
            {
                appointments: [
                    {
                        date: Date,
                        with: String
                    },
                ]
            },
            { strict: false }
        )
    );

    return Schedules;
};