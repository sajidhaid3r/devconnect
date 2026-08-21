import { sendResponse } from "../utils/apiResponse";

function mockRes() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("sendResponse", () => {
  it("returns the consistent {success, data, message} shape", () => {
    const res = mockRes();
    sendResponse(res, 200, true, { id: 1 }, "OK");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: 1 }, message: "OK" });
  });

  it("handles failure responses with null data", () => {
    const res = mockRes();
    sendResponse(res, 404, false, null, "Not found");
    expect(res.json).toHaveBeenCalledWith({ success: false, data: null, message: "Not found" });
  });
});
