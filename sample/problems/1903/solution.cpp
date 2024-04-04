#include <string>

class Solution {
 public:
  std::string largestOddNumber(std::string num) {
    for (std::size_t i = num.size(); i > 0; --i) {
      if ((num[i - 1] - '0') % 2 != 1) continue;
      return num.substr(0, i);
    }

    return "";
  }
};
