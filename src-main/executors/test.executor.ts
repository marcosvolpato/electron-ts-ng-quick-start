import { injectable } from "tsyringe";
import { Executor } from "./executor";
import { IPCEvent } from "../models/common.model";

@injectable()
export class TestExecutor extends Executor {
  execute(request: IPCEvent, onFinish: (data: IPCEvent) => void): void {
    const response: IPCEvent = {
      data: {
        message: '[response] Hello World - outside',
      }
    }
    if (request.reqId) {
      response.reqId = request.reqId;
    }
    onFinish(response);
  }
}