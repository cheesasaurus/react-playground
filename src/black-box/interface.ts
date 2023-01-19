import { Dude, DudeMap, WeaponType } from "./models";

/**
 * Some black box (for example, a game engine providing the webview),
 * which exposes a way for the the web app to interface with it.
 */
export interface IBlackBox {

    /**
     * Pub/Sub style communication with the black box
     */
    socket: ISocket;

    /**
     * Services for request/response style communication with the black box
     */
    api: IApi;
}


export interface ISocket {

    /**
     * Subscribe to a particular message type.
     * @param messageType The type of message to subscribe to.
     * @param messageHandler Will be called every time that type of message comes through.
     * @returns A handle that can be passed to the `off` method to unsubscribe.
     */
    on: (messageType: string, messageHandler: MessageHandler) => MessageHandlerHandle;

    /**
     * Unsubscribe
     */
    off: (handle: MessageHandlerHandle) => void;
}


export interface IApi {
    debug: IDebugService;
    dudes: IDudeService;
}


export interface MessageHandler {
    (message: Message): void;
}


export interface MessageHandlerHandle {
    messageType: string;
    handler: MessageHandler;
}


export type MessageQueue = Array<Message>;


export interface Message {
    type: string;
    data: Object;
}


export interface ServiceError {
    code: string;
    message: string;
    detail?: string;
}


export interface IDebugService {
    emitMessageFromBlackBox(message: Message): Promise<void>;
}


// Dude service ///////////////////////////////////////////////////////////////////////

export interface IDudeService {
    createDude(name: string): Promise<ResponseCreateDude>;
    getDudes(): Promise<ResponseGetDudes>;
    updateDude(dude: RequestUpdateDude): Promise<ResponseUpdateDude>;
}

export interface ResponseCreateDude {
    errors?: Array<ServiceError>;
    data?: Dude; 
}

export interface RequestUpdateDude {
    id: number,
    name?: string,
    luckyNumber?: number,
    starterWeapon?: WeaponType,
}

export interface ResponseUpdateDude {
    errors?: Array<ServiceError>;
    data?: Dude;
}

export interface ResponseGetDudes {
    errors?: Array<ServiceError>;
    data?: DudeMap;
}




