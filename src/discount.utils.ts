const DiscountUtils = {
  apply(discountCoefficient: number, purchase: number) {
    return purchase - discountCoefficient * purchase;
  },
};

export default DiscountUtils;
