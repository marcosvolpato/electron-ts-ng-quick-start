import { IPCEvent } from "../../src-shared/models/common.model";

export abstract class Executor {
  abstract execute(request: IPCEvent, onFinish: (data: IPCEvent) => void): void;
}