import { UserSettings } from "../types";

import DiscountManager from "../src/discount-manager";
import UserManager from "../src/user-manager";
import DiscountUtils from "../src/discount.utils";

jest.mock("../src/user-manager");
jest.mock("../src/discount.utils");

const USER_ID = 1;

let discountManager: DiscountManager;
let userManagerMock: UserManager;

beforeEach(() => {
  discountManager = new DiscountManager(USER_ID);
  userManagerMock = (UserManager as jest.Mock).mock.instances[0];
});

afterEach(() => {
  (UserManager as jest.Mock).mockClear();
  (DiscountUtils.apply as jest.Mock).mockClear();
});

const createUserSettings = (
  isPremium: boolean,
  totalPurchase: number
): UserSettings => ({
  id: USER_ID,
  isPremium,
  totalPurchase,
});

describe("discount-manager", () => {
  describe("constructor", () => {
    it("should pass correct arguments to user manager", async () => {
      expect((UserManager as jest.Mock).mock.calls).toEqual([[USER_ID]]);
    });
  });

  describe("getDiscount", () => {
    it("should correctly calculate non-premium with 0 purchase", async () => {
      (userManagerMock.getUserSettings as jest.Mock).mockReturnValueOnce(
        createUserSettings(false, 0)
      );

      const discount = await discountManager.getDiscount();

      expect(discount).toBe(0);
    });

    /**
     * {@link https://jestjs.io/docs/api#testeachtablename-fn-timeout}
     */
    const testCases = [
      { premium: false, totalPurchase: 0, discount: 0 },
      { premium: true, totalPurchase: 0, discount: 3 },
      { premium: false, totalPurchase: 1, discount: 1 },
      { premium: false, totalPurchase: 5, discount: 1 },
      { premium: false, totalPurchase: 99, discount: 1 },
      { premium: false, totalPurchase: 100, discount: 3 },
      { premium: false, totalPurchase: 500, discount: 3 },
      { premium: false, totalPurchase: 1000, discount: 5 },
      { premium: false, totalPurchase: -1, discount: 0 },
    ];

    // test.each(testCases)(
    //   `should return discount for premium: {$premium} users with total $totalPurchase$ to be $discount%`,
    //   async (testCase) => {
    //     (userManagerMock.getUserSettings as jest.Mock).mockReturnValueOnce(
    //       createUserSettings(testCase.premium, testCase.totalPurchase)
    //     );

    //     const discount = await discountManager.getDiscount();

    //     expect(discount).toBe(testCase.discount);
    //   }
    // );

    testCases.forEach((testCase) => {
      it(`should return discount for ${
        testCase.premium ? "premium" : "non-premium"
      } users with total ${testCase.totalPurchase}$ to be ${
        testCase.discount
      }%`, async () => {
        (userManagerMock.getUserSettings as jest.Mock).mockReturnValueOnce(
          createUserSettings(testCase.premium, testCase.totalPurchase)
        );

        const discount = await discountManager.getDiscount();

        expect(discount).toBe(testCase.discount);
      });
    });
  });

  describe("applyDiscount", () => {
    it("should correctly pass discrount coefficient", () => {
      const DISCOUNT_PERCENT = 10;
      const DISCOUNT_COEFFICIENT = DISCOUNT_PERCENT / 100;
      const PURCHASE_VALUE = 120;

      discountManager.applyDiscount(DISCOUNT_PERCENT, PURCHASE_VALUE);

      expect(DiscountUtils.apply).toBeCalledWith(
        DISCOUNT_COEFFICIENT,
        PURCHASE_VALUE
      );
    });

    it("should return correct value", () => {
      const RETURN_VALUE = 90;
      (DiscountUtils.apply as jest.Mock).mockReturnValueOnce(RETURN_VALUE);

      const calculated = discountManager.applyDiscount(10, 100);

      expect(calculated).toBe(RETURN_VALUE);
    });
  });
});
