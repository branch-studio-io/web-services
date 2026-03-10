#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parse } from "csv-parse/sync";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..", "..");

const statesPath = path.join(root, "src", "data", "states.json");
const csvPath = path.join(root, "src", "data", "state-policies.csv");
const outputPath = path.join(root, "src", "data", "state-policies.json");

function loadStates() {
  const raw = fs.readFileSync(statesPath, "utf-8");
  const states = JSON.parse(raw);

  const nameToCode = new Map();

  for (const state of states) {
    if (!state?.name || !state?.code) continue;
    nameToCode.set(String(state.name).trim().toLowerCase(), String(state.code));
  }

  return { states, nameToCode };
}

function shouldSkipPolicy(rawText) {
  if (rawText == null) return true;

  const text = String(rawText).trim();
  if (!text) return true;

  const lower = text.toLowerCase();

  if (lower === "permissive; don't include") {
    return true;
  }

  if (lower.startsWith("included in form")) {
    return true;
  }

  return false;
}

function normalizeDescription(lines) {
  const joined = lines.join(" ");
  return joined.replace(/\s+/g, " ").trim();
}

function parsePolicyText(rawText) {
  const text = String(rawText ?? "");
  if (!text.trim()) return [];

  const hasColon = text.includes(":");
  const lines = text.split(/\r?\n/);

  const pairs = [];
  let currentLabel = null;
  let descriptionLines = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const endsWithColon = line.endsWith(":");
    const isLabel =
      endsWithColon ||
      (!hasColon && currentLabel == null); // fallback: first non-empty line when no colon exists

    if (isLabel) {
      if (currentLabel && descriptionLines.length > 0) {
        pairs.push({
          label: currentLabel,
          description: normalizeDescription(descriptionLines),
        });
      }

      currentLabel = endsWithColon ? line.slice(0, -1).trim() : line.trim();
      descriptionLines = [];
    } else {
      descriptionLines.push(line);
    }
  }

  if (currentLabel && descriptionLines.length > 0) {
    pairs.push({
      label: currentLabel,
      description: normalizeDescription(descriptionLines),
    });
  }

  if (pairs.length === 0) {
    console.warn(
      "[process-state-policies] Unable to parse any label/description pairs from text:",
      JSON.stringify(text)
    );
  }

  return pairs;
}

async function main() {
  const { nameToCode } = loadStates();

  const csvRaw = fs.readFileSync(csvPath, "utf-8");

  const records = parse(csvRaw, {
    columns: false,
    skip_empty_lines: false,
    from_line: 2, // skip header row
  });

  const byState = new Map();

  let totalPolicies = 0;

  records.forEach((record, index) => {
    if (!Array.isArray(record)) return;

    // Column indices based on the CSV header:
    // 0: (empty), 1: (index), 2: State, 3: Statute, 4: Category / Model,
    // 5: Requirement (summary), 6: Provision (summary), ...
    const stateNameRaw = record[2];
    const policyTextRaw = record[5];

    if (shouldSkipPolicy(policyTextRaw)) {
      return;
    }

    const stateName = stateNameRaw ? String(stateNameRaw).trim() : "";
    if (!stateName) {
      console.warn(
        `[process-state-policies] Row ${index + 2}: missing state name, skipping`
      );
      return;
    }

    const stateCode = nameToCode.get(stateName.toLowerCase());
    if (!stateCode) {
      console.warn(
        `[process-state-policies] Row ${index + 2}: unknown state name "${stateName}", skipping`
      );
      return;
    }

    const pairs = parsePolicyText(policyTextRaw);
    if (!pairs.length) {
      return;
    }

    let entry = byState.get(stateCode);
    if (!entry) {
      entry = { state: stateCode, policies: [] };
      byState.set(stateCode, entry);
    }

    for (const pair of pairs) {
      entry.policies.push(pair);
      totalPolicies += 1;
    }
  });

  const result = Array.from(byState.values()).sort((a, b) =>
    a.state.localeCompare(b.state)
  );

  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2) + "\n", "utf-8");

  console.log(
    `[process-state-policies] Wrote ${result.length} states with ${totalPolicies} total policies to ${outputPath}`
  );
}

main().catch((error) => {
  console.error("[process-state-policies] Error:", error);
  process.exit(1);
});

