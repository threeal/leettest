#include <string>
#include <vector>

class Solution {
 public:
  std::vector<std::string> appendStringsArrays(std::vector<std::string> strs1, std::vector<std::string> strs2) {
    strs1.insert(strs1.end(), strs2.begin(), strs2.end());
    return strs1;
  }
};
