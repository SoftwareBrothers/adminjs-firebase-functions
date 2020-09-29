import { expect } from 'chai';

import { prepareComparePath } from './prepare-compare-path';

describe('prepareComparePath', () => {
  let firebasePath: string;
  let adminOriginalRootPath: string;
  let customFunctionPath: string;

  it('strips path for standard admin path', () => {
    firebasePath = '/admin/login';
    adminOriginalRootPath = '/admin';

    expect(prepareComparePath(firebasePath, adminOriginalRootPath)).to.eq('/login');
  });

  it('strips path admin path as "/"', () => {
    firebasePath = '/login';
    adminOriginalRootPath = '/';

    expect(prepareComparePath(firebasePath, adminOriginalRootPath)).to.eq('/login');
  });

  context('custom domain has been set with the proxy /debugFnc to the app', () => {
    beforeEach('', () => {
      firebasePath = '/debugFnc/login';
      adminOriginalRootPath = '/';
      customFunctionPath = 'debugFnc';
    });

    it('returns correct path', () => {
      const path = prepareComparePath(firebasePath, adminOriginalRootPath, customFunctionPath);

      expect(path).to.eq('/login');
    });

    it('returns correct path for customPath containing dash', () => {
      customFunctionPath = '/debugFnc';
      const path = prepareComparePath(firebasePath, adminOriginalRootPath, customFunctionPath);

      expect(path).to.eq('/login');
    });
  });
});
