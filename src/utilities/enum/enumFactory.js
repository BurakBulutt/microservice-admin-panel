import {CommentTypeEnum, ContentTypeEnum, XmlDefinitionTypeEnum} from "./enums";

export default function (enumType) {
    switch (enumType) {
        case "contentType": return ContentTypeEnum;
        case "xmlDefinitionType": return XmlDefinitionTypeEnum;
        case "commentType" : return CommentTypeEnum;
        default: throw new Error("Unsupported Enum Type");
    }
}