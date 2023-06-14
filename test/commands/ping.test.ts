import { assertEquals } from "std/testing/asserts.ts";
import { afterAll, afterEach, beforeEach, describe, it } from "std/testing/bdd.ts";
import { connect, Redis } from "x/redis/mod.ts";
import { testServer } from "../utils/test_server.ts";

const db = await Deno.makeTempFile({ suffix: '.db' })

let redis: Redis;
let port: number;
let kv: Deno.Kv;
let done: () => void;
describe("PING command", () => {
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

  it("Should properly PING", async (t) => {
    const pingResp = await redis.ping();
    assertEquals(pingResp, "PONG");
  });

  it("Should properly PING with argument", async (t) => {
    const ARG = t.name
    const pingResp = await redis.ping(ARG);
    assertEquals(pingResp, ARG);
  });

});
