/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BusinessRegistration } from '../models/BusinessRegistration';
import type { LoginRequest } from '../models/LoginRequest';
import type { PasswordUpdateRequest } from '../models/PasswordUpdateRequest';
import type { RefreshTokenRequest } from '../models/RefreshTokenRequest';
import type { TokenResponse } from '../models/TokenResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthenticationService {
    /**
     * Register Business
     * Register a new business with owner account (Direct Supabase)
     *
     * Creates:
     * - User account in Supabase Auth
     * - User profile in users table
     * - Business profile in businesses table
     * - Owner role in user_business_roles table
     * - Default business settings
     *
     * **Flow**: Frontend -> Dashboard Service -> Supabase (Direct)
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static registerBusinessApiV1AuthRegisterBusinessPost(
        requestBody: BusinessRegistration,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/register/business',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Login
     * Authenticate user and return session tokens (Through Backend)
     *
     * **Flow**: Frontend -> Dashboard Service -> Supabase Auth -> Backend Validation
     * @param requestBody
     * @returns TokenResponse Successful Response
     * @throws ApiError
     */
    public static loginApiV1AuthLoginPost(
        requestBody: LoginRequest,
    ): CancelablePromise<TokenResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Refresh Token
     * Refresh access token using refresh token
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static refreshTokenApiV1AuthRefreshPost(
        requestBody: RefreshTokenRequest,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/refresh',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Current User
     * Get current authenticated user profile
     *
     * Requires valid JWT token in Authorization header
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getCurrentUserApiV1AuthMeGet(): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/auth/me',
        });
    }
    /**
     * Logout
     * Logout current user and invalidate session
     * @returns void
     * @throws ApiError
     */
    public static logoutApiV1AuthLogoutPost(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/logout',
        });
    }
    /**
     * Request Password Reset
     * Request password reset email
     * @param email
     * @returns any Successful Response
     * @throws ApiError
     */
    public static requestPasswordResetApiV1AuthPasswordResetRequestPost(
        email: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/password/reset-request',
            query: {
                'email': email,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Password
     * Update user password (requires authentication)
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static updatePasswordApiV1AuthPasswordUpdatePost(
        requestBody: PasswordUpdateRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/password/update',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
