/**
 * When request hits the server it contains `req.path` equals to what was written in the URL, after
 * the "function prefix" like this.
 *
 * ```json
 * {"path": "/admin/api/resources/User/records/123/show"}
 * ```
 *
 * But when we compare path against particular route, we are comparing just the part after the
 * {@link AdminBroOptions.rootPath} defined by the user.
 * So this part: `/api/resources/User/records/123/show` is what interest us.
 *
 * This function takes one and converts it to another.
 *
 *
 * @param firebasePath
 * @param adminOriginalRootPath
 * @param customFunctionPath
 */
export const prepareComparePath = (
  firebasePath: string,
  adminOriginalRootPath: string,
  customFunctionPath?: string,
): string => {
  let parsedPath = firebasePath;
  if (customFunctionPath) {
    parsedPath = parsedPath.replace(customFunctionPath, '');
  }
  parsedPath = parsedPath.replace(adminOriginalRootPath, '');

  if (!parsedPath.startsWith('/')) { parsedPath = `/${parsedPath}`; }
  return parsedPath;
};
