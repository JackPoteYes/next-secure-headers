import type { ResponseHeader } from "../shared";
import { FeaturePermissions } from "../shared";

const HEADER_NAME = "Permissions-Policy";

const parseOrigins = (origins: string[]): string => origins.map((origin) => `"${origin}"`).join(" ");

export const createPermissionsPolicyHeaderValue = (options?: FeaturePermissions.Options): string | undefined => {
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

      if (none) return `${str}${directiveName}=(), `;
      if (all) return `${str}${directiveName}=*, `;

      if (!self && (!origins || !origins.length)) {
        throw new Error(`Invalid directive parameters for ${HEADER_NAME}: ${directiveName}`);
      }

      let directiveValue = "";

      if (self) directiveValue = "self";
      if (origins && origins.length) directiveValue = `${directiveValue}${self ? " " : ""}${parseOrigins(origins)}`;

      return `${str}${directiveName}=(${directiveValue}), `;
    }, "")
    .trim()
    .replace(/,$/g, "");

  return value;
};

export const createPermissionsPolicyHeader = (
  options?: FeaturePermissions.Options,
  headerValueCreator = createPermissionsPolicyHeaderValue,
): ResponseHeader | undefined => {
  if (!options) return;

  const value = headerValueCreator(options);

  return { name: HEADER_NAME, value };
};
