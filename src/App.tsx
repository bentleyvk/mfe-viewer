/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./App.scss";

import { BrowserAuthorizationClient } from "@itwin/browser-authorization";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import ViewerWrapper from "./ViewerWrapper";
// import { Button } from "@itwin/itwinui-react";

// const MyViewer = React.lazy(() => import("./Viewer"));
import { createBrowserHistory } from "history";
let history = createBrowserHistory();

(globalThis as any).IMJS_URL_PREFIX = "dev-";

const App: React.FC = () => {
  const authClient = useMemo(
    () =>
      new BrowserAuthorizationClient({
        scope: "imodelaccess:read imodels:read realitydata:read projects:read itwins:read projects:modify itwins:modify" ?? "",
        clientId: "spa-lGqOKmVDZqd0SPiPPzI5YlHuN",
        redirectUri: `${window.location.origin}/signin-callback` ?? "",
        postSignoutRedirectUri: process.env.IMJS_AUTH_CLIENT_LOGOUT_URI,
        responseType: "code",
        authority: "https://qa-ims.bentley.com",
      }),
    []
  );

  const [accessToken, setAccessToken] = useState<string>();
  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const token = await authClient.getAccessToken();
        setAccessToken(token);
      } catch {}
    };
    void getAccessToken();
  }, [authClient]);

  useEffect(() => {
    authClient.onAccessTokenChanged.addListener((token: string) => {
      setAccessToken(token);
    });
  }, [authClient]);

  const login = useCallback(async () => {
    try {
      await authClient.signInSilent();
    } catch {
      await authClient.signIn();
    }
  }, [authClient]);

  useEffect(() => {
    void login();
  }, [login]);

  const [paths, setPaths] = useState<string[]>(history.location.pathname.split("/").filter(Boolean));
  useEffect(() => {
    const unlisten = history.listen((listener) => {
      console.log(listener);
      setPaths(listener.pathname.split("/").filter(Boolean))
    });
    return () => unlisten();
  }, [])

  return (
    <div className="viewer-container">
      <ViewerWrapper accessToken={accessToken} router={ { paths, goTo: (url) => history.push(url) } } />
    </div>
  );
};

export default App;
