export interface detectedObject {
    label: string,
    confidence: number,
    x_min: number,
    x_max: number,
    y_min: number,
    y_max: number,
}

export interface Product {
    img: string,
    price: string,
    title: string,
}