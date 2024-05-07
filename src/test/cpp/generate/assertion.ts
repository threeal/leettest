/** A C++ assertion code. */
export const cppAssertionCode = [
  `    if (output != test_cases[i].output) {`,
  `      std::cerr << "failed to test " << test_cases[i].name << ":\\n";`,
  `      std::cerr << ".  output: " << output << "\\n";`,
  `      std::cerr << ".  expected: " << test_cases[i].output << "\\n\\n";`,
  `      ++failures;`,
  `    }`,
].join("\n");
