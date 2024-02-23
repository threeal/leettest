#include <iostream>
#include <tuple>
#include <vector>

#include "solution.cpp"

struct TestCase {
  const char *name;
  std::tuple<int, int> inputs;
  int output;
};

std::vector<TestCase> test_cases{
    {.name = "example 1", .inputs{12, 5}, .output = 17},
    {.name = "example 2", .inputs{-10, 4}, .output = -6}};

int main() {
  for (const auto &t : test_cases) {
    std::cout << "Testing " << t.name << "...\n";
    Solution s{};
    auto output = s.sum(std::get<0>(t.inputs), std::get<1>(t.inputs));
    if (output != t.output) {
      std::cerr << "Wrong output: " << output << " != " << t.output << " \n";
      return 1;
    }
  }
  return 0;
}
