const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const UserRole = require("../models/UserRole");
const UserAddress = require("../models/UserAddress");

const createUserRole = asyncHandler(
  async (req, res)=> {
    try {
      const newRoles = [
        { role_description: "admin" },
        { role_description: "manager" },
        { role_description: "staff" },
        { role_description: "customer" },
      ];
      newRoles.map(async(role) => {
        return await UserRole.create(role);
      })
      return res.json({message:"create user role success"})
    } catch (error) {
      console.log(error);
    }
  }
)

const getAllUsers = asyncHandler(
    async (req, res)=> {
      const search = req.query.search || "";
      const role = req.query.role || "";
  
      const query = {
        user_phoneNumber: { $regex: search, $options: "i" },
      };
  
      const foundRole = await UserRole.findOne({
        role_description: "customer",
      });
  
      if (foundRole && role !== "customer") {
        query.user_role = { $ne: foundRole._id };
      } else if (foundRole && role === "customer") {
        query.user_role = foundRole._id;
      }
  
      const users = await User.find(query)
        .populate("user_role", "role_description -_id")
        .populate("address_id", "-_id")
        .lean();
  
      if (!users?.length) {
        return res.status(404).json({ message: "No users found" });
      }
      res.status(200).json(users);
    }
);

const getUserDetail = asyncHandler(
    async (req, res) => {
      try {
        const phoneNumber = req.query.phoneNumber || 0
  
        const foundUser = await User.findOne({ user_phoneNumber: phoneNumber }).populate("address_id","-_id")
  
        if (!foundUser) {
          return res.status(404).json({ message: "Số điện thoại này không tồn tại" })
        }
  
        return res.status(200).json(foundUser)
  
      } catch (error) {
        return res.status(500).json('Internal server error')
      }
    })
  
const createNewUser = asyncHandler(
    async (req, res) => {
      const requestUser = req.body;
  
      //confirm data
      if (!requestUser.user_phoneNumber || !requestUser.user_password) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      //check duplicate
      const duplicate = await User.findOne({
        user_phoneNumber: requestUser.user_phoneNumber,
      })
        .lean()
        .exec();
  
      if (duplicate) {
        return res.status(409).json({ message: "Phone number existed" });
      }
  
      //hash password
      const hashedPwd = await bcrypt.hash(requestUser.user_password, 10);
  
      //relationship
      const roles = await UserRole.find().lean();
      if (!roles) {
        createNewUser()
      }
  
      const role = await UserRole.findOne({
        role_description: requestUser?.user_role?.toLowerCase(),
      }).lean();
  
      //create new user address
      const userAddress = await UserAddress.create({
        fullname: requestUser.user_fullname || "",
        phoneNumber: requestUser.user_phoneNumber,
      });
  
      //create and store new user
      const user = await User.create({
        ...requestUser,
        user_phoneNumber: requestUser.user_phoneNumber,
        user_password: hashedPwd,
        user_role: role?._id,
        address_id: userAddress._id,
        user_status: true,
      });
      if (user) {
        res
          .status(200)
          .json({ message: `${requestUser.user_phoneNumber} create success` });
      } else {
        res.status(400).json({ message: "Invalid user data received" });
      }
    }
);
  
const updateUser = asyncHandler(
    async (req, res) => {
      const requestUser = req.body;
  
      //confirm data
      if (!requestUser.user_id) {
        return res.status(400).json({ message: "id is required" });
      }
  
      const user = await User.findById(requestUser.user_id).exec();
  
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
  
      //check duplicate
      const duplicate = await User.findOne({
        user_phoneNumber: requestUser.user_phoneNumber,
      })
        .lean()
        .exec();
  
      if (
        duplicate &&
        duplicate?._id.toString() !== requestUser.user_id.toString()
      ) {
        return res.status(409).json({ message: "Phone number existed" });
      }
      //hash password
      if (requestUser.user_password && requestUser.user_password.length > 0) {
        user.user_password = await bcrypt.hash(requestUser.user_password, 10);
      } else user.user_password = user.user_password;
  
      //relationship role
      const role = await UserRole.findOne({
        role_description: requestUser.user_role.toLowerCase(),
      });
  
      //relationship address
      const address = await UserAddress.findById(user.address_id);
      if (!address) {
        const createNewAddress = await UserAddress.create({
          fullname: user.user_fullname,
          phoneNumber: user.user_phoneNumber,
          address_line1: requestUser.address,
        });
        await user.updateOne({}, {}).set("address_id", createNewAddress._id);
      } else {
        if (requestUser?.address && requestUser.address.length > 0) {
          if (address?.address_line1 && address?.address_line1.length > 0) {
            if (requestUser.default) {
              console.log("address1");
  
              address.address_line1 = requestUser.address;
            } else {
              address.address_line2 = requestUser.address;
            }
          } else address.address_line1 = requestUser.address;
        }
  
        //fullname
        address.phoneNumber = requestUser.user_phoneNumber;
        await address?.save();
      }
  
      (user.user_phoneNumber =
        requestUser.user_phoneNumber || user.user_phoneNumber),
        (user.user_fullname = requestUser.user_fullname || user.user_fullname),
        (user.user_email = requestUser.user_email || user.user_email),
        (user.user_status = requestUser.user_status),
        await user.updateOne({}, {}).set("user_role", role?._id);
      await user.save();
  
      const updatedUser = await User.findById(requestUser.user_id)
        .populate("user_role", "role_description -_id")
        .populate("address_id", "-_id")
        .lean();
  
      res.status(200).json({
        message: `${user.user_phoneNumber} updated success`,
        updatedUser,
      });
    }
);
  
