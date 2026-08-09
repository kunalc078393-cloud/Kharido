import dotenv from 'dotenv';

dotenv.config();

if(!process.env.MONGO_URI){
    throw new Error("MONGO URI is not defined in the envirnoment variables");
}
if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET is not defined in the environment variables")
}
if(!process.env.CLIENT_URL){
    throw new Error("CLIENT_URL is not defined in the environment variables");
}

const config = {
    MONGO_URI : process.env.MONGO_URI,
    JWT_SECRET : process.env.JWT_SECRET,
    CLIENT_URL : process.env.CLIENT_URL
}

export default config;