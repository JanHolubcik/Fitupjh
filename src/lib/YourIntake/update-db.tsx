import { getUser } from "../user-db";

export const getSavedUser = async () => {
  const user = await getUser().then((response) => {
    return response;
  });

  return user;
};
