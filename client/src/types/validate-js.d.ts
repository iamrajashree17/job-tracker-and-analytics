declare module "validate.js" {
  function validate(
    attributes: Record<string, unknown>,
    constraints: Record<string, unknown>,
    options?: Record<string, unknown>
  ): Record<string, string[]> | undefined;

  export = validate;
}
