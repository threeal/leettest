#include "solution.cpp"

#include <cassert>

int main() {
  assert(Solution{}.sum(12, 5) == 17);
  assert(Solution{}.sum(-10, 4) == -6);
}
