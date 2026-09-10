/**
 * Boots the real Express app against an in-memory MongoDB and drives it
 * over real HTTP — no mocks. Exercises auth, public reads, protected
 * writes, subdocument CRUD, validation, and error-mapping. Exits non-zero
 * on the first failed assertion.
 */
import "dotenv/config";
import { MongoMemoryServer } from "mongodb-memory-server";

let pass = 0;
let fail = 0;

function assert(condition, label) {
  if (condition) {
    pass += 1;
    console.log(`  ok  - ${label}`);
  } else {
    fail += 1;
    console.error(`FAIL  - ${label}`);
  }
}

async function run() {
  const mongod = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongod.getUri();
  process.env.NODE_ENV = "test";
  // This test exercises the "Cloudinary not configured" error path
  // deliberately — clear these regardless of what the developer's real
  // .env has, so the smoke test never depends on (or hits) a real
  // Cloudinary account.
  delete process.env.CLOUDINARY_CLOUD_NAME;
  delete process.env.CLOUDINARY_API_KEY;
  delete process.env.CLOUDINARY_API_SECRET;

  const { connectDB } = await import("../src/config/db.js");
  await connectDB(process.env.MONGO_URI);

  const { Admin } = await import("../src/models/Admin.js");
  await Admin.create({
    name: "Smoke Admin",
    email: "smoke@test.local",
    passwordHash: await Admin.hashPassword("SmokePass123!"),
  });

  const { default: app } = await import("../src/app.js");
  const server = app.listen(0);
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;
  const api = (path) => `${base}/api${path}`;

  console.log(`\nSmoke testing against ${base}\n`);

  // --- health ---
  {
    const res = await fetch(`${base}/health`);
    const body = await res.json();
    assert(res.status === 200 && body.success === true, "GET /health -> 200");
  }

  // --- public portfolio aggregate on an empty DB (no seed:content run) ---
  // Regression test: this endpoint used to call Model.findOne() directly
  // instead of the same getOrCreateSingleton() the individual section
  // routes use, so on a database with only an admin seeded (no content
  // yet) every singleton section came back `null` — which the portfolio
  // frontend has no null-guard for and crashed on, in production.
  {
    const res = await fetch(api("/portfolio"));
    const body = await res.json();
    assert(res.status === 200 && body.success === true, "GET /api/portfolio -> 200");
    const singletons = ["profile", "stats", "techStack", "skills", "process", "resume", "contact", "social", "footer"];
    assert(
      singletons.every((key) => body.data[key] !== null && typeof body.data[key] === "object"),
      "portfolio aggregate never returns null singletons, even before seed:content"
    );
    assert(
      ["companies", "experience", "projects"].every((key) => body.data[key]?.section !== null && Array.isArray(body.data[key]?.items)),
      "portfolio aggregate's section+collection pairs are never null either"
    );
  }

  // --- 404 mapping ---
  {
    const res = await fetch(api("/does-not-exist"));
    assert(res.status === 404, "unknown route -> 404");
  }

  // --- auth: validation ---
  {
    const res = await fetch(api("/auth/login"), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "not-an-email" }),
    });
    assert(res.status === 400, "login with bad payload -> 400");
  }

  // --- auth: wrong password ---
  {
    const res = await fetch(api("/auth/login"), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "smoke@test.local", password: "wrong" }),
    });
    assert(res.status === 401, "login with wrong password -> 401");
  }

  // --- auth: success, capture cookie + token ---
  let token;
  let sessionCookie;
  {
    const res = await fetch(api("/auth/login"), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "smoke@test.local", password: "SmokePass123!" }),
    });
    const body = await res.json();
    token = body?.data?.token;
    sessionCookie = res.headers.get("set-cookie")?.split(";")[0];
    assert(res.status === 200 && Boolean(token), "login with correct credentials -> 200 + token");
    assert(Boolean(sessionCookie), "login sets an auth cookie");
  }

  const authHeaders = { authorization: `Bearer ${token}`, "content-type": "application/json" };

  // --- protected route without auth ---
  {
    const res = await fetch(api("/auth/me"));
    assert(res.status === 401, "GET /api/auth/me without token -> 401");
  }

  // --- protected route with bearer token ---
  {
    const res = await fetch(api("/auth/me"), { headers: authHeaders });
    const body = await res.json();
    assert(res.status === 200 && body.data.email === "smoke@test.local", "GET /api/auth/me with token -> 200");
  }

  // --- protected route with cookie instead of header ---
  {
    const res = await fetch(api("/auth/me"), { headers: { cookie: sessionCookie } });
    assert(res.status === 200, "GET /api/auth/me with cookie -> 200");
  }

  // --- top-level collection CRUD (Company) ---
  let companyId;
  {
    const resCreateUnauth = await fetch(api("/companies"), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ monogram: "XYZ", name: "Should Fail" }),
    });
    assert(resCreateUnauth.status === 401, "POST /api/companies without auth -> 401");

    const resCreate = await fetch(api("/companies"), {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ monogram: "ACM", name: "Acme Mobile", meta: "TEST", role: "Eng", period: "2024" }),
    });
    const created = await resCreate.json();
    companyId = created?.data?._id;
    assert(resCreate.status === 201 && Boolean(companyId), "POST /api/companies with auth -> 201");

    const resList = await fetch(api("/companies"));
    const list = await resList.json();
    assert(resList.status === 200 && list.data.length === 1, "GET /api/companies -> 1 item");

    const resUpdate = await fetch(api(`/companies/${companyId}`), {
      method: "PUT",
      headers: authHeaders,
      body: JSON.stringify({ name: "Acme Mobile Inc." }),
    });
    const updated = await resUpdate.json();
    assert(resUpdate.status === 200 && updated.data.name === "Acme Mobile Inc.", "PUT /api/companies/:id -> updated");

    const resBadId = await fetch(api("/companies/not-a-valid-object-id"));
    assert(resBadId.status === 400, "GET /api/companies/:badId -> 400 (CastError mapped)");

    const resDelete = await fetch(api(`/companies/${companyId}`), { method: "DELETE", headers: authHeaders });
    assert(resDelete.status === 200, "DELETE /api/companies/:id -> 200");

    const resGetDeleted = await fetch(api(`/companies/${companyId}`));
    assert(resGetDeleted.status === 404, "GET deleted company -> 404");
  }

  // --- singleton + subdocument array CRUD (StatsSection.items) ---
  {
    const resGet = await fetch(api("/stats"));
    const initial = await resGet.json();
    assert(resGet.status === 200 && Array.isArray(initial.data.items), "GET /api/stats auto-creates singleton");

    const resAdd = await fetch(api("/stats/items"), {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ tag: "TEST", value: "1", label: "Test Item" }),
    });
    const added = await resAdd.json();
    const itemId = added?.data?.items?.[0]?._id;
    assert(resAdd.status === 201 && Boolean(itemId), "POST /api/stats/items -> 201");

    const resItemUpdate = await fetch(api(`/stats/items/${itemId}`), {
      method: "PUT",
      headers: authHeaders,
      body: JSON.stringify({ value: "2" }),
    });
    const itemUpdated = await resItemUpdate.json();
    assert(
      resItemUpdate.status === 200 && itemUpdated.data.items[0].value === "2",
      "PUT /api/stats/items/:itemId -> updated in place"
    );

    const resItemDelete = await fetch(api(`/stats/items/${itemId}`), { method: "DELETE", headers: authHeaders });
    const itemDeleted = await resItemDelete.json();
    assert(resItemDelete.status === 200 && itemDeleted.data.items.length === 0, "DELETE /api/stats/items/:itemId -> removed");
  }

  // --- duplicate key handling (Project.slug unique) ---
  {
    const payload = { slug: "dup-test", name: "Dup One" };
    const first = await fetch(api("/projects"), { method: "POST", headers: authHeaders, body: JSON.stringify(payload) });
    assert(first.status === 201, "first project with slug -> 201");

    const second = await fetch(api("/projects"), {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ slug: "dup-test", name: "Dup Two" }),
    });
    assert(second.status === 409, "duplicate project slug -> 409");
  }

  // --- Cloudinary not configured yet -> upload endpoint fails clearly, not a crash ---
  {
    const form = new FormData();
    form.append("image", new Blob(["fake-image-bytes"], { type: "image/png" }), "avatar.png");
    const res = await fetch(api("/profile/avatar"), {
      method: "PUT",
      headers: { authorization: `Bearer ${token}` },
      body: form,
    });
    assert(res.status === 503, "avatar upload with no Cloudinary creds -> 503 (clear error, no crash)");
  }

  // --- avatar position + delete: must merge, never silently reset sibling
  // fields back to schema defaults (a real bug caught during development —
  // assigning the whole nested `avatar` object instead of merging wiped
  // the uploaded photo's url/publicId back to the placeholder) ---
  {
    const { Profile } = await import("../src/models/Profile.js");
    await Profile.findOneAndUpdate(
      {},
      { avatar: { url: "https://res.cloudinary.com/fake/photo.jpg", publicId: "fake-id-123", alt: "Test", position: { x: 50, y: 50 } } },
      { upsert: true }
    );

    const resPos = await fetch(api("/profile/avatar/position"), {
      method: "PUT",
      headers: authHeaders,
      body: JSON.stringify({ x: 70, y: 15 }),
    });
    const posBody = await resPos.json();
    assert(
      resPos.status === 200 &&
        posBody.data.avatar.position.x === 70 &&
        posBody.data.avatar.position.y === 15 &&
        posBody.data.avatar.url === "https://res.cloudinary.com/fake/photo.jpg" &&
        posBody.data.avatar.publicId === "fake-id-123",
      "PUT /api/profile/avatar/position updates position without touching url/publicId"
    );

    const resPosBad = await fetch(api("/profile/avatar/position"), {
      method: "PUT",
      headers: authHeaders,
      body: JSON.stringify({ x: 150, y: 15 }),
    });
    assert(resPosBad.status === 400, "PUT /api/profile/avatar/position rejects out-of-range values -> 400");

    const resDel = await fetch(api("/profile/avatar"), { method: "DELETE", headers: authHeaders });
    const delBody = await resDel.json();
    assert(
      resDel.status === 200 && delBody.data.avatar.publicId === null && delBody.data.avatar.url === "/images/profile.svg",
      "DELETE /api/profile/avatar reverts to the placeholder"
    );

    const resDelAgain = await fetch(api("/profile/avatar"), { method: "DELETE", headers: authHeaders });
    assert(resDelAgain.status === 400, "DELETE /api/profile/avatar with nothing to delete -> 400");
  }

  // --- settings: background overlay opacity + delete, same merge guarantee ---
  {
    const { Settings } = await import("../src/models/Settings.js");
    await Settings.findOneAndUpdate(
      {},
      { adminHomeBackground: { url: "https://res.cloudinary.com/fake/bg.jpg", publicId: "fake-bg-id", overlayOpacity: 80 } },
      { upsert: true }
    );

    const resOpacity = await fetch(api("/settings/background/opacity"), {
      method: "PUT",
      headers: authHeaders,
      body: JSON.stringify({ target: "home", overlayOpacity: 35 }),
    });
    const opacityBody = await resOpacity.json();
    assert(
      resOpacity.status === 200 &&
        opacityBody.data.adminHomeBackground.overlayOpacity === 35 &&
        opacityBody.data.adminHomeBackground.url === "https://res.cloudinary.com/fake/bg.jpg",
      "PUT /api/settings/background/opacity updates opacity without touching url"
    );

    const resDelBg = await fetch(api("/settings/background"), {
      method: "DELETE",
      headers: authHeaders,
      body: JSON.stringify({ target: "home" }),
    });
    const delBgBody = await resDelBg.json();
    assert(
      resDelBg.status === 200 && delBgBody.data.adminHomeBackground.url === null && delBgBody.data.adminHomeBackground.overlayOpacity === 35,
      "DELETE /api/settings/background clears the image but keeps the tuned opacity"
    );
  }

  // --- shutdown ---
  server.close();
  const mongoose = (await import("mongoose")).default;
  await mongoose.disconnect();
  await mongod.stop();

  console.log(`\n${pass} passed, ${fail} failed\n`);
  process.exit(fail > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error("[smoke test] crashed:", err);
  process.exit(1);
});
