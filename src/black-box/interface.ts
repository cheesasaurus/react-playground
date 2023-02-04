import { Subscription } from "../utils";
import { Profession } from "./exposed/DudeModifierPresets/Professions";
import { Race } from "./exposed/DudeModifierPresets/Races";
import { Dude, DudeMap, EquipmentMap, EquipmentSlot, SimulationData, UUID } from "./exposed/models";
import { ActionMap } from "./exposed/Models/Action";

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
    on: (messageType: string, messageHandler: SocketMessageHandler) => Subscription;
}


export interface IApi {
    debug: IDebugApi;
    dudes: IDudeApi;
    simulation: ISimulationApi;
}


export interface SocketMessageHandler {
    (message: SocketMessage): void;
}


export enum SocketMessageType {
    DudesCreated = 'DudesCreated',
    DudesUpdated = 'DudesUpdated',
    SimulationStatus = 'SimulationStatus',
    Models = 'Models',
}

export interface SocketMessage {
    id: UUID;
    type: string;
    data: Object;
}

export interface SocketMessageDataDudes {
    dudes: DudeMap,
    equipment: EquipmentMap,
    actions: ActionMap,
}

export interface SocketMessageDataSimulation {
    simulation: SimulationData,
}

export interface SocketMessageDataModels {
    updated: {
        dudes: DudeMap,
        equipment: EquipmentMap,
        actions: ActionMap,
    },
    deleted: {
        dudes: UUID[],
        equipment: UUID[],
        actions: UUID[],
    },
}


export interface ApiError {
    code: string;
    message: string;
    detail?: string;
}

export type ApiErrors = ApiError[];


export interface IDebugApi {
    emitMessageFromBlackBox(message: SocketMessage): Promise<void>;
}

export interface ISimulationApi {
    play(): Promise<void>;
    pause(): Promise<void>;
    getSimulationData(): Promise<ResponseGetSimulationData>;
}

export interface ResponseGetSimulationData {
    errors?: ApiErrors;
    data?: SimulationData;
}


// Dude service ///////////////////////////////////////////////////////////////////////

export interface IDudeApi {
    createDude(name: string): Promise<ResponseCreateDude>;
    getAllDudes(): Promise<ResponseGetDudes>;
    getDude(dudeId: UUID): Promise<ResponseGetDude>;
    updateDude(dude: RequestUpdateDude): Promise<ResponseUpdateDude>;
    swapEquipmentWithOtherDude(slot: EquipmentSlot, dude1Id: string, dude2Id: string): Promise<ResponseSwapEquipmentWithOtherDude>;
}

export interface DudeApiResponseDataMulti {
    dudes: DudeMap,
    equipment: EquipmentMap,
    actions: ActionMap,
}

export interface DudeApiResponseDataSingle {
    dude: Dude,
    equipment: EquipmentMap,
    actions: ActionMap,
}

export interface ResponseCreateDude {
    errors?: ApiErrors;
    data?: DudeApiResponseDataSingle;
}

export interface RequestUpdateDude {
    id: string,
    name?: string,
    race?: Race,
    profession?: Profession,
    creationStep?: number,
    finishCreation?: boolean,
}

export interface ResponseUpdateDude {
    errors?: ApiErrors;
    data?: DudeApiResponseDataSingle;
}

export interface ResponseGetDudes {
    errors?: ApiErrors;
    data?: DudeApiResponseDataMulti;
}

export interface ResponseGetDude {
    errors?: ApiErrors;
    data?: DudeApiResponseDataSingle;
}

export interface ResponseSwapEquipmentWithOtherDude {
    errors?: ApiErrors;
}

