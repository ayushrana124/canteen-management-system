import bcrypt from "bcrypt";

// For Hashing Password
export const hashPashword = async (password: string) => {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
}

// For comapring entered password and hashed pass
export const comparePassword = (password: string, hashed: string) => {
    return bcrypt.compare(password, hashed);
}
