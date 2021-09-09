import { UserSettings } from "../types";

const DEFAULT_USER_SETTINGS: UserSettings = {
  id: 0,
  isPremium: false,
  totalPurchase: 0,
};

class UserManager {
  private userId: number;

  constructor(userId: number) {
    this.userId = userId;
  }

  async getUserSettings(): Promise<UserSettings> {
    try {
      const res = await fetch(
        "https://random-data-api.com/api/stripe/random_stripe",
        {
          body: JSON.stringify({ userId: this.userId }),
        }
      );

      return res.json();
    } catch {
      return DEFAULT_USER_SETTINGS;
    }
  }
}

export default UserManager;