const confirmUserAddress = asyncHandler(
    async (req, res) => {
      const requestUser = req.body;
  
      //confirm data
      if (!requestUser.user_phoneNumber) {
        return res.status(400).json({ message: "user_phoneNumber is required" });
      }
  
      const user = await User.findOne({user_phoneNumber:requestUser.user_phoneNumber}).exec();
  
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
  
      //hash password
      if (requestUser.user_password && requestUser.user_password.length > 0) {
        user.user_password = await bcrypt.hash(requestUser.user_password, 10);
      } else user.user_password = user.user_password;
  
      //relationship role
      const role = await UserRole.findOne({
        role_description: requestUser.user_role.toLowerCase(),
      });
  
      //relationship address
      const address = await UserAddress.findById(user.address_id);
      if (!address) {
        const createNewAddress = await UserAddress.create({
          fullname: user.user_fullname,
          address_line1: requestUser.address,
        });
        await user.updateOne({}, {}).set("address_id", createNewAddress._id);
      } else {
        if (requestUser?.address && requestUser.address.length > 0) {
          if (address?.address_line1 && address?.address_line1.length > 0) {
            if (requestUser.default) {
              console.log("address1");
  
              address.address_line1 = requestUser.address;
            } else {
              address.address_line2 = requestUser.address;
            }
          } else address.address_line1 = requestUser.address;
        }
  
        //fullname
        address.phoneNumber = requestUser.user_phoneNumber;
        await address?.save();
      }
        (user.user_fullname = requestUser.user_fullname || user.user_fullname),
        (user.user_email = requestUser.user_email || user.user_email),
        (user.user_status = requestUser.user_status),
        await user.updateOne({}, {}).set("user_role", role?._id);
      await user.save();
  
      const updatedUser = await User.findById(requestUser.user_id)
        .populate("user_role", "role_description -_id")
        .populate("address_id", "-_id")
        .lean();
  
      res.status(200).json({
        message: `${user.user_phoneNumber} updated success`,
        updatedUser,
      });
    }
);
  
const deleteUser = asyncHandler(
    async (req, res) => {
      const { user_id } = req.body;
  
      if (!user_id) {
        return res.status(400).json({ message: "User ID required" });
      }
  
      const user = await User.findById(user_id).exec();
  
      await UserAddress.findByIdAndDelete(user?.address_id);
  
      const deletedUser = await User.findByIdAndDelete(user_id).lean().exec();
  
      res
        .status(200)
        .json({ message: `${deletedUser?.user_phoneNumber} deleted success` });
    }
);
  
const checkPhoneExisted = asyncHandler(
    async (req, res) => {
      const { user_phoneNumber } = req.body;
  
      if (!user_phoneNumber) {
        return res.status(400).json({ message: "phoneNumber are required" });
      }
  
      //check duplicate
      const duplicate = await User.findOne({
        user_phoneNumber: user_phoneNumber,
      })
        .lean()
        .exec();
  
      if (duplicate) {
        return res.status(409).json({ message: "Phone number existed" });
      }
  
      return res.json({ message: "phoneNumber doesn't existed" });
    }
);

module.exports = {
    createUserRole,
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
    confirmUserAddress,
    checkPhoneExisted,
    getUserDetail
}