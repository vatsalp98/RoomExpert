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

export interface GeneratedRoom {
    id: string,
    createdAt: string,
    user_id: string,
    input_prompt: string,
    generated_image_url: string,
    user_image_url: string,
}

export interface Prediction {
    "id": string,
    "version": string,
    "urls": {
        "get": string,
        "cancel": string
    },
    "created_at": string,
    "started_at": string,
    "completed_at": string,
    "source": string,
    "status": string,
    "input": {
        "prompt": string,
        "a_prompt": string,
        "image": string,
        "n_prompt": string,
    },
    "output": string[],
    "error": string,
    "logs": string,
    "metrics": {
        "predict_time": number
    }
}