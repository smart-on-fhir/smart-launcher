export default class Scope
{
    /**
     * In some circumstances, scopes must be represented as URIs. For example,
     * when exchanging what scopes users are allowed to have, or sharing what
     * scopes a user has chosen. When URI representations are required, the
     * SMART scopes SHALL be prefixed with http://smarthealthit.org/fhir/scopes/,
     * so that a patient/*.r scope would be
     * http://smarthealthit.org/fhir/scopes/patient/*.r.
     * 
     * For openID scopes the URI prefix of
     * http://openid.net/specs/openid-connect-core-1_0# SHALL be used.
     * 
     * Using custom URLs for custom scopes is also possible.
     */
    prefix: string;

    level: string;

    resource: string;

    operations: {
        create: boolean
        read  : boolean
        update: boolean
        delete: boolean
        search: boolean
    };

    query: URLSearchParams;

    constructor(input: string)
    {
        let match = input.match(/(.*)?\b(patient|user|system)\/([A_Za-z]+|\*)\.([cruds]{1,5})\?(.+)$/);
        if (match) {
            this.prefix     = match[1] || "";
            this.level      = match[2];
            this.resource   = match[3];
            this.operations = this.parseOperations(match[4])
            this.query      = new URLSearchParams(match[5] || "")
        }
    }

    private parseOperations(input: string) {
        const tokens = input.split("");

        const operations = {
            create: false,
            read  : false,
            update: false,
            delete: false,
            search: false,
        };

        const map = {
            c: 1,
            r: 2,
            u: 3,
            d: 4,
            s: 5
        };

        let last = 0
        tokens.forEach(token => {
            if (map[token] <= last) {
                throw new Error(
                    "Bad scope operations input. Scope operations " +
                    "must be 'cruds' or an ordered subset of it."
                )
            }

            last = map[token];

            switch (token) {
                case "c":
                    operations.create = true;
                break;
                case "r":
                    operations.read = true;
                break;
                case "u":
                    operations.update = true;
                break;
                case "r":
                    operations.delete = true;
                break;
                case "r":
                    operations.search = true;
                break;
            }
        });

        return operations;
    }
}
