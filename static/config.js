var CONFIG = {
    enableSandboxes: false,
    fhirVersions: [
        {
            name: "r2",
            displayName: "R2 (DSTU2)",
            tags: [
                {
                    id: "r2-smart",
                    value: "smart-8-2017",
                    displayName: "SMART",
                    description: "Core SMART Sample Patients",
                    selected: true
                },
                {
                    id: "r2-synthea",
                    value: "synthea-8-2017",
                    displayName: "Synthea",
                    description: "SMART Synthea Sample Patients"
                }
            ]
        },
        {
            name: "r3",
            displayName: "R3 (STU3)",
            tags: [
                {
                    id: "r3-smart",
                    value: "smart-7-2017",
                    displayName: "SMART",
                    description: "Core SMART Sample Patients",
                    selected: true
                },
                {
                    id: "r3-synthea",
                    value: "synthea-7-2017",
                    displayName: "Synthea",
                    description: "SMART Synthea Sample Patients"
                },
                {
                    id: "r3-pro",
                    value: "pro-7-2017",
                    displayName: "PRO",
                    description: "SMART PRO Sample Patients"
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