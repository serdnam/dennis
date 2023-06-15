# Dennis

A server that processes basic Redis Serialization Protocol (RESP) commands, storing received data in Deno KV.

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