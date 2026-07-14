import { ObjectId } from "mongodb";
import client from "./mongodb";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: Date;
  goal?: string;
  weight?: number;
  height?: number;
  activityLevel?: string;
};

export const getUsers = async (
  search?: string,
  roleFilter?: string,
  page: number = 1,
  limit: number = 10,
): Promise<{ users: AdminUser[]; total: number }> => {
  const db = client.db();
  const collection = db.collection("user");

  const query: Record<string, any> = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  if (roleFilter && roleFilter !== "all") {
    query.role = roleFilter;
  }

  const total = await collection.countDocuments(query);
  const skip = (page - 1) * limit;

  const users = await collection
    .find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  const formattedUsers = users.map((u) => {
    const stringId = (u.id || u._id.toString()) as string;
    return {
      id: stringId,
      name: (u.name || "") as string,
      email: (u.email || "") as string,
      role: (u.role || "user") as string,
      createdAt: u.createdAt
        ? new Date(u.createdAt as string | number | Date)
        : undefined,
      goal: (u.goal || "") as string,
      weight: typeof u.weight === "number" ? u.weight : undefined,
      height: typeof u.height === "number" ? u.height : undefined,
      activityLevel: (u.activityLevel || "") as string,
    };
  });

  return {
    users: formattedUsers,
    total,
  };
};

export const updateUserByAdmin = async (
  userId: string,
  data: { name: string; email: string; role: string },
): Promise<boolean> => {
  const db = client.db();
  const collection = db.collection("user");

  // Check if email already exists for another user
  const emailConflictQuery: Record<string, any> = {
    email: data.email,
  };

  if (ObjectId.isValid(userId)) {
    emailConflictQuery.$and = [
      { id: { $ne: userId } },
      { _id: { $ne: new ObjectId(userId) } },
    ];
  } else {
    emailConflictQuery.id = { $ne: userId };
  }

  const existingUser = await collection.findOne(emailConflictQuery);

  if (existingUser) {
    throw new Error("email_conflict");
  }

  let userQuery: Record<string, any> = { id: userId };
  if (ObjectId.isValid(userId)) {
    userQuery = {
      $or: [{ id: userId }, { _id: new ObjectId(userId) }],
    };
  }

  const result = await collection.updateOne(userQuery, {
    $set: {
      name: data.name,
      email: data.email,
      role: data.role,
      updatedAt: new Date(),
    },
  });

  return result.modifiedCount > 0 || result.matchedCount > 0;
};

export const deleteUserByAdmin = async (userId: string): Promise<boolean> => {
  const db = client.db();

  // 1. Delete user record
  const userCollection = db.collection("user");
  let userQuery: Record<string, any> = { id: userId };
  let mongoUserId: ObjectId | null = null;

  if (ObjectId.isValid(userId)) {
    mongoUserId = new ObjectId(userId);
    userQuery = {
      $or: [{ id: userId }, { _id: mongoUserId }],
    };
  }

  const userResult = await userCollection.deleteOne(userQuery);

  // 2. Cascade delete saved food and activities
  if (mongoUserId) {
    await db.collection("savedfood").deleteMany({ user_id: mongoUserId });
    await db.collection("savedactivity").deleteMany({ user_id: mongoUserId });
  } else {
    try {
      await db.collection("savedfood").deleteMany({ user_id: userId as any });
      await db
        .collection("savedactivity")
        .deleteMany({ user_id: userId as any });
    } catch (e) {
      // ignore
    }
  }

  return userResult.deletedCount > 0;
};
