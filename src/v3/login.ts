import { Request, Response } from "express"
import * as got from "got"

interface LoginRequestQuery {
    patient: string
    login_type: "patient" | "provider"
    hide_navbar: any
}

type LoginRequest = Request<
    any, // params
    any, // response body
    any, // request body
    LoginRequestQuery,
    any // locals
>

function humanName(human, separator = " ") {
    var name = human.name || [];
    if (!Array.isArray(name)) {
        name = [ name ];
    }
    name = name[0];
    if (!name) name = { family: [ "No Name Listed" ] };
    
    var out = ["prefix", "given", "family"].map(type => {
        if (!name[type]) {
            name[type] = [ "" ];
        }
        if (!Array.isArray(name[type])) {
            name[type] = [ name[type] ];
        }
        return name[type].join(" ");
    });

    let result = out.filter(Boolean).join(separator);
    if (name.suffix) {
        result += ", " + name.suffix;
    }

    return result;
}

export async function loginAsProvider(req: LoginRequest, res: Response)
{
    const templateData = {
        title    : "Provider Login",
        query    : req.query,
        providers: [],
    };

    templateData.providers = (await got("http://r4.smarthealthit.org/Practitioner?_summary=true&_count=10&_sort=given", { json: true, }))
        .body.entry.map(e => ({ id: e.resource.id, name: humanName(e.resource) }));

    res.render("login-as-provider", templateData)
}

export async function loginAsPatient(req: LoginRequest, res: Response)
{
    const { patient = "" } = req.query;

    const templateData = {
        title   : "Patient Login",
        patients: patient.trim().split(/\s*,\s*/).filter(Boolean).map(p => ({ id: p, name: "Pre-selected Patient" })),
        humanName,
        query: req.query
    };

    if (!templateData.patients.length) {
        templateData.patients = (await got("http://r4.smarthealthit.org/Patient?_summary=true&_count=10&_sort=given", { json: true, }))
            .body.entry.map(e => ({ id: e.resource.id, name: humanName(e.resource) }))
    }

    res.render("login-as-patient", templateData)
}