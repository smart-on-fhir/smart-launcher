const Lib = require("./lib");

module.exports = function(message) {
    return {
        "resourceType": "OperationOutcome",
        "text": {
            "status": "generated",
            "div": `<div xmlns="http://www.w3.org/1999/xhtml">
    <h1>Operation Outcome</h1>
    <table border="0">
        <tr>
            <td style="font-weight:bold;">ERROR</td>
            <td>[]</td>
            <td><pre>${Lib.htmlEncode(message)}</pre></td>
        </tr>
    </table>
</div>`
        },
        "issue": [
            {
                "severity": "error",
                "code": "processing",
                "diagnostics": message
            }
        ]
    };
};
