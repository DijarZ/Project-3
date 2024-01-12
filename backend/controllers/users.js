const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

const registerUser = async function (req, res) {
  const {
    firstName,
    lastName,
    email,
    password,
    rolecode,
    street,
    city,
    country,
  } = req.body;
  let userRole = "customer";
  try {
    if (rolecode !== undefined && rolecode === process.env.AdminCode) {
      userRole = "admin";
    }
    console.log("User role set as 'admin'");

    const saltRounds = 10;
    const hashedPw = await bcrypt.hash(password, saltRounds);
    const createdUser = await prisma.users.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPw,
        role: userRole,
        street,
        city,
        country,
      },
    });

    res.json(createdUser);
    console.log("Registered User:", registerUser);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error!");
  }
};

const loginUser = async function (req, res) {
  const { email, password } = req.body;

  try {
    const user = await prisma.users.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json("User not found or data is incorrect.");
    }
    const pwDecrypt = await bcrypt.compare(password, user.password);

    if (!pwDecrypt) {
      return res.status(401).json("Password is incorrect.");
    }
    const token = await jwt.sign(user, process.env.SECRET_TOKEN, {
      expiresIn: "60m",
    });

    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error!");
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      newName,
      newLastName,
      newEmail,
      newPw,
      newRole,
      newStreet,
      newCity,
      newCountry,
    } = req.body;

    const user = await prisma.users.findUnique({
      where: {
        id: parseInt(userId, 10),
      },
    });

    if (!user) {
      return res.status(404).json(" User not found");
    } else if (!(req.user.role === "admin") && req.user.id !== user.id) {
      return res
        .status(403)
        .send("You dont have access to perform this service");
    }

    const dataToUpdate = {};

    if (newName !== undefined) {
      dataToUpdate.firstName = newName;
    }
    if (newLastName !== undefined) {
      dataToUpdate.lastName = newLastName;
    }
    if (newEmail !== undefined) {
      dataToUpdate.email = newEmail;
    }
    if (newPw !== undefined) {
      const saltRounds = 10;
      const hashedPw = await bcrypt.hash(newPw, saltRounds);
      dataToUpdate.password = hashedPw;
    }
    if (newRole !== undefined) {
      dataToUpdate.role = newRole;
    }
    if (newStreet !== undefined) {
      dataToUpdate.street = newStreet;
    }
    if (newCountry !== undefined) {
      dataToUpdate.country = newCountry;
    }
    if (newCity !== undefined) {
      dataToUpdate.city = newCity;
    }

    const updatedUser = await prisma.users.update({
      where: {
        id: parseInt(userId, 10),
      },
      data: dataToUpdate,
    });

    res.json(updatedUser);
    console.log("Updated User:", updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error!");
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.users.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!user) {
      return res.status(404).json("User not found");
    }
    if (req.user.role !== "admin" && req.user.id !== user.id) {
      return res
        .status(403)
        .send("You dont have acces to perform this service");
    }
    const deletedUser = await prisma.users.delete({
      where: {
        id: parseInt(id),
      },
    });

    if (deletedUser) {
      res.json("User deleted succesfully!");
    } else {
      res.status(404).json("User not found.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error!");
  }
};
const getUsers = async (req, res) => {
  try {
    const allusers = await prisma.users.findMany();
    res.json(allusers);
    console.log(allusers);
  } catch (error) {
    console.error(error);

    res.status(500).send("Internal Server Error!");
  }
};
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const getUserById = await prisma.users.findUnique({
      where: { id: parseInt(id) },
    });
    if (!getUserById) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(getUserById);
    console.log(getUserById);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server Errror");
  }
};
module.exports = {
  getUsers,
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  getUserById,
};
