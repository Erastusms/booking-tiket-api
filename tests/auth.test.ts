import request from "supertest";
import app from "../src/app";
import prisma from "../src/config/prisma";
import { hashPassword } from "../src/utils/bcrypt";

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

describe("User Login", () => {
  const email = "testlogin@mail.com";
  const plainPassword = "password123";

  beforeAll(async () => {
    const hashedPassword = await hashPassword(plainPassword);
    await prisma.user.create({
      data: {
        name: "Test Login",
        email,
        passwordHash: hashedPassword,
      },
    });
  });

  it("should login successfully with correct credentials", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email,
      password: plainPassword,
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Login berhasil");
    expect(res.body.data.email).toBe(email);
  });

  it("should fail when wrong password is provided", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email,
      password: "wrongpassword",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Email atau password salah");
  });

  it("should fail when user is not found", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "notfound@mail.com",
      password: "irrelevant",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("User tidak ditemukan");
  });
});
