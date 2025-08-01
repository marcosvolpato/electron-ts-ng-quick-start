import { IPCEvent } from "../models/common.model";

export abstract class Executor {
  abstract execute(request: IPCEvent, onFinish: (data: IPCEvent) => void): void;
}