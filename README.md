# openIMIS Frontend Home Messages Module

Home Messages provides message management and a published message board for the openIMIS frontend assembly (`openimis-fe_js`).

- Repository: [openimis/openimis-fe-home-messages_js](https://github.com/openimis/openimis-fe-home-messages_js)
- npm package: `@openimis/fe-home-messages`
- Module export: `HomeMessagesModule`
- Backend: [openimis/openimis-be-home-messages_py](https://github.com/openimis/openimis-be-home-messages_py), distributed as `openimis-be-home-messages`

## Published message board

Open **Home Messages → Published** to view the message board at `notice/allNotices`.

The board uses a compact **Messages** icon and label instead of a large title panel. The outlined **Accessibility** button includes an accessibility icon and an expand/collapse arrow. Reading controls are collapsed initially; click the button to show or hide them.

Available reading controls include text size, text color, line spacing, high contrast, a dyslexia-friendly font option, and a magnifier. Collapsing the controls preserves the selected settings for the current page session. Controls wrap on smaller screens.

The existing message list, dates, priority indicators, pagination, edit actions, and attachment preview remain in place. Users with the create permission can access the add-message action.

## Display on the home page

```jsx
// To display Home Messages on your home page:
// import { PublishedComponent } from "@openimis/fe-core";
//
// Render inside the home page:
// <PublishedComponent pubRef="notice.allNotices" />
//
// HomeMessagesModule must be enabled in the frontend assembly.
// Keep "notice.allNotices" as the reference name for compatibility.
```

## Assembly integration

For a local checkout named `HomeMessagesModule`, add this entry to the frontend assembly's module manifest:

```json
{
  "name": "HomeMessagesModule",
  "logicalName": "fe-home-messages",
  "npm": "@openimis/fe-home-messages@file:../frontend-packages/HomeMessagesModule"
}
```

Adjust the `file:` path to match your checkout. If your local folder is still named `NoticeModule`, use `file:../frontend-packages/NoticeModule` instead. The package name is defined in `package.json`.

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

`src/index.js` registers English translations, the `notice` Redux reducer, the Home Messages main menu, and the routes above.

Published references:

| Reference | Value |
| --- | --- |
| `notice.route.notices` | Management route |
| `notice.route.noticeEdit` | Create/edit route |
| `notice.route.allNotices` | Published board route |
| `notice.allNotices` | Published board component |
| `notice.AttachmentDialog` | Attachment dialog component |
| `notice.Carousel` | Attachment carousel component |

Module configuration is merged with the default contributions by `HomeMessagesModule(cfg)`. The assembly entry above uses `logicalName: "fe-home-messages"`. If your assembly has existing configuration under `fe-notice`, move it to `fe-home-messages` or retain `logicalName: "fe-notice"` to continue using it.

## Compatibility with the former Notice module

`NoticeModule` remains an export alias for `HomeMessagesModule`. Existing URLs, GraphQL operation names, Redux keys, translation keys, and extension identifiers retain the `notice` namespace.

The backend Python package and Django app label also remain `notice`, preserving database tables and migration history. The package rename requires no database migration or data reset.

The GitHub repositories have been renamed to `openimis-fe-home-messages_js` and `openimis-be-home-messages_py`. Local checkout folders may still use their original names. Renaming source metadata does not publish a new npm or PyPI release; use a local package or a release that is actually available when configuring an assembly.

## Key source files

- `src/index.js`: module exports, routes, and contributions.
- `src/pages/AllNoticePage.jsx`: published board and accessibility toggle.
- `src/components/AccessibilityControls.jsx`: reading controls.
- `src/components/NoticeCardContent.jsx`: message content and metadata.
- `src/components/NoticeAttachmentsDialog.jsx`: attachment management.
- `src/actions.jsx` and `src/reducer.js`: GraphQL requests and Redux state.
- `src/translations/en.json`: UI labels, including Messages and Accessibility.
