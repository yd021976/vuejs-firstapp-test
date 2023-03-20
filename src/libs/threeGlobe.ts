import threeGlobe from 'three-globe';

export class Globe {
    globeObject: threeGlobe = new threeGlobe()
    labelDataOriginal: worldData = []

    public async init(worldURI: String = './world-low-resolution.json') {
        return this.loadWorldData(worldURI).then((countries) => {
            this.labelDataOriginal = countries.features.map((country) => {
                return {
                    lat: country.properties.label_y,
                    lng: country.properties.label_x,
                    size: 0.4,
                    color: 'white',
                    country: country.properties.name
                }
            })
            this.globeObject
                .globeImageUrl('./earth-day.jpg')
                .bumpImageUrl('./earth-topology.png')
                .polygonsData(countries.features)
                .polygonCapColor(() => 'rgba(200, 0, 0, 0.7)')
                .polygonSideColor(() => 'rgba(0, 200, 0, 0.0)')
                .polygonStrokeColor(() => '#111')
                .labelsData(this.labelDataOriginal)
                .labelText((obj: any) => {
                    return obj.country
                })
                .labelSize((obj: any) => {
                    return obj.size
                })
                .labelAltitude(0.01)
        })
    }

    /**
     * 
     * @param worldURI 
     * @returns 
     */
    private async loadWorldData(worldURI: String) {
        return fetch(worldURI.valueOf())
            .then(res => res.json())
            .then(countries => {
                return countries
            })
    }
}

export interface world {
    lat: number
    lng: number
    size: number
    color: string
    country: string
}
export type worldData = world[]