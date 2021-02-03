import type { ResponseHeader } from "../shared";
import { FeaturePermissions } from "../shared";

const HEADER_NAME = "Feature-Policy";

export const createFeaturePolicyHeaderValue = (options?: FeaturePermissions.Options): string | undefined => {
  if (!options) return;

  const value = Object.keys(options)
    .reduce((str, directiveName) => {
      if (!FeaturePermissions.supportedDirectiveNames.includes(directiveName as FeaturePermissions.DirectiveName)) {
        throw new Error(`Invalid directive for ${HEADER_NAME}: ${directiveName}`);
      }

      const directiveParameters = options[directiveName as FeaturePermissions.DirectiveName];
      if (!directiveParameters) {
        throw new Error(`Invalid directive parameters for ${HEADER_NAME}: ${directiveName}`);
      }
      const { none, all, self, origins } = directiveParameters;

      if (none) return `${str}${directiveName} 'none'; `;
      if (all) return `${str}${directiveName} *; `;

      if (!self && (!origins || !origins.length)) {
        throw new Error(`Invalid directive parameters for ${HEADER_NAME}: ${directiveName}`);
      }

      let value = `${str}${directiveName}`;

      if (self) value = `${value} 'self'`;
      if (origins && origins.length) value = `${value} ${origins.join(" ")}`;

      return `${value}; `;
    }, "")
    .trim();

  return value;
};

export const createFeaturePolicyHeader = (
  options?: FeaturePermissions.Options,
  headerValueCreator = createFeaturePolicyHeaderValue,
): ResponseHeader | undefined => {
  if (!options) return;

  const value = headerValueCreator(options);

  return { name: HEADER_NAME, value };
};
