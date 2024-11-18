// This file is auto-generated by @hey-api/openapi-ts

import { createClient, createConfig, type Options, urlSearchParamsBodySerializer } from '@hey-api/client-axios';
import { type LoginLoginAccessTokenData, type LoginLoginAccessTokenError, type LoginLoginAccessTokenResponse, type LoginTestTokenError, type LoginTestTokenResponse, type LoginRecoverPasswordData, type LoginRecoverPasswordError, type LoginRecoverPasswordResponse, type LoginResetPasswordData, type LoginResetPasswordError, type LoginResetPasswordResponse, type LoginRecoverPasswordHtmlContentData, type LoginRecoverPasswordHtmlContentError, type LoginRecoverPasswordHtmlContentResponse, type UsersReadUsersData, type UsersReadUsersError, type UsersReadUsersResponse, type UsersCreateUserData, type UsersCreateUserError, type UsersCreateUserResponse, type UsersReadUserMeError, type UsersReadUserMeResponse, type UsersDeleteUserMeError, type UsersDeleteUserMeResponse, type UsersUpdateUserMeData, type UsersUpdateUserMeError, type UsersUpdateUserMeResponse, type UsersUpdatePasswordMeData, type UsersUpdatePasswordMeError, type UsersUpdatePasswordMeResponse, type UsersRegisterUserData, type UsersRegisterUserError, type UsersRegisterUserResponse, type UsersReadUserByIdData, type UsersReadUserByIdError, type UsersReadUserByIdResponse, type UsersUpdateUserData, type UsersUpdateUserError, type UsersUpdateUserResponse, type UsersDeleteUserData, type UsersDeleteUserError, type UsersDeleteUserResponse, type UtilsTestEmailData, type UtilsTestEmailError, type UtilsTestEmailResponse, type UtilsHealthCheckError, type UtilsHealthCheckResponse, type ItemsReadItemsData, type ItemsReadItemsError, type ItemsReadItemsResponse, type ItemsCreateItemData, type ItemsCreateItemError, type ItemsCreateItemResponse, type ItemsReadItemData, type ItemsReadItemError, type ItemsReadItemResponse, type ItemsUpdateItemData, type ItemsUpdateItemError, type ItemsUpdateItemResponse, type ItemsDeleteItemData, type ItemsDeleteItemError, type ItemsDeleteItemResponse, type PatientsReadPatientsData, type PatientsReadPatientsError, type PatientsReadPatientsResponse, type PatientsCreatePatientData, type PatientsCreatePatientError, type PatientsCreatePatientResponse, type PatientsReadPatientData, type PatientsReadPatientError, type PatientsReadPatientResponse, type PatientsUpdatePatientData, type PatientsUpdatePatientError, type PatientsUpdatePatientResponse, type PatientsDeletePatientData, type PatientsDeletePatientError, type PatientsDeletePatientResponse, type DiseasesReadDiseasesData, type DiseasesReadDiseasesError, type DiseasesReadDiseasesResponse, type DiseasesCreateDiseaseData, type DiseasesCreateDiseaseError, type DiseasesCreateDiseaseResponse, type DiseasesReadDiseaseData, type DiseasesReadDiseaseError, type DiseasesReadDiseaseResponse, type DiseasesUpdateDiseaseData, type DiseasesUpdateDiseaseError, type DiseasesUpdateDiseaseResponse, type DiseasesDeleteDiseaseData, type DiseasesDeleteDiseaseError, type DiseasesDeleteDiseaseResponse, DiseasesReadDiseasesResponseTransformer, DiseasesCreateDiseaseResponseTransformer, DiseasesReadDiseaseResponseTransformer, DiseasesUpdateDiseaseResponseTransformer } from './types.gen';

export const client = createClient(createConfig());

/**
 * Login Access Token
 * OAuth2 compatible token login, get an access token for future requests
 */
export const loginLoginAccessToken = <ThrowOnError extends boolean = false>(options: Options<LoginLoginAccessTokenData, ThrowOnError>) => {
    return (options?.client ?? client).post<LoginLoginAccessTokenResponse, LoginLoginAccessTokenError, ThrowOnError>({
        ...options,
        ...urlSearchParamsBodySerializer,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            ...options?.headers
        },
        url: '/api/v1/login/access-token'
    });
};

