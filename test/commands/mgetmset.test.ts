import { assertArrayIncludes, assertEquals } from "std/testing/asserts.ts";
import { afterAll, afterEach, beforeEach, describe, it } from "std/testing/bdd.ts";
import { connect, Redis } from "x/redis/mod.ts";
import { testServer } from "../utils/test_server.ts";

const db = await Deno.makeTempFile({ suffix: '.db' })

let redis: Redis;
let port: number;
let kv: Deno.Kv;
let done: () => void;
describe("MGET command", () => {
  beforeEach(async () => {
    kv = await Deno.openKv(db);
    const [portNumber, doneFn] = testServer(kv);
    done = doneFn;
    port = portNumber;
    redis = await connect({ hostname: "127.0.0.1", port, maxRetryCount: 0 });
  });

  afterEach(() => {
    redis.close();
    kv.close();
    done();
  });

  afterAll(async () => {
    await Deno.remove(db)
  })

  it("Should properly set and MGET strings", async (t) => {
    const KEY1 = t.name + '1'
    const VALUE1 = 'abc'
    const KEY2 = t.name + '2'
    const VALUE2 = 'def'
    const msetREsp = await redis.mset([KEY1, VALUE1], [KEY2, VALUE2])
    const mgetResp = await redis.mget(KEY1, KEY2, 'unknown')
    assertEquals(msetREsp, "OK");
    assertArrayIncludes(mgetResp, [VALUE1, VALUE2, null]);
  });
});
