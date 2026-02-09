export type State = {
  /**
   * 2-letter state abbreviation (e.g. CA)
   */
  code: string;
  /**
   * Full name of the state (e.g. California)
   */
  name: string;
  /**
   * FIPS code for the state (e.g. 06)
   */
  fips: string;

  /**
   * Slug for the state (e.g. california)
   */
  slug: string;
};
