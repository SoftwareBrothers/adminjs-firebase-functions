import { expect } from 'chai';

import { prepareComparePath } from './prepare-compare-path';

describe('prepareComparePath', () => {
  it('strips path for standard admin path', () => {
    const firebasePath = '/admin/login';
    const adminOriginalRootPath = '/admin';

    expect(prepareComparePath(firebasePath, adminOriginalRootPath)).to.eq('/login');
  });

  it('strips path admin path as "/"', () => {
    const firebasePath = '/login';
    const adminOriginalRootPath = '/';

    expect(prepareComparePath(firebasePath, adminOriginalRootPath)).to.eq('/login');
  });
});
