const RESERVED_FIELDS = ["_id", "__v", "createdAt", "updatedAt"];

/**
 * Strips Mongoose-internal fields from client-sent update payloads.
 *
 * The admin's edit forms are seeded straight from a previous GET response,
 * which includes `__v`/`_id`/timestamps — round-tripping those back on
 * save is harmless most of the time, but `__v` specifically is Mongoose's
 * optimistic-concurrency version key: overwriting a freshly-fetched
 * document's real `__v` with a stale client-cached copy makes the
 * subsequent `.save()` compare against the wrong version and throw
 * `VersionError: No matching document found for id "..." version N`,
 * even though nothing was actually conflicting.
 */
export function sanitizeBody(body) {
  const clean = { ...body };
  for (const field of RESERVED_FIELDS) delete clean[field];
  return clean;
}
