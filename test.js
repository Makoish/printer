const bcrypt = require('bcrypt');

// Function to encrypt a password
async function encryptPassword(plainPassword) {
    const saltRounds = 10; // Number of rounds to generate the salt
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
}

// Example usage
const plainPassword = '12345678';
encryptPassword(plainPassword).then(hashedPassword => {
    console.log('Hashed Password:', hashedPassword);
}).catch(err => {
    console.error('Error hashing password:', err);
});
