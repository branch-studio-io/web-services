import idRequirementsSample from "@/data/id-requirements-sample.json";
import {
  extractIdRequirements,
  type IdRequirementType,
} from "@/utils/idRequirements";
import { describe, expect, it } from "vitest";

type SampleEntry = {
  label: string;
  input: string;
  expected: IdRequirementType[];
};

describe("extractIdRequirements", () => {
  it("reproduces expected values from id-requirements-sample.json", () => {
    const samples = idRequirementsSample as SampleEntry[];
    const failures: {
      label: string;
      expected: IdRequirementType[];
      extracted: IdRequirementType[];
    }[] = [];

    for (const sample of samples) {
      const extracted = extractIdRequirements(sample.input);
      const expectedSet = new Set(sample.expected);

      const missing = sample.expected.filter((e) => !extracted.includes(e));
      const extra = extracted.filter((e) => !expectedSet.has(e));

      if (missing.length > 0 || extra.length > 0) {
        failures.push({
          label: sample.label,
          expected: sample.expected,
          extracted,
        });
      }
    }

    if (failures.length > 0) {
      const msg = failures
        .map(
          (f) =>
            `  ${f.label}: expected [${f.expected.join(", ")}], got [${f.extracted.join(", ")}]`,
        )
        .join("\n");
      expect.fail(
        `Patterns failed to reproduce expected for ${failures.length} sample(s):\n${msg}`,
      );
    }
  });
});
