/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./Viewer.scss";

import type { ViewerAuthorizationClient } from "@itwin/viewer-react";
import type { ScreenViewport } from "@itwin/core-frontend";
import { FitViewTool, IModelApp, StandardViewId } from "@itwin/core-frontend";
import { FillCentered } from "@itwin/core-react";
import { ProgressLinear } from "@itwin/itwinui-react";
import { MeasureTools, MeasureToolsUiItemsProvider } from "@itwin/measure-tools-react";
import { PropertyGridManager, PropertyGridUiItemsProvider } from "@itwin/property-grid-react";
import { TreeWidget, TreeWidgetUiItemsProvider } from "@itwin/tree-widget-react";
import {
  Viewer,
  ViewerContentToolsProvider,
  ViewerNavigationToolsProvider,
  ViewerPerformance,
  ViewerStatusbarItemsProvider,
} from "@itwin/web-viewer-react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { BeEvent } from "@itwin/core-bentley";

// Set this for i18n
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).ITWIN_VIEWER_HOME = "http://localhost:3001"; //window.location.origin;

(globalThis as any).IMJS_URL_PREFIX = "dev-";

const iTwinId = "d667d711-a0ee-4843-957b-a8c3ed1caad2";
const iModelId = "89e0abd9-fdff-441d-adb3-2e008bc6b217";

const MyViewer = ({ accessToken }: { accessToken: string | undefined }) => {
  const tokenListeners = useRef<((token: string) => void)[]>([]);

  // const [token, setToken] = useState<string>();
  // useEffect(() => {
  //   accessToken.then((t) => setToken(t));
  // }, [accessToken])

  const authClient = useMemo<ViewerAuthorizationClient>(
    () => ({
      getAccessToken: async () => accessToken ?? "",
      onAccessTokenChanged: {
        addListener: (fn: (token: string) => void, scope) => {
          tokenListeners.current.push(fn);
          return () => {
            const listenerIndex = tokenListeners.current.indexOf(fn);
            if (listenerIndex !== -1) {
              tokenListeners.current.splice(listenerIndex, 1);
            }
          };
        },
      } as BeEvent<(token: string) => void>,
    }),
    [accessToken]
  );

  useEffect(() => {
    tokenListeners.current.forEach((listener) => listener(accessToken!));
  }, [accessToken]);

  /** NOTE: This function will execute the "Fit View" tool after the iModel is loaded into the Viewer.
   * This will provide an "optimal" view of the model. However, it will override any default views that are
   * stored in the iModel. Delete this function and the prop that it is passed to if you prefer
   * to honor default views when they are present instead (the Viewer will still apply a similar function to iModels that do not have a default view).
   */
  const viewConfiguration = useCallback((viewPort: ScreenViewport) => {
    // default execute the fitview tool and use the iso standard view after tile trees are loaded
    const tileTreesLoaded = () => {
      return new Promise((resolve, reject) => {
        const start = new Date();
        const intvl = setInterval(() => {
          if (viewPort.areAllTileTreesLoaded) {
            ViewerPerformance.addMark("TilesLoaded");
            ViewerPerformance.addMeasure("TileTreesLoaded", "ViewerStarting", "TilesLoaded");
            clearInterval(intvl);
            resolve(true);
          }
          const now = new Date();
          // after 20 seconds, stop waiting and fit the view
          if (now.getTime() - start.getTime() > 20000) {
            reject();
          }
        }, 100);
      });
    };

    tileTreesLoaded().finally(() => {
      void IModelApp.tools.run(FitViewTool.toolId, viewPort, true, false);
      viewPort.view.setStandardRotation(StandardViewId.Iso);
    });
  }, []);

  const viewCreatorOptions = useMemo(() => ({ viewportConfigurer: viewConfiguration }), [viewConfiguration]);

  const onIModelAppInit = useCallback(async () => {
    await TreeWidget.initialize();
    await PropertyGridManager.initialize();
    await MeasureTools.startup();
  }, []);

  console.log({ accessToken });

  return (
    <div className="viewer-container">
      {!accessToken && (
        <FillCentered>
          <div className="signin-content">
            <ProgressLinear indeterminate={true} labels={["Signing in..."]} />
          </div>
        </FillCentered>
      )}
      {accessToken && (
        <Viewer
          iTwinId={iTwinId ?? ""}
          iModelId={iModelId ?? ""}
          authClient={authClient}
          viewCreatorOptions={viewCreatorOptions}
          enablePerformanceMonitors={true} // see description in the README (https://www.npmjs.com/package/@itwin/web-viewer-react)
          onIModelAppInit={onIModelAppInit}
          uiProviders={[
            new ViewerNavigationToolsProvider(),
            new ViewerContentToolsProvider({
              vertical: {
                measureGroup: false,
              },
            }),
            new ViewerStatusbarItemsProvider(),
            new TreeWidgetUiItemsProvider(),
            new PropertyGridUiItemsProvider({
              enableCopyingPropertyText: true,
            }),
            new MeasureToolsUiItemsProvider(),
          ]}
        />
      )}
    </div>
  );
};

export default MyViewer;
