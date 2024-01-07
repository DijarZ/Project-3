const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

const registerUser = async function (req, res) {
  const { firstName, lastName, email, password, rolecode } = req.body;
  let userRole = "customer";
  try {
    if (rolecode !== undefined && rolecode === 1111) {
      userRole = "admin";
    }
    const saltRounds = 10;
    const hashedPw = await bcrypt.hash(password, saltRounds);
    const createdUser = await prisma.users.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPw,
        role: userRole,
      },
    });

    res.json(createdUser);
    console.log("Registered User:", registerUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Gabim gjatë regjistrimit të përdoruesit." });
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
      return res.status(404).json({
        message: "Përdoruesi nuk u gjet ose të dhënat janë të pasakta.",
      });
    }
    const pwDecrypt = await bcrypt.compare(password, user.password);

    if (!pwDecrypt) {
      return res.status(401).json({
        message: "Fjalëkalimi është i pasaktë.",
      });
    }
    const token = await jwt.sign(user, process.env.SECRET_TOKEN, {
      expiresIn: "60m",
    });

    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Gabim gjatë hyrjes së përdoruesit." });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { newName, newLastName, newEmail, newPw, newRole } = req.body;

    const user = await prisma.users.findUnique({
      where: {
        id: parseInt(userId, 10),
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Përdoruesi nuk u gjet." });
    } else if (!(req.user.role === "admin") && req.user.id !== user.id) {
      return res.status(403).send("Ju nuk keni leje për të kryer këtë veprim.");
    }

    const dataToUpdate = {};

    // Check each field and add it to the update data if provided
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
    res.status(500).send("Gabim në server!");
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.users.findUnique({
      where: {
        id: parseInt(id), // Assuming id is a number; if it's a string, remove parseInt
      },
    });
    //  if(!user){
    //     return res.status(404).json("Perdoruesi nuk u gjet")
    // }
    if (req.user.role !== "admin" && req.user.id !== user.id) {
      return res.status(403).send("Ju nuk keni te drejt per te bere kete");
    }
    const deletedUser = await prisma.users.delete({
      where: {
        id: parseInt(id),
      },
    });

    if (deletedUser) {
      res.json("Përdoruesi u fshi me sukses!");
    } else {
      res.status(404).json("Perdoruesi nuk u gjet.");
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

// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

// const loginUser = (req, res) => {
//   const { email, password } = req.body;
//   const user = users.find((u) => u.email === email && u.password === password);

//   if (!user) {
//     return res
//       .status(401)
//       .json({ message: "Autentikimi dështoi. Provoni përsëri." });
//   }

//   res.status(200).json({ message: "Autentikimi u krye me sukses!", user });
// };

// const createUser = async (req, res) => {
//   try {
//     const { firstName, lastName, email, password, rolecode } = req.body;
//     if (rolecode !== undefined && rolecode === 1111) {
//       const createAdmin = await prisma.users.create({
//         data: {
//           firstName,
//           lastName,
//           email,
//           password,
//           role: "admin",
//         },
//       });
//       res.json(createAdmin);
//     } else {
//       const createCustomer = await prisma.users.create({
//         data: {
//           firstName,
//           lastName,
//           email,
//           password,
//           role: "customer",
//         },
//       });
//       res.json(createCustomer);
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal server error!");
//   }
// };

// const updateUser = async (req, res) => {
//   const currentUser = req.body; // User information to be updated

//   try {
//     const user = await prisma.users.findUnique({
//       where: {
//         firstName: currentUser.firstName,
//         lastName: currentUser.lastName,
//         email: currentUser.email,
//       },
//     });

//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     if (user.role === "admin") {
//       // Admin can update all users' information
//       const updatedUsers = await prisma.users.updateMany({
//         where: {}, // Empty object matches all records
//         data: {
//           firstName: currentUser.newFirstName || prisma.users.firstName,
//           lastName: currentUser.newLastName || prisma.users.lastName,
//           email: currentUser.newEmail || prisma.users.email,
//         },
//       });

//       res
//         .status(200)
//         .json({ message: "Users updated successfully!", updatedUsers });
//     } else if (user.id === userIdToUpdate) {
//       // Non-admin user can update only their own information
//       const updatedUser = await prisma.users.update({
//         where: {
//           id: userIdToUpdate,
//         },
//         data: {
//           firstName: currentUser.newFirstName || user.firstName,
//           lastName: currentUser.newLastName || user.lastName,
//           email: currentUser.newEmail || user.email,
//         },
//       });

//       res
//         .status(200)
//         .json({ message: "User updated successfully!", updatedUser });
//     } else {
//       res
//         .status(403)
//         .json({ message: "You don't have permission for this action." });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error while updating user(s).");
//   }
// };

// module.exports = {
//   createUser,
//   getUsers,
//   updateUser,
//   loginUser,
// };
