import {
  graphql,
  formatPageQuery,
  formatPageQueryWithCount,
  formatMutation,
  decodeId
} from "@openimis/fe-core";

export function fetchNotice(mm, uuid) {
  let projections = [
    "id", "uuid", "title", "description", "priority",
    "healthFacility {id code name}", "createdAt", "updatedAt", "isActive",
    "schedulePublish", "publishStartDate"
  ];
  const payload = formatPageQuery("notices", [`uuid: "${uuid}"`], projections);
  return graphql(payload, "GET_NOTICE");
}

export function fetchNotices(mm, prms) {
  const payload = formatPageQueryWithCount(
    "notices",
    prms,
    [
      "id",
      "uuid",
      "title",
      "priority",
      "healthFacility {id code name }",
      "createdAt",
      "updatedAt",
      "isActive",
      "schedulePublish",
      "publishStartDate",
      "validityFrom",
      "validityTo",
    ]
  );
  return graphql(payload, "FETCH_NOTICES");
}

export function getNotice(mm, notice_uuid) {
  var filters = [];
  filters.push(`uuid: "${notice_uuid}"`);
  var projections = [
    "id",
    "uuid",
    "title",
    "description",
    "priority",
    "healthFacility {id code name }",
    "createdAt",
    "updatedAt",
    "isActive",
    "schedulePublish",
    "publishStartDate"
  ];
  const payload = formatPageQuery(
    "notices",
    filters,
    projections
  );
  return graphql(
    payload,
    "GET_NOTICE"
  );
}

const formatAttachmentsGQL = (attachments = []) =>
  attachments.map((a) => `{
        generalType: "${a.generalType}"
        type: "${a.type || ""}"
        title: "${a.title || ""}"
        ${a.date ? `date: "${a.date}"` : ""}
        filename: "${a.filename || ""}"
        mime: "${a.mime || ""}"
        ${a.document ? `document: "${a.document}"` : ""}
        ${a.url ? `url: "${a.url}"` : ""}
      }`
  ).join(",");

const formatDateGQL = (date) => {
  if (!date) return "";
  if (typeof date === "string") {
    return date.split("T")[0];
  }
  if (date instanceof Date || (date && typeof date.toISOString === "function")) {
    return date.toISOString().split("T")[0];
  }
  return String(date);
};

const sanitizeLabel = (label) => (typeof label === "string" ? label.replace(/"/g, "'") : label);

export function createNotice(mm, notice, clientMutationLabel, clientMutationDetails = null) {
  const attachmentsGQL =
    notice.attachments?.length
      ? `attachments: [${formatAttachmentsGQL(notice.attachments)}]`
      : "";
  const pubDate = formatDateGQL(notice.publishStartDate);
  const createdDate = formatDateGQL(notice.createdAt);

  let noticeGQL = `
    title: ${JSON.stringify(notice.title)}
    description: ${JSON.stringify(notice.description)}
    priority: "${notice.priority}"
    ${notice.healthFacility ? `healthFacilityId: ${decodeId(notice.healthFacility.id)}` : ''}
    ${notice.uuid ? `uuid: "${notice.uuid}"` : ''}
    schedulePublish: ${notice.schedulePublish !== undefined ? notice.schedulePublish : false}
    ${pubDate ? `publishStartDate: "${pubDate}"` : ''}
    ${createdDate ? `createdAt: "${createdDate}"` : ''}
    ${attachmentsGQL}
  `;

  const safeLabel = sanitizeLabel(clientMutationLabel);
  let mutation = formatMutation("createNotice", noticeGQL, safeLabel, clientMutationDetails);
  var requestedDateTime = new Date();

  return graphql(
    mutation.payload,
    ['NOTICE_MUTATION_REQ', 'NOTICE_MUTATION_RESP', 'NOTICE_MUTATION_ERR'],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel: safeLabel,
      clientMutationDetails: clientMutationDetails ? JSON.stringify(clientMutationDetails) : null,
      requestedDateTime
    }
  );
}

export function updateNotice(mm, notice, clientMutationLabel, clientMutationDetails = null) {
  const pubDate = formatDateGQL(notice.publishStartDate);
  const createdDate = formatDateGQL(notice.createdAt);

  let noticeGQL = `
    uuid: "${notice.uuid || notice.id}"
    title: ${JSON.stringify(notice.title)}
    description: ${JSON.stringify(notice.description)}
    priority: "${notice.priority}"
    healthFacilityId: ${notice.healthFacility ? decodeId(notice.healthFacility.id) : 0}
    schedulePublish: ${notice.schedulePublish !== undefined ? notice.schedulePublish : false}
    ${pubDate ? `publishStartDate: "${pubDate}"` : ''}
    ${createdDate ? `createdAt: "${createdDate}"` : ''}
  `;

  const safeLabel = sanitizeLabel(clientMutationLabel);
  let mutation = formatMutation("updateNotice", noticeGQL, safeLabel, clientMutationDetails);
  var requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    ['NOTICE_MUTATION_REQ', 'NOTICE_UPDATE_RESP', 'NOTICE_MUTATION_ERR'],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel: safeLabel,
      clientMutationDetails: !!clientMutationDetails ? JSON.stringify(clientMutationDetails) : null,
      requestedDateTime
    }
  );
}

