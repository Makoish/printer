const bycrypt = require("bcrypt")

bycrypt.hash("12345678", 10, (err, hash) => {
    if (err) {
      console.error('Error hashing password:', err);
      return;
    }
  
    console.log('Hashed password:', hash);
  });





console.log(new Date("2024-08-11T20:00:00.000Z").getDate())