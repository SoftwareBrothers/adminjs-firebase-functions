import path from 'path';
import { AdminJSOptionsWithDefault, Router } from 'adminjs';
/* eslint-disable no-param-reassign */

export type ComputeRootPathEnv = {
  project: string;
  region: string;
  target: string;
  emulator?: string;
}

export type ComputedPaths = {
  rootPath: string;
  loginPath: string;
  logoutPath: string;
}

export type AdminPathOptions = Pick<AdminJSOptionsWithDefault, 'loginPath' | 'logoutPath' | 'rootPath'>

export const getLocalhostPathForEnv = (env: ComputeRootPathEnv): string => (
  `${env.project}/${env.region}/${env.target}`
);

const joinPaths = (...paths: Array<string>): string => {
  // replace fixes windows paths
  const targetPath = path.join('/', ...paths).replace(/\\/g, '/');
  if (targetPath.endsWith('/')) {
    return targetPath.slice(0, -1);
  }
  return targetPath;
};

/**
 * Function which takes AdminJS options and fix paths depending on the environment where it is
 * hosted.
 *
 * @param {AdminJSOptions} options       options will can be mutated
 * @private
 */
export const computeRootPaths = (
  options: AdminPathOptions,
  env: ComputeRootPathEnv,
  customFunctionPath?: string,
): ComputedPaths => {
  let firebaseRootPath: string;

  if (env.emulator) {
    firebaseRootPath = getLocalhostPathForEnv(env);
  } else {
    firebaseRootPath = customFunctionPath || env.target;
  }

  const { rootPath, loginPath, logoutPath } = options;

  return {
    rootPath: joinPaths('/', firebaseRootPath, rootPath),
    loginPath: joinPaths('/', firebaseRootPath, loginPath),
    logoutPath: joinPaths('/', firebaseRootPath, logoutPath),
  };
};

export type RouteMatchReturn = {
  isLogin: boolean;
  isLogout: boolean;
  route: (typeof Router)['routes'][number] | null;
  asset: (typeof Router)['assets'][number] | null;
  // asset?:
}
