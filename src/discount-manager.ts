import { UserSettings } from "../types";

import UserManager from "./user-manager";
import DiscountUtils from "./discount.utils";
class DiscountManager {
  private _userManager: UserManager;

  constructor(userId: number) {
    this._userManager = new UserManager(userId);
  }

  private _getDiscountForPremium(userSettings: UserSettings) {
    if (userSettings.isPremium) {
      return 3;
    }

    return 0;
  }

  private _getDiscountForTotalPurchase(userSettings: UserSettings) {
    const { totalPurchase } = userSettings;

    if (totalPurchase <= 0) {
      return 0;
    }

    if (totalPurchase < 100) {
      return 1;
    }

    if (totalPurchase < 1000) {
      return 3;
    }

    return 5;
  }

  public async getDiscount(): Promise<number> {
    const userSettings = await this._userManager.getUserSettings();

    return (
      this._getDiscountForPremium(userSettings) +
      this._getDiscountForTotalPurchase(userSettings)
    );
  }

  public applyDiscount(discountPercent: number, purchase: number): number {
    const discountCoefficient = discountPercent / 100;
    return DiscountUtils.apply(discountCoefficient, purchase);
  }
}

export default DiscountManager;