/**
 * Test Token
 * Test access token
 */
export const loginTestToken = <ThrowOnError extends boolean = false>(options?: Options<unknown, ThrowOnError>) => {
    return (options?.client ?? client).post<LoginTestTokenResponse, LoginTestTokenError, ThrowOnError>({
        ...options,
        url: '/api/v1/login/test-token'
    });
};

/**
 * Recover Password
 * Password Recovery
 */
export const loginRecoverPassword = <ThrowOnError extends boolean = false>(options: Options<LoginRecoverPasswordData, ThrowOnError>) => {
    return (options?.client ?? client).post<LoginRecoverPasswordResponse, LoginRecoverPasswordError, ThrowOnError>({
        ...options,
        url: '/api/v1/password-recovery/{email}'
    });
};

/**
 * Reset Password
 * Reset password
 */
export const loginResetPassword = <ThrowOnError extends boolean = false>(options: Options<LoginResetPasswordData, ThrowOnError>) => {
    return (options?.client ?? client).post<LoginResetPasswordResponse, LoginResetPasswordError, ThrowOnError>({
        ...options,
        url: '/api/v1/reset-password/'
    });
};

/**
 * Recover Password Html Content
 * HTML Content for Password Recovery
 */
export const loginRecoverPasswordHtmlContent = <ThrowOnError extends boolean = false>(options: Options<LoginRecoverPasswordHtmlContentData, ThrowOnError>) => {
    return (options?.client ?? client).post<LoginRecoverPasswordHtmlContentResponse, LoginRecoverPasswordHtmlContentError, ThrowOnError>({
        ...options,
        url: '/api/v1/password-recovery-html-content/{email}'
    });
};

/**
 * Read Users
 * Retrieve users.
 */
export const usersReadUsers = <ThrowOnError extends boolean = false>(options?: Options<UsersReadUsersData, ThrowOnError>) => {
    return (options?.client ?? client).get<UsersReadUsersResponse, UsersReadUsersError, ThrowOnError>({
        ...options,
        url: '/api/v1/users/'
    });
};

/**
 * Create User
 * Create new user.
 */
export const usersCreateUser = <ThrowOnError extends boolean = false>(options: Options<UsersCreateUserData, ThrowOnError>) => {
    return (options?.client ?? client).post<UsersCreateUserResponse, UsersCreateUserError, ThrowOnError>({
        ...options,
        url: '/api/v1/users/'
    });
};

/**
 * Read User Me
 * Get current user.
 */
export const usersReadUserMe = <ThrowOnError extends boolean = false>(options?: Options<unknown, ThrowOnError>) => {
    return (options?.client ?? client).get<UsersReadUserMeResponse, UsersReadUserMeError, ThrowOnError>({
        ...options,
        url: '/api/v1/users/me'
    });
};

/**
 * Delete User Me
 * Delete own user.
 */
export const usersDeleteUserMe = <ThrowOnError extends boolean = false>(options?: Options<unknown, ThrowOnError>) => {
    return (options?.client ?? client).delete<UsersDeleteUserMeResponse, UsersDeleteUserMeError, ThrowOnError>({
        ...options,
        url: '/api/v1/users/me'
    });
};

/**
 * Update User Me
 * Update own user.
 */
export const usersUpdateUserMe = <ThrowOnError extends boolean = false>(options: Options<UsersUpdateUserMeData, ThrowOnError>) => {
    return (options?.client ?? client).patch<UsersUpdateUserMeResponse, UsersUpdateUserMeError, ThrowOnError>({
        ...options,
        url: '/api/v1/users/me'
    });
};

/**
 * Update Password Me
 * Update own password.
 */
export const usersUpdatePasswordMe = <ThrowOnError extends boolean = false>(options: Options<UsersUpdatePasswordMeData, ThrowOnError>) => {
    return (options?.client ?? client).patch<UsersUpdatePasswordMeResponse, UsersUpdatePasswordMeError, ThrowOnError>({
        ...options,
        url: '/api/v1/users/me/password'
    });
};

/**
 * Register User
 * Create new user without the need to be logged in.
 */
export const usersRegisterUser = <ThrowOnError extends boolean = false>(options: Options<UsersRegisterUserData, ThrowOnError>) => {
    return (options?.client ?? client).post<UsersRegisterUserResponse, UsersRegisterUserError, ThrowOnError>({
        ...options,
        url: '/api/v1/users/signup'
    });
};

