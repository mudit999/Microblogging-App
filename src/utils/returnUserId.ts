
export const returnUserId = (): string | null => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      const userObj = JSON.parse(storedUser);
      return userObj.id;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    }
  }
  return null;
};
