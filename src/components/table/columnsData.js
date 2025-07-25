import header from "../header";

export const usersColumnsData = [
  {
    accessor: "firstName",
    type: "text",
    priority: 0,
  },
  {
    accessor: "lastName",
    type: "text",
    priority: 1,
  },
  {
    accessor: "createdTimestamp",
    type: "date",
    priority: 2,
    isSortable: true,
  },
  {
    accessor: "username",
    type: "text",
    priority: 3,
  },
  {
    accessor: "email",
    type: "text",
    priority: 4,
  },
  {
    accessor: "birthdate",
    type: "date",
    priority: 5,
    isSortable: true,
  },
  {
    accessor: "emailVerified",
    type: "boolean",
    booleanTrue: "verified",
    booleanFalse: "notVerified",
    priority: 6,
    isSortable: true,
  },
  {
    accessor: "enabled",
    type: "boolean",
    booleanTrue: "active",
    booleanFalse: "passive",
    priority: 7,
    isSortable: true,
  },
];

export const contentsColumnsData = [
  {
    header: "image",
    accessor: "photoUrl",
    type: "image",
    priority: 0,
  },
  {
    accessor: "name",
    type: "text",
    priority: 1,
  },
  {
    accessor: "startDate",
    type: "date",
    priority: 2,
    isSortable: true,
  },
  {
    accessor: "slug",
    type: "text",
    priority: 3,
    isSortable: true,
  },
  {
    header: "category",
    accessor: "categories",
    type: "list",
    listColor: "brand",
    nameLabel: "name",
    priority: 4,
  },
  {
    accessor: "type",
    type: "enum",
    enumType: "contentType",
    priority: 5,
    isSortable: true,
  },
  {
    accessor: "likeCount.likeCount",
    type: "number",
    priority: 6,
  },
  {
    accessor: "likeCount.dislikeCount",
    type: "number",
    priority: 7,
  },
];

export const mediaColumnsData = [
  {
    accessor: "name",
    type: "text",
    priority: 0,
  },
  {
    accessor: "description",
    type: "text",
    priority: 1,
  },
  {
    header: "episodeNumber",
    accessor: "count",
    type: "number",
    priority: 2,
    isSortable: true,
  },
  {
    accessor: "publishDate",
    type: "date",
    priority: 3,
    isSortable: true,
  },
  {
    accessor: "slug",
    type: "text",
    priority: 4,
    isSortable: true,
  },
  {
    accessor: "likeCount.likeCount",
    type: "number",
    priority: 5,
  },
  {
    accessor: "likeCount.dislikeCount",
    type: "number",
    priority: 6,
  },
];

export const commentColumnsData = [
  {
    header: "type",
    accessor: "commentType",
    type: "enum",
    enumType: "commentType",
    priority: 0,
    isSortable: true,
  },
  {
    accessor: "content",
    type: "modal",
    priority: 1,
  },
  {
    accessor: "user",
    type: "modal",
    priority: 2,
    isSortable: true,
  },
  {
    accessor: "target",
    type: "modal",
    priority: 3,
    isSortable: true,
  },
  {
    accessor: "parent",
    type: "modal",
    priority: 4,
    isSortable: true,
  },
  {
    header: "replyList",
    accessor: "commentList",
    type: "modal",
    priority: 5,
  },
  {
    accessor: "likeCount.likeCount",
    type: "number",
    priority: 6,
  },
  {
    accessor: "likeCount.dislikeCount",
    type: "number",
    priority: 7,
  },
];

export const categoryColumnsData = [
  {
    accessor: "name",
    type: "text",
    priority: 0,
  },
  {
    accessor: "description",
    type: "text",
    priority: 1,
  },
  {
    accessor: "slug",
    type: "text",
    priority: 2,
    isSortable: true,
  },
];

export const xmlDefinitionColumnsData = [
  {
    accessor: "fileName",
    type: "text",
    priority: 0,
  },
  {
    accessor: "type",
    type: "enum",
    enumType: "xmlDefinitionType",
    priority: 1,
    isSortable: true,
  },
  {
    header: "status",
    accessor: "success",
    type: "boolean",
    booleanTrue: "success",
    booleanFalse: "fail",
    priority: 2,
    isSortable: true,
  },
  {
    accessor: "errorMessage",
    type: "modal",
    priority: 3,
  },
];
export const entityLogColumnsData = [
  {
    accessor: "process",
    type: "enum",
    enumType: "processType",
    priority: 0,
    isSortable: true,
  },
  {
    accessor: "entity",
    type: "text",
    priority: 1,
    isSortable: true,
  },
  {
    accessor: "entityId",
    type: "text",
    priority: 2,
  },
  {
    accessor: "user",
    type: "modal",
    priority: 3,
    isSortable: true,
  },
];
export const fansubColumnsData = [
  {
    accessor: "name",
    type: "text",
    priority: 0,
  },
  {
    accessor: "url",
    type: "text",
    priority: 1,
  },
];
