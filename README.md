# Run JavaScript in WebAssembly

Now supporting wasmedge socket for HTTP requests and Tensorflow in JavaScript programs!

## Prerequisites

Install [Rust](https://www.rust-lang.org/tools/install) and [wasmedge CLI tool](https://github.com/WasmEdge/WasmEdge/blob/master/docs/install.md).

```shell
rustup target add wasm32-wasi
```

## HTTP Request

### Build

```shell
cargo build --target wasm32-wasi --release --features=http
```

### Run

```shell
wasmedge --dir .:. target/wasm32-wasi/release/quickjs-rs-wasi.wasm example_js/http_demo.js
```

## TensorFlow

### install WasmEdge-TensorFlow

```shell
wget https://github.com/second-state/WasmEdge-tensorflow-tools/releases/download/0.8.1/WasmEdge-tensorflow-tools-0.8.1-manylinux2014_x86_64.tar.gz
tar -xzf WasmEdge-tensorflow-tools-0.8.1-manylinux2014_x86_64.tar.gz
./download_dependencies_all.sh
export LD_LIBRARY_PATH=$(pwd)
```
### Build

```shell
cargo build --target wasm32-wasi --release --features=tensorflow
```
### Run

```shell
wasmedge-tensorflow --dir .:. target/wasm32-wasi/release/quickjs-rs-wasi.wasm example_js/tensorflow_lite_demo/main.js
```

## Optional: Get static-lib & binding.rs

If you want to build a custom libquickjs.a

See [[quickjs-wasi]](https://github.com/L-jasmine/quickjs-wasi) (branch:rs-binding)

```shell
run quickjs-wasi/lib/build.sh
```