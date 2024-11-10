/**
 * Util to handle feature flags in the report
 *
 * PROGRESS: COMPLETE
 */

const FLAGS = {
  enforce_license: false,
  generate_report: true,
};

export function hasFlag(flag: keyof typeof FLAGS) {
  return Boolean(FLAGS[flag]);
}
