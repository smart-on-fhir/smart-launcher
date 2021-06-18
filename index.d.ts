declare namespace launcher {

    interface SMARTContext
    {
        refresh_token?: any
        scope: string
        sim_ehr?: boolean
    }

    interface RefreshToken
    {
        context?: SMARTContext
        client_id?: string
        scope: string
        user?: string
        iat?: any
        auth_error?: string
    }

    interface IDToken
    {
        /**
         * A string like "Practitioner/SMART-1234"
         */
        profile: string

        /**
         * A string like "Practitioner/SMART-1234"
         */
        fhirUser: string

        /**
         * The client id
         */
        aud: string

        /**
         * Random string
         */
        sub: string

        /**
         * FHIR service url
         */
        iss: string

        /**
         * This is typically assigned when signing the token,
         * this it is only guaranteed to exist in a parsed token
         */
        iat?: number

        /**
         * This is typically assigned when signing the token,
         * this it is only guaranteed to exist in a parsed token
         */
        exp?: number

        nonce?: string
    }

    interface CodeToken
    {
        redirect_uri: string
        accessTokensExpireIn?: number
        scope: string
        context?: SMARTContext
        user?: string
        auth_error?: string
        exp?: any
    }

    /**
     * We put "the client" in a token called ClientDetailsToken. We use it
     * as `code` parameter in the code flow. It is also part of the access
     * token.
     */
    interface ClientDetailsToken
    {
        accessTokensExpireIn?: number
        auth_error?: string
        context?: SMARTContext
        user?: string
        client_id?: string,

        /**
         * Scopes assigned at registration time
         */
        scope: string
        
        nonce?: string
        sde?: string
        iat?: any
    }


    interface sim {
        sim_ehr?: boolean
        auth_error?: string
        sde?: any
        
        patient?: string
        encounter?: string
        provider?: string
        
        launch_pt?: boolean
        launch_ehr?: boolean
        launch_prov?: boolean
        launch_cds?: boolean
        
        skip_login?: boolean
        skip_auth?: boolean
        
        aud_validated?: boolean
        select_encounter?: boolean

        context?: Record<string, any>
    }

    interface AccessToken {
        scope: string
        id_token?: any

        // "need_patient_banner": true,
        // "smart_style_url": "http://localhost:8443/smart-style.json",
        // "patient": "638dac50-edaf-49c7-8621-22972ff2d14f",
        // "encounter": "d2ecea1e-738d-448e-8074-7879e9f9c7b7",
        // "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250ZXh0Ijp7Im5lZWRfcGF0aWVudF9iYW5uZXIiOnRydWUsInNtYXJ0X3N0eWxlX3VybCI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODQ0My9zbWFydC1zdHlsZS5qc29uIiwicGF0aWVudCI6IjYzOGRhYzUwLWVkYWYtNDljNy04NjIxLTIyOTcyZmYyZDE0ZiIsImVuY291bnRlciI6ImQyZWNlYTFlLTczOGQtNDQ4ZS04MDc0LTc4NzllOWY5YzdiNyJ9LCJjbGllbnRfaWQiOiJ3aGF0ZXZlciIsInNjb3BlIjoicGF0aWVudC8qLiogdXNlci8qLiogbGF1bmNoIG9wZW5pZCBmaGlyVXNlciBwcm9maWxlIG9mZmxpbmVfYWNjZXNzIiwidXNlciI6IlByYWN0aXRpb25lci9TTUFSVC0xMjM0IiwiaWF0IjoxNjIzODY5OTkwLCJleHAiOjE2NTU0MDU5OTB9.X4ClWwta5mqxrd-JgEbmun8fzxwOmFfaN0HSh87dvLQ",
        // "token_type": "bearer",
        // "scope": "patient/*.* user/*.* launch openid fhirUser profile offline_access",
        // "client_id": "whatever",
        // "expires_in": 3600,
        // "id_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9maWxlIjoiUHJhY3RpdGlvbmVyL1NNQVJULTEyMzQiLCJmaGlyVXNlciI6IlByYWN0aXRpb25lci9TTUFSVC0xMjM0IiwiYXVkIjoid2hhdGV2ZXIiLCJzdWIiOiI3NmQ1M2ZmNmNjZDY5ZWEyN2YzMjM5MzgwYjMwMzliNGE4NzI5OTJmODE1MWViMzE4Y2UxODZlZDlmMmYzMTNjIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4NDQzIiwiaWF0IjoxNjIzODY5OTkxLCJleHAiOjE2MjM4NzM1OTF9.2Sas3KlZatLG4AsSnsizyGBXLSlAyN7lsPSBwLApFIDOgps_nw9zbCAjOgSBe3qTynDdADQhFG-_BR9-_Rkf2QySGW45HpToO3bM8kn8aVoeJogqd9ieRJoiPhLKUSDWlnxlnWUuRj5FWoqzp7P-gZ2kLjAzkCMqh_nMGV3bwvVIz6Ix4aTlhNEu9HT_DMT3eCba9tWkkzkFZlBhy1S_hlG07o3Q4el5HZGhUI9zUV_noGIlTsmHEHtvcGdSWdT9G1GmKy73RNYelw3pvuN1xHOpD2iMGoz0AIlJjSlvATurtAY5eQbnG_ow-Yf5AOsl56_rsyR-If06X53SIiODCA",
        // "iat": 1623869991,
        // "exp": 1623873591
    }
    
    interface AccessTokenResponse
    {
        access_token: string
        token_type: "bearer"
        expires_in: number
        scope: string

        id_token?: string
        refresh_token?: string
        patient?: string
        encounter?: string

        need_patient_banner?: boolean
        smart_style_url?: string
        intent?: string

        // client_id: string
        // code: string
        // state: string
    }
}