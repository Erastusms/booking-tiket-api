import request from "supertest";
import app from "../src/app";

describe("User Registration", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      name: "ucok",
      email: "test200@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Registrasi berhasil");
  });

  it("should fail with an existing email", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      name: "ucok",
      email: "test200@example.com",
      password: "password123",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
