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
    ]
};