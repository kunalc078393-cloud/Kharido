import userModel from "../models/users.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../config/config.js"
import sessionModel from "../models/session.model.js";


export async function register(req, res) {
    const { fullName, email, password } = req.body;
    console.log(req.body);

    const isUserRegistered = await userModel.findOne({email})

    if (isUserRegistered) {
        return res.status(409).json({
            "message": "the fullName or email already exist , please try again with a different one ."
        });
    }

    const hashedPassword = crypto.createHash("sha256").update(password).digest('hex');
    const user = await userModel.create({
        fullName,
        email,
        password: hashedPassword
    })


    const refreshToken = jwt.sign(
        {
            id: user._id,
        },
        config.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    )

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest('hex');

    const session = await sessionModel.create({
        user: user.id,
        refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
    })

    const accessToken = jwt.sign(
        {
            id: user._id,
            sessionId: session._id
        },
        config.JWT_SECRET,
        {
            expiresIn: "15m"
        }
    )


    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000

    });

    res.status(201).json({
        message: "user registered successfully",
        user: {
            email: user.email,
            fullName: user.fullName
        },
        accessToken
    });

}

export async function login(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
   

    if (!user) {
        return res.status(400).json({
            message: "User not found",

        });
    }

    const hashedPassword = crypto.createHash("sha256").update(password).digest('hex');


    const isPasswordCorrect = hashedPassword == user.password;

    if (!isPasswordCorrect) {
        return res.status(400).json({
            message: "Invalid password"
        })
    }

    const refreshToken = jwt.sign(
        { id: user._id },
        config.JWT_SECRET,
        {
            expiresIn: '7d'
        }
    )

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest('hex');

    const session = await sessionModel.create({
        user: user._id,
        refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers['user-agent']

    });

    const accessToken = jwt.sign(
        {
            id: user._id,
            sessionId: session._id,
        },
        config.JWT_SECRET,
        {
            expiresIn: "10m"
        }

    )

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000

    })

    res.status(200).json({
        message: "Logged in successfully",
        accessToken
    })

}

export async function getme(req, res) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            message: 'token not found',
        })
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);

    } catch (error) {
        res.status(401).json({
            message: "Invalid token"
        })

    }


    const user = await userModel.findOne({ _id: decoded.id });
    return res.status(200).json({
        message: "user fetched successfully",
        user: {
            fullName: user.fullName,
            email: user.email
        }
    });
}

export async function refreshToken(req, res) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            message: "Refresh Token not found"
        });
    }
    
    let decoded;

    try {
        decoded = jwt.verify(refreshToken, config.JWT_SECRET);

    } catch (error) {
        return res.status(401).json({
            "message":"Invalid or expired refresh Token"
        })
        
    }



    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest('hex');

    const session = await sessionModel.findOne({ refreshTokenHash, revoked: false });

    if (!session) {
        return res.status(401).json({
            message: "Invalid Refresh token"

        })
    }



    const newRefreshToken = jwt.sign(
        { id: decoded.id },
        config.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );

    const newRefreshTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');

    session.refreshTokenHash = newRefreshTokenHash;
    await session.save();




    const accessToken = jwt.sign(
        { id: decoded.id, sessionId : session._id },
        config.JWT_SECRET,
        {
            expiresIn: '15m'
        }


    )

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        message: "Acess token is generated",
        accessToken
    })

}

export async function logout(req, res) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(400).json({
            message: "Refresh Token not found",
        })
    }

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest('hex');

    const session = await sessionModel.findOne({ refreshTokenHash, revoked: false });

    if (!session) {
        return res.status(401).json({
            message: "Invalid Refresh Token "
        })
    }

    session.revoked = true;
    await session.save();

    res.clearCookie("refreshToken");

    res.status(200).json({
        message: "Logout successfully"
    })

}

export async function logoutAll(req, res) {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(400).json({
            message: "Refresh Token not found",
        })
    }

    const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

    await sessionModel.updateMany({ user: decoded.id, revoked: false }, { revoked: true });

    res.clearCookie("refreshToken");

    res.status(200).json({
        message: "Logout from all the devices successfully"
    });
}