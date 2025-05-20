import * as Yup from "yup";

const contentTypeOptions = ["SERIES", "MOVIE"];
const commentTypeOptions = ["COMMENT", "REPLY"];

export const UserCreateValidationSchema = Yup.object({
    firstName: Yup.string().required("First Name is Required"),
    lastName: Yup.string().required("Last Name is Required"),
    username: Yup.string().required("Username is Required"),
    email: Yup.string().required("Email Required")
        .email("Should be Mail Format"),
    password: Yup.string().required("Password is required")
        .min(8, "Password Must Be At Least 8 Characters")
        .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+=-{};:'<>,./?])[a-zA-Z0-9!@#$%^&*()_+=-{};:'<>,./?]{8,}$/, "Password Must Contain At Least One Uppercase Letter And One Special Character"),
    passwordRe: Yup.string().required("Password Re is Required")
        .oneOf([Yup.ref('password')], "Passwords Do Not Match"),
    isPasswordTemporary: Yup.bool().required("Temporary Password switch is Required"),
    enabled: Yup.bool().required("Enable Switch Required"),
    emailVerified: Yup.bool().required("Email Verify Switch Required"),
    birthdate: Yup.string().required("Birthdate is required"),
});

export const UserUpdateValidationSchema = Yup.object({
    firstName: Yup.string().required("First Name is Required"),
    lastName: Yup.string().required("Last Name is Required"),
    email: Yup.string().required("Email Required")
        .email("Should Be Mail Format"),
    enabled: Yup.bool().required("Enable Switch Required"),
    emailVerified: Yup.bool().required("Email Verify Switch Required"),
    birthdate: Yup.string().required("Birthdate is required"),
});

export const UserChangePasswordValidationSchema = Yup.object({
    newPassword: Yup.string().required("Password is required")
        .min(8, "Password Must Be At Least 8 Characters")
        .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+=-{};:'<>,./?])[a-zA-Z0-9!@#$%^&*()_+=-{};:'<>,./?]{8,}$/, "Password Must Contain At Least One Uppercase Letter And One Special Character"),
    newPasswordRe: Yup.string().required("Password Re is Required").oneOf([Yup.ref('newPassword')], "Passwords Do Not Match")
});

export const ContentValidationSchema = Yup.object({
    name: Yup.string().required("Name is Required"),
    description: Yup.string().required("Description is Required"),
    slug: Yup.string().required("Slug is Required"),
    startDate: Yup.date().required("Start Date is Required")
        .typeError("Type Error"),
    type: Yup.string().required("Type is Required")
        .oneOf(contentTypeOptions, "Option Error"),
    episodeTime: Yup.number().required("Episode is Required"),
    categories: Yup.array().required("Categories are Required")
        .min(1, "Minimum 1 Item")
});

export const MediaValidationSchema = Yup.object({
    description: Yup.string().required("Description is Required"),
    count: Yup.number().required("Count is Required"),
    publishDate: Yup.date().required("Publish Date is Required")
        .typeError("Type Error"),
});

export const CategoryValidationSchema = Yup.object({
    name: Yup.string().required("Name is Required"),
    description: Yup.string().required("Description is Required"),
    slug: Yup.string().required("Slug is Required"),
});

export const CommentCreateValidationSchema = Yup.object({
    content: Yup.string().required("Content is Required"),
    type: Yup.string()
        .required("Type is Required")
        .oneOf(commentTypeOptions, "Option Error"),
    userId: Yup.string().required("User is Required"),
    targetId: Yup.string()
        .when("type", {
            is: "COMMENT",
            then: (schema) => schema.required("Target is Required"),
            otherwise: (schema) => schema.notRequired()
        }),
    parentId: Yup.string()
        .when("type", {
            is: "REPLY",
            then: (schema) => schema.required("Parent is Required"),
            otherwise: (schema) => schema.notRequired()
        })
});

export const CommentUpdateValidationSchema = Yup.object({
    content: Yup.string().required("Content is Required"),
});

export const XmlDefinitionValidationSchema = Yup.object({
    type: Yup.string().required("Type is Required"),
    base64: Yup.string().required("File is Required"),
});

export const FansubValidationSchema = Yup.object({
    name: Yup.string().required("Name is Required"),
    url: Yup.string().notRequired(),
});
