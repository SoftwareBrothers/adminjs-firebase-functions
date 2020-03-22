import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import fs from 'fs';

import { cleanFiles, File } from './parse-files';

chai.use(sinonChai);

describe('parseFiles', function () {
  const files: Record<string, File> = {
    fileParam: {
      path: '/some/file.path.png',
      name: 'file.path.png',
      type: 'image/png',
      encoding: 'utf',
    } as File,
  };

  afterEach(function () {
    sinon.restore();
  });

  context('one existing uploaded file', function () {
    let unlinkSyncStub;

    beforeEach(function () {
      unlinkSyncStub = sinon.stub(fs, 'unlinkSync').returns();
    });

    describe('.cleanFiles', function () {
      it('removes all stored files', function () {
        cleanFiles(files);

        expect(unlinkSyncStub).to.has.been.calledOnce;
      });
    });
  });

  context('one file doesn\'t exist', function () {
    beforeEach(function () {
      sinon.stub(fs, 'unlinkSync').throws({ code: 'ENOENT' });
    });

    describe('.cleanFiles', function () {
      it('omits non existing files', function () {
        expect(
          () => cleanFiles(files),
        ).not.to.throw();
      });
    });
  });
});
