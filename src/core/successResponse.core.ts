'use strict';

import { ReasonError, StatusCode } from '~/constants';
import { Response } from 'express';

interface ISuccessResponses {
  message?: string;
  statusCode?: number;
  reasonStatusCode?: string;
  metadata?: any;
}

interface IOK {
  message?: string;
  metadata?: any;
}
interface ICREATED {
  options?: any;
  message?: string;
  statusCode?: number;
  reasonStatusCode?: string;
  metadata?: any;
}

class SuccessResponses {
  public message: string;
  public status: number;
  public data: any;
  public options?: any;

  constructor({ message, statusCode = StatusCode.OK, reasonStatusCode = ReasonError.OK, metadata }: ISuccessResponses) {
    this.message = !message ? reasonStatusCode : message;
    this.status = statusCode;
    this.data = metadata;
  }

  send(res: Response, headers = {}) {
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessResponses {
  constructor({ message, metadata }: IOK) {
    super({ message, metadata });
  }
}

class CREATED extends SuccessResponses {
  constructor({
    options = {},
    message,
    statusCode = StatusCode.CREATED,
    reasonStatusCode = ReasonError.CREATED,
    metadata
  }: ICREATED) {
    super({ message, statusCode, reasonStatusCode, metadata });
    this.options = options;
  }
}

export { SuccessResponses, CREATED, OK };
