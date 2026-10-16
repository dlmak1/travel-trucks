import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { AxiosError } from "axios";
import { api, createBookingRequest } from "../src/lib/api.ts";

// Replace the transport: these tests cannot create real bookings.
const originalAdapter = api.defaults.adapter;
afterEach(() => {
  api.defaults.adapter = originalAdapter;
});

test("sends only documented fields and returns the API confirmation", async () => {
  let requests = 0;
  api.defaults.adapter = async (config) => {
    requests += 1;
    assert.equal(config.method, "post");
    assert.equal(config.url, "/campers/camper%2F123/booking-requests");
    assert.deepEqual(JSON.parse(config.data), {
      name: "Олена Коваль",
      email: "olena@example.com",
    });
    return {
      data: { message: "Booking request accepted." },
      status: 201,
      statusText: "Created",
      headers: {},
      config,
    };
  };

  const response = await createBookingRequest(" camper/123 ", {
    name: " Олена Коваль ",
    email: " olena@example.com ",
    date: "2026-10-20",
    comment: "Must not be sent",
  });
  assert.equal(requests, 1);
  assert.deepEqual(response, { message: "Booking request accepted." });
});

test("rejects a missing camper ID before contacting the API", async () => {
  api.defaults.adapter = async () => {
    assert.fail("No request should be made for an empty camper ID");
  };
  await assert.rejects(
    createBookingRequest("  ", { name: "John", email: "john@example.com" }),
    /Camper ID is required/,
  );
});

test("preserves HTTP errors and uses the existing error interceptor", async () => {
  api.defaults.adapter = async (config) => {
    throw new AxiosError("Request failed", "ERR_BAD_REQUEST", config, null, {
      status: 400,
      statusText: "Bad Request",
      data: { message: ["Invalid name", "Invalid email"] },
      headers: {},
      config,
    });
  };
  await assert.rejects(
    createBookingRequest("123", { name: "John", email: "john@example.com" }),
    (error) => {
      assert.equal(error.response.status, 400);
      assert.equal(error.message, "Invalid name; Invalid email");
      return true;
    },
  );
});

test("propagates a connection failure without retrying the booking", async () => {
  let requests = 0;
  api.defaults.adapter = async (config) => {
    requests += 1;
    throw new AxiosError("Network Error", "ERR_NETWORK", config);
  };
  await assert.rejects(
    createBookingRequest("123", { name: "John", email: "john@example.com" }),
    /Network Error/,
  );
  assert.equal(requests, 1);
});