/**
 * Read User By Id
 * Get a specific user by id.
 */
export const usersReadUserById = <ThrowOnError extends boolean = false>(options: Options<UsersReadUserByIdData, ThrowOnError>) => {
    return (options?.client ?? client).get<UsersReadUserByIdResponse, UsersReadUserByIdError, ThrowOnError>({
        ...options,
        url: '/api/v1/users/{user_id}'
    });
};

/**
 * Update User
 * Update a user.
 */
export const usersUpdateUser = <ThrowOnError extends boolean = false>(options: Options<UsersUpdateUserData, ThrowOnError>) => {
    return (options?.client ?? client).patch<UsersUpdateUserResponse, UsersUpdateUserError, ThrowOnError>({
        ...options,
        url: '/api/v1/users/{user_id}'
    });
};

/**
 * Delete User
 * Delete a user.
 */
export const usersDeleteUser = <ThrowOnError extends boolean = false>(options: Options<UsersDeleteUserData, ThrowOnError>) => {
    return (options?.client ?? client).delete<UsersDeleteUserResponse, UsersDeleteUserError, ThrowOnError>({
        ...options,
        url: '/api/v1/users/{user_id}'
    });
};

/**
 * Test Email
 * Test emails.
 */
export const utilsTestEmail = <ThrowOnError extends boolean = false>(options: Options<UtilsTestEmailData, ThrowOnError>) => {
    return (options?.client ?? client).post<UtilsTestEmailResponse, UtilsTestEmailError, ThrowOnError>({
        ...options,
        url: '/api/v1/utils/test-email/'
    });
};

/**
 * Health Check
 */
export const utilsHealthCheck = <ThrowOnError extends boolean = false>(options?: Options<unknown, ThrowOnError>) => {
    return (options?.client ?? client).get<UtilsHealthCheckResponse, UtilsHealthCheckError, ThrowOnError>({
        ...options,
        url: '/api/v1/utils/health-check/'
    });
};

/**
 * Read Items
 * Retrieve items.
 */
export const itemsReadItems = <ThrowOnError extends boolean = false>(options?: Options<ItemsReadItemsData, ThrowOnError>) => {
    return (options?.client ?? client).get<ItemsReadItemsResponse, ItemsReadItemsError, ThrowOnError>({
        ...options,
        url: '/api/v1/items/'
    });
};

/**
 * Create Item
 * Create new item.
 */
export const itemsCreateItem = <ThrowOnError extends boolean = false>(options: Options<ItemsCreateItemData, ThrowOnError>) => {
    return (options?.client ?? client).post<ItemsCreateItemResponse, ItemsCreateItemError, ThrowOnError>({
        ...options,
        url: '/api/v1/items/'
    });
};

/**
 * Read Item
 * Get item by ID.
 */
export const itemsReadItem = <ThrowOnError extends boolean = false>(options: Options<ItemsReadItemData, ThrowOnError>) => {
    return (options?.client ?? client).get<ItemsReadItemResponse, ItemsReadItemError, ThrowOnError>({
        ...options,
        url: '/api/v1/items/{id}'
    });
};

/**
 * Update Item
 * Update an item.
 */
export const itemsUpdateItem = <ThrowOnError extends boolean = false>(options: Options<ItemsUpdateItemData, ThrowOnError>) => {
    return (options?.client ?? client).put<ItemsUpdateItemResponse, ItemsUpdateItemError, ThrowOnError>({
        ...options,
        url: '/api/v1/items/{id}'
    });
};

/**
 * Delete Item
 * Delete an item.
 */
export const itemsDeleteItem = <ThrowOnError extends boolean = false>(options: Options<ItemsDeleteItemData, ThrowOnError>) => {
    return (options?.client ?? client).delete<ItemsDeleteItemResponse, ItemsDeleteItemError, ThrowOnError>({
        ...options,
        url: '/api/v1/items/{id}'
    });
};

/**
 * Read Patients
 * Retrieve patients.
 */
