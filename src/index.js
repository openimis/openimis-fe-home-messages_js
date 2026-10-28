import { withLegacyTheme } from "./utils/themeWrapper.jsx";
import messages_en from "./translations/en.json";
import reducer from "./reducer";
import NoticesPage from "./pages/NoticesPage";
import NoticePage from "./pages/NoticePage";
import AllNoticePage from "./pages/AllNoticePage";
import NoticeAttachmentsDialog from "./components/NoticeAttachmentsDialog";
import Carousel from "./components/Carousel";
import { RIGHT_NOTICE_SEARCH } from "./constants";

const ROUTE_NOTICES = "notice/notices";
const ROUTE_NOTICE_EDIT = "notice/notice";
const ROUTE_ALL_NOTICE_PAGE = "notice/allNotices";

const DEFAULT_CONFIG = {
  "translations": [{ key: "en", messages: messages_en }],
  "reducers": [{ key: "notice", reducer }],
  "core.MainMenu": [
    {
      name: "NoticeMainMenu",
      id: "notice.MainMenu",
      icon: "ScreenShare",
      text: "notice.mainMenu",
    }
  ],
  "notice.MainMenu": [
    { route: ROUTE_NOTICES },
    { route: ROUTE_ALL_NOTICE_PAGE }
  ],
  "core.Router": [
    {
      path: ROUTE_NOTICES,
      id: "notice.notices",
      icon: "ListAlt",
      text: "notice.mainMenu",
      rights: [RIGHT_NOTICE_SEARCH],
      component: withLegacyTheme(NoticesPage)
    },
    {
      path: ROUTE_NOTICE_EDIT + "/:notice_uuid?",
      id: "notice.notice",
      rights: [RIGHT_NOTICE_SEARCH],
      component: withLegacyTheme(NoticePage)
    },
    {
      path: ROUTE_ALL_NOTICE_PAGE,
      id: "notice.allNotices",
      icon: "ListAlt",
      text: "notice.mainMenu.published",
      rights: [RIGHT_NOTICE_SEARCH],
      component: withLegacyTheme(AllNoticePage)
    }
  ],
  "refs": [
    { key: "notice.route.notices", ref: ROUTE_NOTICES },
    { key: "notice.route.noticeEdit", ref: ROUTE_NOTICE_EDIT },
    { key: "notice.route.allNotices", ref: ROUTE_ALL_NOTICE_PAGE },
    { key: "notice.allNotices", ref: withLegacyTheme(AllNoticePage) },
    { key: "notice.AttachmentDialog", ref: withLegacyTheme(NoticeAttachmentsDialog) },
    { key: "notice.Carousel", ref: withLegacyTheme(Carousel) },
  ],
};

export const NoticeModule = (cfg) => {
  return { ...DEFAULT_CONFIG, ...cfg };
};