export function deleteNotice(mm, uuid, clientMutationLabel, clientMutationDetails = null) {
  const uuids = Array.isArray(uuid) ? uuid : [uuid];
  const uuidsGQL = uuids.map((u) => `"${u}"`).join(", ");
  const noticeGQL = `
    uuids: [${uuidsGQL}]
  `;

  const safeLabel = sanitizeLabel(clientMutationLabel);
  let mutation = formatMutation("deleteNotice", noticeGQL, safeLabel, clientMutationDetails);
  var requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    ['NOTICE_MUTATION_REQ', 'NOTICE_DELETE_RESP', 'NOTICE_MUTATION_ERR'],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel: safeLabel,
      clientMutationDetails: !!clientMutationDetails ? JSON.stringify(clientMutationDetails) : null,
      requestedDateTime
    }
  );
}

export function toggleNoticeStatus(mm, noticeId, isActive) {
  const mutation = `
    mutation {
      toggleNoticeStatus(uuid: "${noticeId}", isActive: ${isActive}) {
        success
        error
      }
    }
  `;
  return graphql(mutation, 'NOTICE_TOGGLE_STATUS', { uuid: noticeId, isActive });
}

const NOTICE_ATTACHMENTS_FULL_PROJECTION = () => [
  "id",
  "generalType:generalType",
  "type",
  "title",
  "date",
  "filename",
  "mime",
  "url",
  "doc",
];


export function fetchNoticeAttachments(notice) {
  const payload = formatPageQueryWithCount(
    "noticeAttachments",
    [`notice_Uuid: "${notice.uuid}"`],
    NOTICE_ATTACHMENTS_FULL_PROJECTION()
  );
  return graphql(payload, 'NOTICE_ATTACHMENTS');
}

export function downloadAttachment(attachment) {
  const payload = `
    mutation downloadAttachment {
      downloadAttachment(input: { uuid: "${attachment.uuid}" }) {
        attachment {
          document
          filename
        }
      }
    }
  `;
  return async (dispatch) => {
    const response = await dispatch(graphql(payload, "DOWNLOAD_ATTACHMENT"));
    if (response?.data?.downloadAttachment?.attachment) {
      const { document: docData, filename } = response.data.downloadAttachment.attachment;
      const decodedData = atob(docData);
      const byteNumbers = new Array(decodedData.length);
      for (let i = 0; i < decodedData.length; i++) {
        byteNumbers[i] = decodedData.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: attachment.mime });
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement("a");
      link.href = url;
      link.download = filename;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
    return response;
  };
}

export function deleteAttachment(attachment, clientMutationLabel) {
  const payload = `
    ${!!attachment?.id ? `id: "${attachment.id}"` : ""}
  `;

  const mutation = formatMutation("deleteNoticeAttachment", payload, clientMutationLabel);

  const requestedDateTime = new Date();

  return graphql(
    mutation.payload,
    [
      "NOTICE_ATTACHMENT_REQ",
      "DELETE_NOTICE_ATTACHMENT_RESP",
      "NOTICE_ATTACHMENT_ERR",
    ],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
      mutationLog: { clientMutationLabel },
    }
  );
}
export function createAttachment(attachment, clientMutationLabel) {
  const payload = `
    ${!!attachment.noticeUuid ? `noticeUuid: "${attachment.noticeUuid}"` : ""}
    ${!!attachment.generalType ? `generalType: "${attachment.generalType}"` : ""}
    ${!!attachment.type ? `type: "${attachment.type}"` : ""}
    ${!!attachment.title ? `title: "${attachment.title}"` : ""}
    ${!!attachment.date ? `date: "${attachment.date}"` : ""}
    ${!!attachment.filename ? `filename: "${attachment.filename}"` : ""}
    ${!!attachment.mime ? `mime: "${attachment.mime}"` : ""}
    ${!!attachment.url ? `url: "${attachment.url}"` : ""}
    ${!!attachment.document ? `document: "${attachment.document}"` : ""}
  `;


  const mutation = formatMutation("createNoticeAttachment", payload, clientMutationLabel); // Fix mutation name

  const requestedDateTime = new Date();

  return graphql(
    mutation.payload,
    ["NOTICE_ATTACHMENT_REQ", "CREATE_NOTICE_ATTACHMENT_RESP", "NOTICE_ATTACHMENT_ERR"],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
    }
  );
}
export function updateAttachment(attachment, clientMutationLabel) {
  const payload = `
    ${attachment.id ? `id: "${attachment.id}"` : ""}
    ${attachment.noticeUuid ? `noticeUuid: "${attachment.noticeUuid}"` : ""}
    ${attachment.generalType ? `generalType: "${attachment.generalType}"` : ""}
    ${attachment.type ? `type: "${attachment.type}"` : ""}
    ${attachment.title ? `title: "${attachment.title}"` : ""}
    ${attachment.date ? `date: "${attachment.date}"` : ""}
    ${attachment.filename ? `filename: "${attachment.filename}"` : ""}
    ${attachment.mime ? `mime: "${attachment.mime}"` : ""}
    ${attachment.url ? `url: "${attachment.url}"` : ""}
    ${attachment.document ? `document: "${attachment.document}"` : ""}
  `;
  const mutation = formatMutation("updateNoticeAttachment", payload, clientMutationLabel);
  const requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    ["NOTICE_ATTACHMENT_REQ", "UPDATE_NOTICE_ATTACHMENT_RESP", "NOTICE_ATTACHMENT_ERR"],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
    }
  );
}
