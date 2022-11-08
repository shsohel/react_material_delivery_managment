const apiVersion = 2;

export const urls_v2 = {
  confirmationToken: {
    get_all_valid_representative_info: `/api/v${apiVersion}/ConfirmationToken/get-all-valid-representative-info`,
    get_user_confirmation_token: `/api/v${apiVersion}/ConfirmationToken/get-user-confirmation-token`,
    generate_loading_confirmation_token: `/api/v${apiVersion}/ConfirmationToken/generate-loading-confirmation-token`,
    validate_loading_confirmation_token: `/api/v${apiVersion}/ConfirmationToken/validate-loading-confirmation-token`,
    confirm_loading_process: `/api/v${apiVersion}/ConfirmationToken/confirm-loading-process`
  }
};
