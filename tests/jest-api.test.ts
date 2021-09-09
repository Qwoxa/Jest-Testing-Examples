/**
 * Used jest functions.
 * {@link https://jestjs.io/docs/mock-functions}
 */

describe("jest-api", () => {
  describe("mock property", () => {
    it("call", () => {
      const mockFn = jest.fn();

      mockFn(1);
      mockFn(2);
      mockFn(2, 3);

      expect(mockFn.mock.calls).toEqual([[1], [2], [2, 3]]);
      expect(mockFn.mock.calls[0]).toEqual([1]);
    });

    it("results", () => {
      const mockFn = jest.fn();
      mockFn.mockReturnValueOnce("first call");

      mockFn();
      mockFn();

      expect(mockFn.mock.results).toEqual([
        { type: "return", value: "first call" },
        { type: "return", value: undefined },
      ]);
    });

    it("instances", () => {
      const MockConstructor = jest.fn();

      const instance = new MockConstructor();

      expect(MockConstructor.mock.instances).toEqual([{}]);
      expect(MockConstructor.mock.instances[0]).toBe(instance);
    });
  });

  describe("mock methods", () => {
    it("mockReturnValue", () => {
      const mockFn = jest.fn();
      mockFn.mockReturnValueOnce("first call").mockReturnValue("default value");

      const value1 = mockFn();
      const value2 = mockFn();

      expect(value1).toBe("first call");
      expect(value2).toBe("default value");
    });

    it("toBeCalled", () => {
      const mockFn = jest.fn();
      expect(mockFn).not.toBeCalled();

      mockFn();

      expect(mockFn).toBeCalled();
    });

    it("toBeCalledWith", () => {
      const mockFn = jest.fn();

      mockFn(1, 2, 3);

      expect(mockFn).toBeCalledWith(1, 2, 3);
    });

    it("mockClear", () => {
      const mockFn = jest.fn();
      mockFn();
      expect(mockFn).toBeCalled();

      mockFn.mockClear();

      expect(mockFn).not.toBeCalled();
    });
  });
});
