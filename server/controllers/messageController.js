const Messages = require('../model/messageModel');
var moment = require('moment');

module.exports.addMessage = async (req, res, next) => {
    try {
        const { from, to, message } = req.body;
        const data = await Messages.create({
            message: {
                text: message
            },
            users: [from, to],
            sender: from,
        });

        if (data) return res.json({
            msg: "Message added successfully"
        });

        return res.json({
            msg: "Failed to add message to database"
        });

    } catch (ex) {
        next(ex);
    }
};

module.exports.getMessages = async (req, res, next) => {
    try {
        const { from, to } = req.body;
        const messages = await Messages.find({
            users: {
                $all: [from, to]
            },
        })
            .sort({ updatedAt: 1 }); // asc

        const projectMessages = messages.map((msg) => {
            var createdDate = moment(msg.createdAt).format('YYYY-MM-DD');
            var createdTime = moment(msg.createdAt).format("h:mma");
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
                createdDate: createdDate,
                createdTime: createdTime
            };
        });
        return res.json(projectMessages);

    } catch (ex) {
        next(ex);
    }
};
