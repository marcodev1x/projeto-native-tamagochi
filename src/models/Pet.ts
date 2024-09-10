export interface Pet {
    id: string;
    name: string;
    imageUri?: string;
    hunger: number;
    sleep: number;
    fun: number;
    lastUpdated?: number;
}
