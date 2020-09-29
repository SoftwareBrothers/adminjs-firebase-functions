import { expect } from 'chai';
import {
  ComputeRootPathEnv,
  AdminPathOptions,
  computeRootPaths,
  getLocalhostPathForEnv,
} from './compute-root-paths';

/* eslint-disable mocha/no-mocha-arrows */
describe('routeMatch', () => {
  let env: ComputeRootPathEnv = {
    emulator: 'true',
    project: 'admin-bro-app',
    region: 'us-east-1',
    target: 'admin',
  };
  let options: AdminPathOptions;
  let customFunctionPath: string | undefined;

  beforeEach(() => {
    env = {
      emulator: 'true',
      project: 'admin-bro-app',
      region: 'us-east-1',
      target: 'admin',
    };

    options = {
      rootPath: '/admin',
      loginPath: '/admin/login',
      logoutPath: '/admin/logout',
    };
    customFunctionPath = undefined;
  });

  context('run on localhost', () => {
    let functionLocalPath: string;

    beforeEach(() => {
      env.emulator = 'true';
      functionLocalPath = getLocalhostPathForEnv(env);
    });

    it('fixes root admin paths that they have function url', () => {
      const paths = computeRootPaths(options, env, customFunctionPath);

      expect(paths.rootPath).to.equal(`/${functionLocalPath}/admin`);
      expect(paths.loginPath).to.equal(`/${functionLocalPath}/admin/login`);
      expect(paths.logoutPath).to.equal(`/${functionLocalPath}/admin/logout`);
    });

    it('it is not affected by customFunctionPath', () => {
      const paths = computeRootPaths(options, env, 'customDomain');

      expect(paths.rootPath).to.equal(`/${functionLocalPath}/admin`);
      expect(paths.loginPath).to.equal(`/${functionLocalPath}/admin/login`);
      expect(paths.logoutPath).to.equal(`/${functionLocalPath}/admin/logout`);
    });

    it('works when adminRoot is set to "/"', () => {
      options = {
        rootPath: '/',
        loginPath: '/login',
        logoutPath: '/logout',
      };

      const paths = computeRootPaths(options, env);

      expect(paths.rootPath).to.equal(`/${functionLocalPath}`);
      expect(paths.loginPath).to.equal(`/${functionLocalPath}/login`);
      expect(paths.logoutPath).to.equal(`/${functionLocalPath}/logout`);
    });
  });

  context('run on default host without custom domain', () => {
    beforeEach(() => {
      env.emulator = undefined;
      customFunctionPath = undefined;
    });

    it('changes urls by adding the target domain', () => {
      const paths = computeRootPaths(options, env);

      expect(paths.rootPath).to.equal(`/${env.target}/admin`);
      expect(paths.loginPath).to.equal(`/${env.target}/admin/login`);
      expect(paths.logoutPath).to.equal(`/${env.target}/admin/logout`);
    });

    it('works when adminRoot is set to "/"', () => {
      options = {
        rootPath: '/',
        loginPath: '/login',
        logoutPath: '/logout',
      };

      const paths = computeRootPaths(options, env);

      expect(paths.rootPath).to.equal(`/${env.target}`);
      expect(paths.loginPath).to.equal(`/${env.target}/login`);
      expect(paths.logoutPath).to.equal(`/${env.target}/logout`);
    });
  });

  context('run on host with custom domain', () => {
    beforeEach(() => {
      env.emulator = undefined;
      customFunctionPath = 'app';
    });

    it('changes urls by adding the target domain', () => {
      const paths = computeRootPaths(options, env, customFunctionPath);

      expect(paths.rootPath).to.equal(`/${customFunctionPath}/admin`);
      expect(paths.loginPath).to.equal(`/${customFunctionPath}/admin/login`);
      expect(paths.logoutPath).to.equal(`/${customFunctionPath}/admin/logout`);
    });

    it('works when adminRoot is set to "/"', () => {
      options = {
        rootPath: '/',
        loginPath: '/login',
        logoutPath: '/logout',
      };

      const paths = computeRootPaths(options, env, customFunctionPath);

      expect(paths.rootPath).to.equal(`/${customFunctionPath}`);
      expect(paths.loginPath).to.equal(`/${customFunctionPath}/login`);
      expect(paths.logoutPath).to.equal(`/${customFunctionPath}/logout`);
    });
  });
});
