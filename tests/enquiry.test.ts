import { test } from "node:test";
import assert from "node:assert/strict";
import { validateEnquiry } from "../src/lib/enquiry.ts";
const valid = {
  name: "Test Person",
  email: "test@example.com",
  phone: "+34 600 000 000",
  country: "Spain",
  property: "son-oliva",
  message: "Please arrange a private presentation.",
  locale: "en",
  consent: "on",
  website: "",
};
test("accepts valid enquiry, trims input and normalizes consent", () => {
  const r = validateEnquiry({ ...valid, name: " Test Person " });
  assert.equal(r?.name, "Test Person");
  assert.equal(r?.consent, true);
});
test("rejects absent consent, invalid email, phone, locale, oversized and bot data", () => {
  for (const bad of [
    { consent: false },
    { email: "x" },
    { phone: "600000000" },
    { locale: "de" },
    { message: "x".repeat(3001) },
    { website: "https://spam.invalid" },
    { name: [] },
    { property: "" },
  ])
    assert.equal(validateEnquiry({ ...valid, ...bad }), null);
});
test("rejects malformed bodies", () => {
  for (const v of [null, [], 42, "bad", {}])
    assert.equal(validateEnquiry(v), null);
});
