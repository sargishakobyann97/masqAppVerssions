import { ConvertTeamInfoResultTypes, HelpersProfileConverterTypes, InitialNewProfileStateTypes, LocalProfilesTypes } from "../../types";

function isPasswordContainSymbolOrNumber(pass: string): boolean {
    let firstRule = false;
    let secondRule = false;
    const password = pass.split("");
    for (let i = 0; i < password.length; i++) {
        const symbol = password[i];
        if (!firstRule && new RegExp("^[A-Za-z]+$").test(symbol)) firstRule = true;
        if (!secondRule && new RegExp("^[!@#$%^&*()-_+=;:,./\\`~{}]+$").test(symbol)) secondRule = true;
        if (firstRule && secondRule) return true;
    }
    return firstRule && secondRule;
}

function convertTeamInfo(pat: string): ConvertTeamInfoResultTypes {
    const [pathname, teamInfo] = pat.split("**teamId=");

    let teamId = "";
    let teamName = "";
    const result: ConvertTeamInfoResultTypes = {
        pathname,
        teamInfo: {
            teamId,
            teamName,
        },
    };
    if (teamInfo) {
        result.teamInfo.teamId = teamInfo.split("*teamName=")[0];
        result.teamInfo.teamName = teamInfo.split("*teamName=")?.[1]?.replaceAll("%20", " ");
    }
    return result;
}

function convertProfilesAsNeeded({ localProfiles, importedNewProfiles, isImportProfile }: HelpersProfileConverterTypes) {
    const newProfiles: InitialNewProfileStateTypes[] = [];

    if (localProfiles) {
        localProfiles.forEach((oldProfile) =>
            newProfiles.push({
                folderId: isImportProfile ? oldProfile.folderId + "" : "",
                name: oldProfile.name,
                os: "",
                platform: oldProfile.platform,
                browser: oldProfile.browser,
                browserVersion: oldProfile.browser_version,
                resolution: oldProfile.resolution,
                cpu: oldProfile.cpu,
                gpu: oldProfile.gpu,
                ram: oldProfile.ram,
                country: oldProfile.country,
                language: oldProfile.language,
                timezone: oldProfile.timezone,
                proxy: {
                    name: oldProfile.proxy.name,
                    protocol: oldProfile.proxy.name,
                    login: oldProfile.proxy.login,
                    password: oldProfile.proxy.password,
                    hostAndPort: oldProfile.proxy.hostAndPort,
                },
                geo: oldProfile.geo,
                geocode: oldProfile.geocode,
                cookies: { fileName: "", cookies: oldProfile.cookies.string },
                AFP: false,
                AWP: false,
                AAP: false,
                ACP: false,
                user_agent: oldProfile.user_agent,
                comment: oldProfile.comment,
                acceptEncoding: oldProfile.acceptEncoding,
                acceptStr: oldProfile.acceptStr,
                jsBaseCode: oldProfile.jsBaseCode,
                jsATDCode: oldProfile.jsATDCode,
            })
        );
    } else if (importedNewProfiles) {
        importedNewProfiles.forEach((newProfile) =>
            newProfiles.push({
                folderId: newProfile.folderId,
                name: newProfile.info.name,
                os: newProfile.info.os,
                platform: newProfile.info.platform,
                browser: newProfile.info.browser,
                browserVersion: newProfile.info.browser_version,
                resolution: newProfile.resolution,
                cpu: newProfile.cpu,
                gpu: newProfile.gpu,
                ram: newProfile.ram,
                country: newProfile.info.country,
                language: newProfile.languages,
                timezone: newProfile.info.timezone,
                proxy: newProfile.info.proxy,
                geo: newProfile.info.geo,
                geocode: newProfile.info.geocode,
                cookies: { fileName: "", cookies: newProfile.cookies + "" },
                AFP: false,
                AWP: false,
                AAP: false,
                ACP: false,
                user_agent: newProfile.userAgentStr,
                comment: newProfile.info.comment,
                acceptEncoding: newProfile.acceptEncoding,
                acceptStr: newProfile.acceptStr,
                jsBaseCode: newProfile.jsBaseCode,
                jsATDCode: newProfile.jsATDCode,
            })
        );
    }

    return newProfiles;
}

export const helpers = Object.freeze({ isPasswordContainSymbolOrNumber, convertTeamInfo, convertProfilesAsNeeded });
