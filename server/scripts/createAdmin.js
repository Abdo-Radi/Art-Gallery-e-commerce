// Usage: node scripts/createAdmin.js <username> <email> <password>
// Creates (or resets the password of) an admin account.
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const [username, email, password] = process.argv.slice(2);

if (!username || !email || !password) {
  console.error("Usage: node scripts/createAdmin.js <username> <email> <password>");
  process.exit(1);
}

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const hash = await bcrypt.hash(password, 10);
    const result = await mongoose.connection.db.collecti
    on("admins").updateOne(
      { username },
      {
        $set: { email, password: hash },
        $setOnInsert: {
          firstName: "Admin",
          lastName: "User",
          creationDate: new Date(),
        },
      },
      { upsert: true }
    );
    console.log(
      result.upsertedCount
        ? `Admin "${username}" created.`
        : `Admin "${username}" password updated.`
    );
  } catch (err) {
    console.error("Failed:", err.message);
  } finally {
    await mongoose.disconnect();
  }
})();
