#include <vector>

class Solution {
 public:
  std::vector<int> appendIntegersArrays(std::vector<int> nums1, std::vector<int> nums2) {
    nums1.insert(nums1.end(), nums2.begin(), nums2.end());
    return nums1;
  }
};
