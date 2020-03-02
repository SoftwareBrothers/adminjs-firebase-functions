// eslint-disable-next-line import/no-extraneous-dependencies
import { Response } from 'firebase-functions';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Request } from 'firebase-functions/lib/providers/https';
import AdminBro, { AdminBroOptions, CurrentAdmin } from 'admin-bro';
import { resolve } from 'path';
import { match } from 'path-to-regexp';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';

import { AppRoutes, AppAssets } from './routes';
import { parseFiles, cleanFiles } from './parse-files';

export type ReturnType = ((req: Request, resp: Response) => Promise<void>)

export type OptionsType = {
  region: string;
  before?: () => Promise<any>;
  auth?: {
    secret: string;
    authenticate: (
      email: string,
      password: string) => Promise<CurrentAdmin | null> | CurrentAdmin | null;
  };
}

export const buildHandler = (adminOptions: AdminBroOptions, options: OptionsType): ReturnType => {
  let admin: AdminBro;

  let rootPath: string;
  let loginPath: string;
  let logoutPath: string;

  const domain = process.env.FUNCTIONS_EMULATOR
    ? `${process.env.GCLOUD_PROJECT}/${options.region}/${process.env.FUNCTION_TARGET}`
    : process.env.FUNCTION_TARGET;

  return async (req, res): Promise<void> => {
    if (!admin) {
      if (options.before) {
        await options.before();
      }

      admin = new AdminBro(adminOptions);
      ({ rootPath, loginPath, logoutPath } = admin.options);

      admin.options.rootPath = `/${domain}${rootPath}`;
      admin.options.loginPath = `/${domain}${loginPath}`;
      admin.options.logoutPath = `/${domain}${logoutPath}`;
    }

    const { method, query } = req;
    const path = req.path.replace(rootPath, '');
    const cookies = cookie.parse(req.headers.cookie);
    const token = cookies && cookies.__session;

    const currentAdmin = options.auth && token && token !== ''
      ? jwt.verify(token, options.auth.secret)
      : null;

    if (options.auth) {
      const matchLogin = match(loginPath);
      if (matchLogin(req.path)) {
        if (method === 'GET') {
          res.send(await admin.renderLogin({
            action: admin.options.loginPath,
            errorMessage: null,
          }));
        } else {
          const { email, password } = req.body;
          const user = await options.auth.authenticate(email, password);
          if (user) {
            const session = jwt.sign(user, options.auth.secret);
            res.cookie('__session', session, { maxAge: 900000 });
            res.redirect(admin.options.rootPath);
          } else {
            res.send(await admin.renderLogin({
              action: admin.options.loginPath,
              errorMessage: admin.translateMessage('invalidCredentials'),
            }));
          }
        }
        return;
      }

      const matchLogout = match(logoutPath);
      if (matchLogout(req.path)) {
        res.cookie('__session', '', { maxAge: 900000 });
        res.redirect(admin.options.loginPath);
        return;
      }

      if (!currentAdmin) {
        res.redirect(admin.options.loginPath);
        return;
      }
    }

    const route = AppRoutes.find((r) => r.match(path) && r.method === method);
    if (route) {
      const params = (route.match(path) as unknown as any).params as Record<string, string>;

      const controller = new route.Controller({ admin }, currentAdmin);
      let fields = {};
      let files = {};
      if (method === 'POST') {
        ({ fields, files } = await parseFiles(req));
      }
      const payload = {
        ...fields,
        ...files,
      };
      const html = await controller[route.action]({
        ...req, params, query, payload, method: method.toLowerCase(),
      }, res);
      if (route.contentType) {
        res.set({ 'Content-Type': route.contentType });
      }
      if (html) {
        res.send(html);
      }

      if (files) {
        cleanFiles(files);
      }

      return;
    }

    const asset = AppAssets.find((r) => r.match(path));
    if (asset) {
      res.sendFile(resolve(asset.src));
      return;
    }

    res.status(404).send('Page not found');
  };
};
