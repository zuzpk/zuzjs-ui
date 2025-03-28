declare global {

    interface Window {
        fbq: (...args: any[]) => void;
        _fbq: any;
        gtag: (...args: any[]) => void;
        dataLayer: Record<string, any>[];
    }

    interface Object { 
        isTypeof( v: any ): boolean
        equals( v: any ): boolean
        isNull(): boolean
        isString(): boolean
        isNumber(): boolean
        isObject(): boolean
        isArray(): boolean
        isEmpty(): boolean
        isNotEmpty( v: any ): boolean
        isEmail( v: any ): boolean
        isUrl( v: any ): boolean,
        isIPv4( v: any ): boolean,
        toLowerCase(): string,
    }

    interface String {
        isHexColor(): boolean;
        isRgbaColor(): boolean;
        isHslColor(): boolean;
        isColor(): boolean;
        ucfirst(): string;
        toHMS(): string;
    }
}

export { };

