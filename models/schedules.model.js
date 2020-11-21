
module.exports = mongoose => {
    const Schedules = mongoose.model(
        "schedules",
        mongoose.Schema(
            {
                appointments: [
                    {
                        date: Date,
                        with: String,
                        zoom: {
                            meetingNumber: String,
                            apiKey: String,
                            apiSecret: String,
                            password: String
                        }
                    },
                ]
            },
            { strict: false }
        )
    );

    return Schedules;
};