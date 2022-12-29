export default async function search(
    endpoint: string,
    source: string,
    accessToken: string,
    query: string,
    onResult: (err: any, res: Response | null, searchTime: Date) => void,
    proximity?: { longitude: number; latitude: number },
    country?: string,
    bbox?: number[],
    types?: string,
    limit?: number,
    autocomplete?: boolean,
    language?: string
) {
    const searchTime = new Date();
    try {
        const baseUrl = `${endpoint}/geocoding/v5/${source}/${query}.json`;
        // Don't send empty query params to Mapbox geocoding api.
        const searchParams = {
            ...(isNotNil(accessToken) && { access_token: accessToken }),
            ...(isNotNil(proximity) && {
                proximity:
                    proximity && Object.keys(proximity).length === 2
                        ? `${proximity.longitude},${proximity.latitude}`
                        : null,
            }),
            ...(isNotNil(bbox) && {
                bbox: bbox && bbox.length > 0 ? bbox.join(',') : null,
            }),

            ...(isNotNil(types) && {
                types,
            }),
            ...(isNotNil(country) && {
                country,
            }),
            ...(isNotNil(limit) && {
                limit,
            }),
            ...(isNotNil(autocomplete) && {
                autocomplete,
            }),
            ...(isNotNil(language) && {
                language,
            }),
        };
        const url = `${baseUrl}?${toUrlString(searchParams)}`;
        const res = await fetch(url);
        const data = await res.json();
        onResult(null, data, searchTime);
        return { err: null, res, searchTime };
    } catch (err) {
        onResult(err, null, searchTime);
        return { err, res: null, searchTime };
    }
}

function toUrlString(params: any) {
    return Object.keys(params)
        .map(
            (key) => encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
        )
        .join('&');
}

function isNotNil(value: unknown) {
    return value !== undefined && value !== null;
}  