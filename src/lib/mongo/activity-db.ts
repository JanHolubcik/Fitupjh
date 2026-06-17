import connectDB from "./connect-db";
import { Activity } from "./models/Activity";

/**
 *
 * @returns All activities.
 */
export async function getActivity() {
  try {
    await connectDB();

    const activity = await Activity.find({}).lean().exec();

    return activity;
  } catch (error) {
    return { error };
  }
}
