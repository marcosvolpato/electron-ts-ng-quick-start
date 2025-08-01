import { container } from "tsyringe";
import { TestExecutor } from "./test.executor";
import { Executor } from "./executor";
import { constructor } from "tsyringe/dist/typings/types";

export class ExecutorResolver {

  private readonly executors: {token: string, useClass: constructor<Executor> }[] = [
    { token: 'TestExecutor', useClass: TestExecutor },
  ];

  constructor() {
    for (const executor of this.executors) {
      container.register<Executor>(executor.token, {
        useClass: executor.useClass,
      });
    }
  }

  resolve(token: string): Executor {
    const instance: Executor = container.resolve<Executor>(token);

    if (!instance) {
      throw new Error(`No instance found for token: ${token}`);
    }

    if (!(instance instanceof Executor)) {
      throw new Error(`Resolved instance is not an Executor: ${token}`);
    }
    
    return instance;
  }

  getExecutorsTokens(): string[] {
    return this.executors.map(executor => executor.token);
  }
}