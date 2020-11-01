import { Router } from 'admin-bro';
import { match } from 'path-to-regexp';

const { routes, assets } = Router;

export const AppRoutes = routes.map((r) => ({
  match: match(r.path.replace(/{/g, ':').replace(/}/g, ''), { decode: decodeURIComponent }),
  ...r,
}));

export const AppAssets = assets.map((r) => ({
  match: match(r.path.replace(/{/g, ':').replace(/}/g, ''), { decode: decodeURIComponent }),
  ...r,
}));
