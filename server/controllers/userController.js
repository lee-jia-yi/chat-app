const User = require('../model/userModel');
const bcrypt = require('bcrypt');

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const usernameCheck = await User.findOne({ username });
        if (usernameCheck)
            return res.json({
                msg: "Username already used",
                status: false
            });

        const emailCheck = await User.findOne({ email });
        if (emailCheck) return res.json({
            msg: "Email already used",
            status: false
        });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            username,
            password: hashedPassword,
            isOnline: true
        });

        delete user.password;
        return res.json({
            status: 200,
            user
        });
    } catch (ex) {
        next(ex);
    }
};


module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user)
            return res.json({
                msg: "No such user found",
                status: false
            });

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid)
            return res.json({
                msg: "Incorrect username or password",
                status: false
            });

        await User.findOneAndUpdate({ username }, {
            isOnline: true
        }
        );

        delete user.password;
        return res.json({
            status: 200,
            user
        });
    } catch (ex) {
        next(ex);
    }
};

module.exports.setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;

        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage,
        },
            { new: true }
        );

        return res.json({
            status: 200,
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage,
        });
    } catch (ex) {
        next(ex);
    }
};

module.exports.getAllUsers = async (req, res, next) => {
    try {
        // selects all users, excluding current id
        const users = await User.find({ _id: { $ne: req.params.id } }).select([
            "email",
            "username",
            "avatarImage",
            "_id",
            "isOnline",
            "lastSeenAt"
        ]);
        // only select these, not passwords
        return res.json(users);

    } catch (ex) {
        next(ex);
    }
};

module.exports.logout = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const lastSeenAt = req.body.lastSeenAt;

        const userData = await User.findByIdAndUpdate(userId, {
            lastSeenAt: lastSeenAt,
            isOnline: false
        }
            // ,{ new: true }
        );

        return res.json({
            status: 200,
            lastSeenAt: userData.lastSeenAt, isOnline: false
        });
    } catch (ex) {
        next(ex);
    }
};