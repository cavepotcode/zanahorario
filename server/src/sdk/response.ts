export class Metadata {
    code: number;
    message: string;

    constructor(code: number, message: string){
        this.code = code;
        this.message = message;
    }
}

export class ResponseOut {
    data: any;
    meta: Metadata;

    constructor(code: number, message: string, result?: any) {
        this.data = result;
        this.meta = new Metadata(code, message);
    }
}

