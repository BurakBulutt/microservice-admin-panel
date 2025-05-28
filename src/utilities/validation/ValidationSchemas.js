import * as Yup from "yup";

const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const contentTypeOptions = ["SERIES", "MOVIE"];
const commentTypeOptions = ["COMMENT", "REPLY"];
const definitionTypeOptions = ["CONTENT", "MEDIA"];

export const UserCreateValidationSchema = Yup.object({
    firstName: Yup.string()
        .required("First Name is required")
        .trim()
        .min(1, "First Name cannot be blank"),

    lastName: Yup.string()
        .required("Last Name is required")
        .trim()
        .min(1, "Last Name cannot be blank"),

    username: Yup.string()
        .required("Username is required")
        .trim()
        .min(1, "Username cannot be blank"),

    email: Yup.string()
        .required("Email is required")
        .email("Should be a valid email format"),

    password: Yup.string()
        .required("Password is required")
        .matches(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9])[A-Za-z0-9\s~!@#$%^&*()_+\-={}:;"',<.>/?]{8,}$/,
            "Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character and be 8+ characters"
        ),

    passwordRe: Yup.string()
        .required("Password confirmation is required")
        .oneOf([Yup.ref("password")], "Passwords do not match"),

    isPasswordTemporary: Yup.boolean()
        .required("Temporary password switch is required"),

    enabled: Yup.boolean()
        .required("Enabled switch is required"),

    emailVerified: Yup.boolean()
        .required("Email verification switch is required"),

    birthdate: Yup.date()
        .required("Birthdate is required")
        .typeError("Birthdate must be a valid date"),
});

export const UserUpdateValidationSchema = Yup.object({
    firstName: Yup.string()
        .required("First Name is required")
        .trim()
        .min(1, "First Name cannot be blank"),

    lastName: Yup.string()
        .required("Last Name is required")
        .trim()
        .min(1, "Last Name cannot be blank"),

    email: Yup.string()
        .required("Email is required")
        .email("Should be a valid email format"),

    enabled: Yup.boolean()
        .required("Enabled switch is required"),

    emailVerified: Yup.boolean()
        .required("Email verified switch is required"),

    birthdate: Yup.date()
        .required("Birthdate is required")
        .typeError("Birthdate must be a valid date"),
});


export const UserChangePasswordValidationSchema = Yup.object({
    newPassword: Yup.string()
        .required("Password is required")
        .matches(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9])[A-Za-z0-9\s~!@#$%^&*()_+\-={}:;"',<.>/?]{8,}$/,
            "Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character and be 8+ characters"
        ),

    newPasswordRe: Yup.string()
        .required("Password confirmation is required")
        .oneOf([Yup.ref('newPassword')], "Passwords Do Not Match")
});

export const ContentValidationSchema = Yup.object({
    name: Yup.string()
        .required("Name is required")
        .trim()
        .min(1, "Name cannot be blank"),

    description: Yup.string()
        .nullable(),

    photoUrl: Yup.string()
        .nullable()
        .url("Photo URL must be valid"),

    slug: Yup.string()
        .required("Slug is required")
        .trim()
        .min(1, "Slug cannot be blank")
        .matches(slugRegex, "Invalid slug format"),

    startDate: Yup.date()
        .nullable()
        .typeError("Start date must be a valid date"),

    type: Yup.string()
        .required("Type is required")
        .oneOf(contentTypeOptions, "Invalid content type selected"),

    episodeTime: Yup.number()
        .nullable()
        .typeError("Episode time must be a number"),

    categoryIds: Yup.array()
        .of(Yup.string())
        .nullable()
});

export const MediaValidationSchema = Yup.object({
    description: Yup.string()
        .nullable(),

    contentId: Yup.string()
        .required("Content ID is required")
        .trim()
        .min(1, "Content ID cannot be blank"),

    count: Yup.number()
        .required("Count is required")
        .min(0, "Count must be at least 0")
        .typeError("Count must be a number"),

    publishDate: Yup.date()
        .nullable()
        .typeError("Publish date must be a valid date"),
});

export const FansubValidationSchema = Yup.object({
    name: Yup.string()
        .required("Fansub name is required")
        .trim()
        .min(1, "Fansub name cannot be blank"),

    url: Yup.string()
        .nullable(),
});

export const MediaSourceRequestValidationSchema = Yup.object({
    url: Yup.string()
        .required("Media source URL is required")
        .trim()
        .min(1, "URL cannot be blank"),

    type: Yup.string()
        .required("Source type is required"),

    mediaId: Yup.string()
        .required("Media ID is required")
        .trim()
        .min(1, "Media ID cannot be blank"),

    fansub: FansubValidationSchema
        .required("Fansub is required"),
});

export const UpdateMediaSourceValidationSchema = Yup.object({
    mediaSourceRequestList: Yup.array()
        .of(MediaSourceRequestValidationSchema)
        .required("Media source list is required"),
});

export const CategoryValidationSchema = Yup.object({
    name: Yup.string()
        .required("Name is required")
        .trim()
        .min(1, "Name cannot be blank"),

    description: Yup.string()
        .nullable(),

    slug: Yup.string()
        .required("Slug is required")
        .trim()
        .min(1, "Slug cannot be blank")
        .matches(slugRegex, "Invalid slug pattern"),
});

export const CommentCreateValidationSchema = Yup.object({
    content: Yup.string()
        .required("Content is required")
        .trim()
        .min(5, "Content must be at least 5 characters")
        .max(500, "Content must be at most 500 characters"),

    userId: Yup.string()
        .required("User is required")
        .trim()
        .min(1, "User ID cannot be blank"),

    type: Yup.string()
        .required("Type is required")
        .oneOf(commentTypeOptions, "Invalid comment type"),

    targetId: Yup.string()
        .when("type", {
            is: "COMMENT",
            then: (schema) => schema.required("Target ID is required"),
            otherwise: (schema) => schema.notRequired(),
        }),

    parentId: Yup.string()
        .when("type", {
            is: "REPLY",
            then: (schema) => schema.required("Parent ID is required"),
            otherwise: (schema) => schema.notRequired(),
        }),
});

export const CommentUpdateValidationSchema = Yup.object({
    content: Yup.string()
        .required("Content is required")
        .trim()
        .min(5, "Content must be at least 5 characters")
        .max(500, "Content must be at most 500 characters"),
});


export const XmlDefinitionValidationSchema = Yup.object({
    type: Yup.string()
        .required("Type is required")
        .oneOf(definitionTypeOptions, "Invalid type"),

    base64: Yup.string()
        .required("Base64 content is required")
        .trim()
        .min(1, "Base64 content cannot be blank"),
});


