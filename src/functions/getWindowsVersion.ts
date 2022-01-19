const MAJOR_VERSION_10 = 10
const FIRST_11_BUILD = 22000

export enum WindowVersion {
	Ten,
	Eleven,
    Other
}

function getWindowsVersion(release: string) {
    const [major,,build,] = release.split('.').map(Number)
	
    if(major === MAJOR_VERSION_10 && build >= FIRST_11_BUILD) {
        return WindowVersion.Eleven
    }
    if(major === MAJOR_VERSION_10) {
        return WindowVersion.Ten
    }

    return WindowVersion.Other
}

export default getWindowsVersion;
