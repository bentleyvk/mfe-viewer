// Copyright (c) Bentley Systems
import {
  ProjectGrid as ITwinsGrid,
  ProjectGridProps as ITwinsGridProps,
} from "@itwin/imodel-browser-react";
import { SvgAdd, SvgCalendar, SvgList, SvgRemove, SvgSearch, SvgStarHollow } from "@itwin/itwinui-icons-react";
import { PageLayout } from "@itwin/itwinui-layouts-react";
import { Button, HorizontalTabs, IconButton, LabeledInput, Tab, Text } from "@itwin/itwinui-react";
import React from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../core/auth-provider/AuthProvider";
// import { LocalizationManager } from "../../core/localization/localization-helper";
// import { useGlobalState } from "../../GlobalState";
// import { useFavoriteCard } from "./UseFavoriteCard";
// import { Utils } from "../../utilities/utilities";
// import { FavoritesContextProvider } from "./FavoritesListProvider";
import "./SelectITwin.scss";
// import { useDeleteiTwinAction } from "../../hooks/useDeleteiTwinAction";
// import { ContextMenuBuilderItem } from "@itwin/imodel-browser-react/cjs/utils/_buildMenuOptions";
// import { useEditiTwinAction } from "../../hooks/useEditiTwinAction";

enum TabType {
  MyiTwins = 0,
  Favorite = 1,
  Recent = 2,
}

const SelectiTwin = ({
  accessToken,
  router: { goTo },
}: {
  accessToken: string | undefined;
  router: { paths: string[]; goTo: (url: string) => void };
}) => {
  // const { publicAccessToken } = useAuth();
  // const navigate = useNavigate();
  // const { setiTwin } = useGlobalState();
  // const { editITwinAction } = useEditiTwinAction();
  // const { deleteDialog, deleteAction, deleteRefreshKey } = useDeleteiTwinAction(
  //   { accessToken: publicAccessToken! }
  // );
  // const iTwinActions = React.useMemo(() => {
  //   return [
  //     editITwinAction,
  //     deleteAction
  //   ] as ContextMenuBuilderItem<ProjectFull>[];
  // }, [deleteAction, editITwinAction]);

  const [tabIndex, setTabIndex] = React.useState<TabType>(TabType.MyiTwins);
  const getRequestType = (tab: TabType): ITwinsGridProps["requestType"] => {
    switch (tab) {
      case TabType.Favorite:
        return "favorites";
      case TabType.Recent:
        return "recents";
      default:
        return "";
    }
  };

  const [searchText, setSearchText] = React.useState("");

  return (
    <PageLayout.Content padded style={{ backgroundColor: "unset" }}>
      <PageLayout.TitleArea>
        <Text variant="headline" as="h1">
          Select iTwin
        </Text>
      </PageLayout.TitleArea>
      <PageLayout.ToolsArea
        left={
          <Button startIcon={<SvgAdd />} styleType="high-visibility" /*onClick={() => goTo("/new")}*/>
            New
          </Button>
        }
        right={
          <LabeledInput
            className="select-itwins-search-input"
            svgIcon={
              searchText ? (
                <IconButton styleType="borderless" onClick={() => setSearchText("")}>
                  <SvgRemove />
                </IconButton>
              ) : (
                <SvgSearch className="select-itwins-search-input-search-icon" />
              )
            }
            displayStyle="inline"
            placeholder="Search..."
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
        }
      />
      <HorizontalTabs
        labels={[
          <Tab key="my" label={"My iTwins"} startIcon={<SvgList />} />,
          <Tab key="favorites" label="Favorites" startIcon={<SvgStarHollow />} />,
          <Tab key="recent" label="Recent" startIcon={<SvgCalendar />} />,
        ]}
        type="borderless"
        activeIndex={tabIndex}
        onTabSelected={(index) => setTabIndex(index)}
      >
        <div className="select-itwins-grid">
          {/* <FavoritesContextProvider> */}
          <ITwinsGrid
            accessToken={accessToken!}
            onThumbnailClick={(itwin) => {
              // setiTwin(itwin);
              goTo(`/${itwin.id}/imodels`);
            }}
            requestType={getRequestType(tabIndex)}
            filterOptions={searchText}
            apiOverrides={React.useMemo(
              () => ({
                serverEnvironmentPrefix: "dev",
              }),
              []
            )}
            // stringsOverrides={{
            //   noProjects: LocalizationManager.translate(
            //     "SelectITwin:NoITwinsFound"
            //   )
            // }}
            // useIndividualState={useFavoriteCard}
            // key={deleteRefreshKey}
            // projectActions={iTwinActions}
          />
          {/* {deleteDialog} */}
          {/* </FavoritesContextProvider> */}
        </div>
      </HorizontalTabs>
    </PageLayout.Content>
  );
};

export default SelectiTwin;
