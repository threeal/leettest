class Solution {
 public:
  char charToLower(char c) {
    return (c >= 'A' && c <= 'Z') ? 'a' + c - 'A' : c;
  }
};
