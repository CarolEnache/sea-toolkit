// TODO: This should be a whole service, generating, validating, etc... it should include the payments

import { hasFlag } from '../report/report-flags';

export async function generateLicenseCode() {
  return '';
}

export async function isLicenseValid(license?: string) {
  if (!hasFlag('enforce_license'))
    return true;

  if (!license)
    return false;

  // TODO: To implement
  return false;
}
