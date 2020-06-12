var CONFIG = {
    enableSandboxes: false,
    fhirVersions: [
        {
            name: "r4",
            displayName: "R4",
            tags: [
                {
                    id: "r4-cqf-ruler",
                    value: "r4-cqf-ruler",
                    displayName: "CQF Ruler",
                    description: "CQF Ruler"
                }
            ]
        }
    ],
    simulatedErrors: [
        {
            name : "auth_invalid_client_id",
            label: "Authorize - Invalid Client Id",
            for  : ["launch-ehr", "launch-pp", "launch-prov", "launch-pt"]
        },
        {
            name : "auth_invalid_redirect_uri",
            label: "Authorize - Invalid Redirect Url",
            for  : ["launch-ehr", "launch-pp", "launch-prov", "launch-pt"]
        },
        {
            name : "auth_invalid_scope",
            label: "Authorize - Invalid Scope",
            for  : ["launch-ehr", "launch-pp", "launch-prov", "launch-pt"]
        },
        {
            name : "auth_invalid_client_secret",
            label: "Token - Invalid Client Secret (for confidential clients)",
            for  : ["launch-ehr", "launch-pp", "launch-prov", "launch-pt"]
        },
        {
            name : "token_invalid_token",
            label: "Token - Invalid Token",
            for  : ["launch-ehr", "launch-pp", "launch-prov", "launch-pt", "launch-bs"]
        },
        {
            name : "token_expired_refresh_token",
            label: "Token - Expired Refresh Token",
            for  : ["launch-ehr", "launch-pp", "launch-prov", "launch-pt"]
        },
        {
            name : "token_expired_registration_token",
            label: "Token - Expired Registration Token (for backend services)",
            for  : ["launch-bs"]
        },
        {
            name : "token_invalid_scope",
            label: "Token - Invalid Scope",
            for  : ["launch-bs"]
        },
        {
            name : "invalid_jti",
            label: "Token - Invalid 'jti' Value (for backend services)",
            for  : ["launch-bs"]
        },
        {
            name : "request_invalid_token",
            label: "Request - Invalid Token",
            for  : ["launch-ehr", "launch-pp", "launch-prov", "launch-pt", "launch-bs"]
        },
        {
            name : "request_expired_token",
            label: "Request - Expired Token",
            for  : ["launch-ehr", "launch-pp", "launch-prov", "launch-pt", "launch-bs"]
        }
    ]
};