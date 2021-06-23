
const RE_GT   = />/g;
const RE_LT   = /</g;
const RE_AMP  = /&/g;
const RE_QUOT = /"/g;

function htmlEncode(html) {
    return String(html)
        .trim()
        .replace(RE_AMP , "&amp;")
        .replace(RE_LT  , "&lt;")
        .replace(RE_GT  , "&gt;")
        .replace(RE_QUOT, "&quot;");
}

class OperationOutcome
{
    /**
     * 
     * @param {string} message 
     * @param {"fatal" | "error" | "warning" | "information"|string} [severity]
     * @param {string} [issueCode] see http://hl7.org/fhir/valueset-issue-type.html
     */
    constructor(message, issueCode = "processing", severity = "error")
    {
        this.message   = message
        this.issueCode = issueCode
        this.severity  = severity
    }

    toJSON()
    {
        return {
            "resourceType": "OperationOutcome",
            "text": {
                "status": "generated",
                "div": '<div xmlns="http://www.w3.org/1999/xhtml"><h1>Operation Outcome</h1>' +
                '<table border="0"><tr><td style="font-weight:bold;">ERROR</td><td>[]</td>' +
                '<td><pre>' + htmlEncode(this.message) + '</pre></td></tr></table></div>'
            },
            "issue": [
                {
                    "severity"   : this.severity,
                    "code"       : this.issueCode,
                    "diagnostics": this.message
                }
            ]
        }
    }
}

module.exports = OperationOutcome