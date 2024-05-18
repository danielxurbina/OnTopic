import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import StoriesDAO from "./dao/storiesDAO.js";
import CommentsDAO from "./dao/commentsDAO.js";
import UsersDAO from "./dao/usersDAO.js";
import UniqueID from "./lib/uniqueID.js";

async function main() {
  dotenv.config();
  const client = new mongodb.MongoClient(process.env.STORIES_DB_URI);
  const port = process.env.PORT || 8000;
  try {
    await client.connect();
    await StoriesDAO.injectDB(client);
    await CommentsDAO.injectDB(client);
    await UsersDAO.injectDB(client);
    await UniqueID.injectDB(client);
    app.listen(port, () => {
      console.log("server is running on port:" + port);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
main().catch(console.error);
