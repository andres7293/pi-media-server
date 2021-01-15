
class PageViewCache {
    public cache: Map<string, number>;

    constructor() {
        this.cache = new Map();
    }

    public add(url: string): void {
        if (this.existsEntry(url)) {
            this.incrementEntry(url);
        }
        else {
            this.createEntry(url);
        }
    }
    public getCache(): any[] {
        var json: any[] = [];
        this.cache.forEach((value, key, map) => {
            json.push({url: key, counter: value});
        });
        return json;
    }

    private createEntry(url: string): void {
        this.cache.set(url, 1);
    }
    private incrementEntry(url: string): void {
        let counter = this.cache.get(url);
        if (counter === undefined) {
            throw new PageViewCacheError("Error incrementing undefined entry");
        }
        this.cache.set(url, counter + 1);
    }
    private existsEntry(url: string): boolean {
        if (this.cache.get(url) !== undefined)
            return true;
        else
            return false;
    }
}

class PageViewCacheError extends Error {
    public name: string;

    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export { PageViewCache }
