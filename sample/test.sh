#!/bin/sh

cd "$(dirname "$0")"
for test in **/*/test.cpp; do
  mkdir -p "build/$test"

  echo "Compiling $test"
  clang++ --std=c++20 "$test" -o "build/${test%.*}"

  echo "Running build/${test%.*}"
  build/${test%.*}
done
