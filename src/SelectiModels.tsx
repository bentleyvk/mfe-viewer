// Copyright (c) Bentley Systems
import { IModelFull, IModelGrid } from "@itwin/imodel-browser-react";
// import { ContextMenuBuilderItem } from "@itwin/imodel-browser-react/cjs/utils/_buildMenuOptions";
import { SvgAdd } from "@itwin/itwinui-icons-react";
import { PageLayout } from "@itwin/itwinui-layouts-react";
import { Button, Text } from "@itwin/itwinui-react";
import React from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useAuth } from "../../core/auth-provider/AuthProvider";
// import { useDeleteiModelAction } from "../../hooks/useDeleteiModelAction";
// import { useEditiModelAction } from "../../hooks/useEditiModelAction";
// import { useGlobalState } from "../../GlobalState";
// import { UseMyItwinsCards } from "./UseMyItwinsCards";
// import { Utils } from "../../utilities/utilities";
import "./SelectiModels.scss";
export interface SelectiModelsProps {
  iTwinId: string;
}

const SelectiModels = ({
  accessToken,
  router: { goTo },
  itwinId,
}: {
  accessToken: string | undefined;
  router: { paths: string[]; goTo: (url: string) => void };
  itwinId: string;
}) => {
  // const { publicAccessToken } = useAuth();
  // const navigate = useNavigate();
  // const { iTwinId } = useParams();
  // const { setiModel } = useGlobalState();
  // const { deleteAction, deleteDialog, refreshKey } = useDeleteiModelAction({
  //   accessToken: publicAccessToken!
  // });
  // const { editAction } = useEditiModelAction();

  // const iModelActions = React.useMemo(() => {
  //   const actions = [
  //     editAction,
  //     deleteAction
  //   ] as ContextMenuBuilderItem<IModelFull>[];

  //   return actions;
  // }, [deleteAction, editAction]);

  // function navigateToCreate() {
  //   if (iTwinId) {
  //     const newUrl = `/${iTwinId}/new`;
  //     navigate(newUrl, {
  //       replace: true
  //     });
  //   }
  // }

  return (
    <PageLayout.Content padded style={{ backgroundColor: "unset" }}>
      <PageLayout.TitleArea>
        <Text variant="headline" as="h1">
          Select iModel
        </Text>
      </PageLayout.TitleArea>
      <PageLayout.ToolsArea
        left={
          <Button
            startIcon={<SvgAdd />}
            styleType="high-visibility"
            // onClick={navigateToCreate}
          >
            New
          </Button>
        }
      />
      <div className="select-imodel">
        <IModelGrid
          // useIndividualState={UseMyItwinsCards}
          // key={refreshKey}
          accessToken={accessToken!}
          projectId={itwinId}
          onThumbnailClick={(iModel: IModelFull) => {
            // setiModel(iModel);
            goTo(`/${itwinId}/${iModel.id}/viewer`);
          }}
          // iModelActions={iModelActions}
          apiOverrides={React.useMemo(
            () => ({
              serverEnvironmentPrefix: "dev",
            }),
            []
          )}
        />
        {/* {deleteDialog} */}
      </div>
    </PageLayout.Content>
  );
};

export default SelectiModels;
