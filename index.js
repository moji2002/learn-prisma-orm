const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");

app.use(express.json());
const db = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty',

})

app.get("/test", async (req, res) => {
  try {
    const result = await db.$queryRaw`SELECT * FROM "User"`
    return res.json(result);
  } catch (error) {
    console.dir(error);
    return res.status(500).send(error);
  }
});

app.get("/user", async (req, res) => {
  try {
    const users = await db.user.findMany({
      include: {
        posts: true,
        profile: true,
      },
    });
    return res.json(users);
  } catch (error) {
    console.dir(error);
    return res.status(500).send(error);
  }
});

app.post("/user", async (req, res) => {
  const { email, name } = req.body;
  try {
    const user = await db.user.create({
      data: {
        email,
        name,
      },
    });

    return res.json(user);
  } catch (error) {
    console.dir(error);
    return res.status(400).send(error);
  }
});

app.post("/post", async (req, res) => {
  const { title, content, authorId } = req.body;
  try {
    const post = await db.post.create({
      data: {
        title,
        content,
        authorId,
      },
      select: {
        title: true,
      },
    });

    return res.json(post);
  } catch (error) {
    console.dir(error);
    return res.status(400).send(error);
  }
});

app.listen(3000, () => console.log("listening on port 3000"));