export const patientsReadPatients = <ThrowOnError extends boolean = false>(options?: Options<PatientsReadPatientsData, ThrowOnError>) => {
    return (options?.client ?? client).get<PatientsReadPatientsResponse, PatientsReadPatientsError, ThrowOnError>({
        ...options,
        url: '/api/v1/patients/'
    });
};

/**
 * Create Patient
 * Create new patient.
 */
export const patientsCreatePatient = <ThrowOnError extends boolean = false>(options: Options<PatientsCreatePatientData, ThrowOnError>) => {
    return (options?.client ?? client).post<PatientsCreatePatientResponse, PatientsCreatePatientError, ThrowOnError>({
        ...options,
        url: '/api/v1/patients/'
    });
};

/**
 * Read Patient
 * Get patient by ID.
 */
export const patientsReadPatient = <ThrowOnError extends boolean = false>(options: Options<PatientsReadPatientData, ThrowOnError>) => {
    return (options?.client ?? client).get<PatientsReadPatientResponse, PatientsReadPatientError, ThrowOnError>({
        ...options,
        url: '/api/v1/patients/{id}'
    });
};

/**
 * Update Patient
 * Update a patient.
 */
export const patientsUpdatePatient = <ThrowOnError extends boolean = false>(options: Options<PatientsUpdatePatientData, ThrowOnError>) => {
    return (options?.client ?? client).put<PatientsUpdatePatientResponse, PatientsUpdatePatientError, ThrowOnError>({
        ...options,
        url: '/api/v1/patients/{id}'
    });
};

/**
 * Delete Patient
 * Delete a patient.
 */
export const patientsDeletePatient = <ThrowOnError extends boolean = false>(options: Options<PatientsDeletePatientData, ThrowOnError>) => {
    return (options?.client ?? client).delete<PatientsDeletePatientResponse, PatientsDeletePatientError, ThrowOnError>({
        ...options,
        url: '/api/v1/patients/{id}'
    });
};

/**
 * Read Diseases
 * Retrieve diseases.
 */
export const diseasesReadDiseases = <ThrowOnError extends boolean = false>(options?: Options<DiseasesReadDiseasesData, ThrowOnError>) => {
    return (options?.client ?? client).get<DiseasesReadDiseasesResponse, DiseasesReadDiseasesError, ThrowOnError>({
        ...options,
        url: '/api/v1/diseases/',
        responseTransformer: DiseasesReadDiseasesResponseTransformer
    });
};

/**
 * Create Disease
 * Create new disease record.
 */
export const diseasesCreateDisease = <ThrowOnError extends boolean = false>(options: Options<DiseasesCreateDiseaseData, ThrowOnError>) => {
    return (options?.client ?? client).post<DiseasesCreateDiseaseResponse, DiseasesCreateDiseaseError, ThrowOnError>({
        ...options,
        url: '/api/v1/diseases/',
        responseTransformer: DiseasesCreateDiseaseResponseTransformer
    });
};

/**
 * Read Disease
 * Get disease by ID.
 */
export const diseasesReadDisease = <ThrowOnError extends boolean = false>(options: Options<DiseasesReadDiseaseData, ThrowOnError>) => {
    return (options?.client ?? client).get<DiseasesReadDiseaseResponse, DiseasesReadDiseaseError, ThrowOnError>({
        ...options,
        url: '/api/v1/diseases/{id}',
        responseTransformer: DiseasesReadDiseaseResponseTransformer
    });
};

/**
 * Update Disease
 * Update a disease record.
 */
export const diseasesUpdateDisease = <ThrowOnError extends boolean = false>(options: Options<DiseasesUpdateDiseaseData, ThrowOnError>) => {
    return (options?.client ?? client).put<DiseasesUpdateDiseaseResponse, DiseasesUpdateDiseaseError, ThrowOnError>({
        ...options,
        url: '/api/v1/diseases/{id}',
        responseTransformer: DiseasesUpdateDiseaseResponseTransformer
    });
};

/**
 * Delete Disease
 * Delete a disease record.
 */
export const diseasesDeleteDisease = <ThrowOnError extends boolean = false>(options: Options<DiseasesDeleteDiseaseData, ThrowOnError>) => {
    return (options?.client ?? client).delete<DiseasesDeleteDiseaseResponse, DiseasesDeleteDiseaseError, ThrowOnError>({
        ...options,
        url: '/api/v1/diseases/{id}'
    });
};