# Dennis

A server that processes basic [Redis Serialization Protocol (RESP)](https://redis.io/docs/reference/protocol-spec/) commands, storing received data in Deno KV.

<img width="438" alt="image" src="https://github.com/serdnam/dennis/assets/38575851/fe341f51-d164-45dc-ab42-7c46ede17148">

## Supported commands

* `PING [message]`
* `INFO`
* `COMMAND DOCS [command]`
* `GET key`
* `SET key value`
* `INCR key`
* `INCRBY key increment`
* `DECR key`
* `DECRBY key decrement`
* `MGET key [key ...]`
* `MSET key value [key value ...]`


## Running the server

Just run `deno task dev`, and use the `redis-cli` in another terminal to connect.

```
➜  ~ redis-cli
127.0.0.1:6379> SET hello world
OK
127.0.0.1:6379> GET hello
"world"
127.0.0.1:6379>
```

## Running tests

Run `deno task test` to run the tests
