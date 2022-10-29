import path from 'path';

import { requireModule } from '@nocobase/utils';

import FlowNodeModel from '../models/FlowNode';

import Plugin from '..';
import Processor from '../Processor';

export type Job = {
  status: number;
  result?: unknown;
  [key: string]: unknown;
} | null;

export type InstructionResult = Job | Promise<Job>;

// what should a instruction do?
// - base on input and context, do any calculations or system call (io), and produce a result or pending.
export interface Instruction {
  run(
    node: FlowNodeModel,
    // what should input to be?
    // - just use previously output result for convenience?
    input: any,
    // what should context to be?
    // - could be the workflow execution object (containing context data)
    processor: Processor
  ): InstructionResult;

  // for start node in main flow (or branch) to resume when manual sub branch triggered
  resume?(
    node: FlowNodeModel,
    input: any,
    processor: Processor
  ): InstructionResult
}

type InstructionConstructor<T> = { new(p: Plugin): T };

export default function<T extends Instruction>(
  plugin,
  more: { [key: string]: T | InstructionConstructor<T> } = {}
) {
  const { instructions } = plugin;

  const natives = [
    'calculation',
    'condition',
    'parallel',
    'delay',
    'prompt',
    'query',
    'create',
    'update',
    'destroy'
  ].reduce((result, key) => Object.assign(result, {
    [key]: requireModule(path.isAbsolute(key) ? key : path.join(__dirname, key))
  }), {});

  for (const [name, instruction] of Object.entries({ ...more, ...natives })) {
    instructions.register(name, typeof instruction === 'function'
      ? new (instruction as InstructionConstructor<T>)(plugin)
      : instruction
    );
  }
}
