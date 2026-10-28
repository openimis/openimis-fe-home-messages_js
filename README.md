# openIMIS Frontend Notice Module

The Notice module provides message management and a published message board for the openIMIS frontend assembly (`openimis-fe_js`).

- Repository: [openimis/openimis-fe-notice_js](https://github.com/openimis/openimis-fe-notice_js)
- npm package: `@openimis/fe-notice`
- Module export: `NoticeModule`
- Backend: [openimis/openimis-be-notice_py](https://github.com/openimis/openimis-be-notice_py), distributed as `openimis-be-notice`

## Published message board

Open **Notices → Published** to view the message board at `notice/allNotices`.

The board uses a compact **Messages** icon and label instead of a large title panel. The outlined **Accessibility** button includes an accessibility icon and an expand/collapse arrow. Reading controls are collapsed initially; click the button to show or hide them.

Available reading controls include text size, text color, line spacing, high contrast, a dyslexia-friendly font option, and a magnifier. Collapsing the controls preserves the selected settings for the current page session. Controls wrap on smaller screens.

The existing message list, dates, priority indicators, pagination, edit actions, and attachment preview remain in place. Users with the create permission can access the add-message action.

## Display on the home page

```jsx
// To display Notices on your home page:
// import { PublishedComponent } from "@openimis/fe-core";
//
// Render inside the home page:
// <PublishedComponent pubRef="notice.allNotices" />
//
// NoticeModule must be enabled in the frontend assembly.
// Keep "notice.allNotices" as the reference name for compatibility.
```

## Assembly integration

For a local checkout named `NoticeModule`, add this entry to the frontend assembly's module manifest:

```json
{
  "name": "NoticeModule",
  "logicalName": "fe-notice",
  "npm": "@openimis/fe-notice@file:../frontend-packages/NoticeModule"
}
```

Adjust the `file:` path to match your checkout. The package name is defined in `package.json`.

Regenerate the assembly module registry and Vite aliases using its configuration generator, then refresh the assembly's local dependency links. Do not hand-edit generated `src/modules.jsx`.

The assembly supplies shared React, Redux, MUI, and openIMIS Core dependencies. See the assembly's development instructions for the supported installation workflow.

## Build

With the module dependencies installed and a Node.js version supported by the installed Vite version:

```sh
npm run build
```

The build writes `dist/index.es.js` and `dist/index.cjs.js`. Local development uses the module's `src` directory through the assembly's Vite alias.

## Routes and permissions

Routes are relative to the assembly base URL, commonly `/front/`.

| Route | Purpose |
| --- | --- |
| `notice/notices` | Message management and search |
| `notice/notice/:notice_uuid?` | Create or edit a message |
| `notice/allNotices` | Published message board |

The registered routes require search permission `112001`. The module defines the following action permissions in `src/constants.js`; backend permissions remain authoritative.

| Permission | Action |
| --- | --- |
| `112001` | Search messages |
| `112002` | Create messages |
| `112003` | Update messages |
| `112004` | Delete messages |
| `112005` | Toggle message status |
| `112006` | Send email |
| `112007` | Send SMS |

## Module contributions

`src/index.js` registers English translations, the `notice` Redux reducer, the Notices main menu, and the routes above.

Published references:

| Reference | Value |
| --- | --- |
| `notice.route.notices` | Management route |
| `notice.route.noticeEdit` | Create/edit route |
| `notice.route.allNotices` | Published board route |
| `notice.allNotices` | Published board component |
| `notice.AttachmentDialog` | Attachment dialog component |
| `notice.Carousel` | Attachment carousel component |

Module configuration is merged with the default contributions by `NoticeModule(cfg)`. The assembly entry above uses `logicalName: "fe-notice"`.

## Key source files

- `src/index.js`: module exports, routes, and contributions.
- `src/pages/AllNoticePage.jsx`: published board and accessibility toggle.
- `src/components/AccessibilityControls.jsx`: reading controls.
- `src/components/NoticeCardContent.jsx`: message content and metadata.
- `src/components/NoticeAttachmentsDialog.jsx`: attachment management.
- `src/actions.jsx` and `src/reducer.js`: GraphQL requests and Redux state.
- `src/translations/en.json`: UI labels, including Messages and Accessibility.
