/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import React, { useState, Suspense } from "react";

// import MyViewer from "./Viewer";
import { Button } from "@itwin/itwinui-react";
import SelectiTwin from "./SelectiTwin";
import SelectiModels from "./SelectiModels";
import { SvgIModelLoader } from "@itwin/itwinui-illustrations-react";

import "@itwin/itwinui-layouts-css/styles.css";

const Viewer = React.lazy(() => import("./MyViewer"));

const ViewerWrapper = ({
  accessToken,
  router,
}: {
  accessToken: string | undefined;
  router: { paths: string[]; goTo: (url: string) => void };
}) => {
  console.log(router.paths);

  // /:itwinid/:imodelId/viewer
  if (router.paths.length === 3 && router.paths[2] === "viewer") {
    return (
      <Suspense
        fallback={
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
            }}
          >
            <SvgIModelLoader style={{ width: 64, height: 64 }} />
          </div>
        }
      >
        <Viewer accessToken={accessToken} itwinId={router.paths[0]} imodelId={router.paths[1]} />
      </Suspense>
    );
  } else if (router.paths.length === 2 && router.paths[1] === "imodels") {
    return <SelectiModels accessToken={accessToken} router={router} itwinId={router.paths[0]} />;
  } else if (router.paths.length === 0) {
    return <SelectiTwin accessToken={accessToken} router={router} />;
  }

  return <>"Something wrong!"</>;
};

export default ViewerWrapper;
