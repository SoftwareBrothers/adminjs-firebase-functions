import { Response } from 'firebase-functions';
import { Request } from 'firebase-functions/lib/providers/https';
import { AdminJSOptions, CurrentAdmin } from 'adminjs';

/**
 * @alias BuildHandlerReturn
 *
 * @memberof module:@adminjs/firebase-functions
 */

export type BuildHandlerReturn = ((req: Request, resp: Response) => Promise<void>);
/**
 * @alias BuildHandlerOptions
 *
 * @memberof module:@adminjs/firebase-functions
 */

export type BuildHandlerOptions = {
  /** Region where function is deployed */
  region: string;
  /**
   * Optional before `async` hook which can be used to initialize database.
   * if it returns something it will be used as AdminJSOptions.
   */
  before?: () => Promise<AdminJSOptions | undefined | null> | AdminJSOptions | undefined | null;
  /**
   * custom authentication option. If given AdminJS will render login page
   */
  auth?: {
    /**
     * secret which is used to encrypt the session cookie
     */
    secret: string;
    /**
     * authenticate function
     */
    authenticate: (
      email: string,
      password: string
    ) => Promise<CurrentAdmin | null> | CurrentAdmin | null;

    /**
     * For how long cookie session will be stored.
     * Default to 900000 (15 minutes).
     * In milliseconds.
     */
    maxAge?: number;
  };

  /**
   * Adjustment path when you proxy the domain. Use case: you proxy `your-domain.com/app` to admin
   * firebase function with admin having `rootUrl=='/'` then you have to tell admin that all `paths`
   * he receives are `/app` namespaced so he can properly resolve them. In such case
   * `customFunctionPath` should be set to `app` because proxy path - rootUrl === 'app'.
   */
  customFunctionPath?: string;
};
