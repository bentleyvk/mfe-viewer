/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import React, { Suspense } from "react";

// import MyViewer from "./Viewer";
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
  router: { path: string; goTo: (url: string) => void };
}) => {
  const paths = router.path.split("/").filter(Boolean)
  console.log(paths);

const getElement = () => {
    // /:itwinid/:imodelId/viewer
    if (paths.length === 3 && paths[2] === "viewer") {
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
          <Viewer accessToken={accessToken} itwinId={paths[0]} imodelId={paths[1]} />
        </Suspense>
      );
    } else if (paths.length === 2 && paths[1] === "imodels") {
      return <SelectiModels accessToken={accessToken} router={router} itwinId={paths[0]} />;
    } else {
      return <SelectiTwin accessToken={accessToken} router={router} />;
    }
}
return <div style={{ width: '100%', overflow: 'auto', minHeight: '100%' }}>{getElement()}</div>
};

export default ViewerWrapper;
